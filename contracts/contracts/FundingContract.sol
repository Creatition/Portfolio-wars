// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title FundingContract
 * @notice Disburses PLS to deterministically-generated competition wallets for Portfolio Wars.
 * @dev This contract is the only on-chain code Portfolio Wars deploys in v1.
 *
 *      ───────────────────────────────────────────────────────────────────────────────
 *      STATUS: STUB — NOT AUDITED, DO NOT DEPLOY TO MAINNET.
 *
 *      This file specifies the interface and core invariants. Real implementation
 *      requires:
 *        - EIP-712 voucher verification (signed off-chain by the backend Entry service)
 *        - CREATE2 minimal-account factory
 *        - Per-period cap accounting
 *        - Pause-only emergency stop (multi-sig)
 *        - Two independent audits (Spearbit, ChainSecurity recommended)
 *        - Immunefi bug bounty
 *
 *      See Portfolio_Wars_Architecture_Plan.docx §5 (Treasury) and §15 (Security).
 *      ───────────────────────────────────────────────────────────────────────────────
 *
 * @custom:invariant Each (alias, tier, period) tuple may be funded at most once.
 * @custom:invariant Per-period cap is never exceeded.
 * @custom:invariant Only the configured signer can authorize entries.
 * @custom:invariant Contract cannot move PLS except via enter() — no admin sweep.
 */
contract FundingContract {
    // -----------------------------------------------------------------------
    // Errors
    // -----------------------------------------------------------------------
    error AlreadyFunded(bytes32 entryKey);
    error CapExceeded(bytes32 periodKey, uint32 cap, uint32 entries);
    error InvalidSignature();
    error UnknownTier();
    error UnknownPeriod();
    error TransferFailed();
    error NotPauser();
    error Paused();

    // -----------------------------------------------------------------------
    // Events
    // -----------------------------------------------------------------------

    /// @notice Emitted when a competition wallet is funded.
    event Funded(
        bytes32 indexed aliasHash,
        uint8 indexed tier,
        bytes32 indexed periodKey,
        address competitionWallet,
        address primaryWallet,
        uint256 amountPls,
        uint64 timestamp
    );

    /// @notice Emitted when caps are updated by admin.
    event CapUpdated(bytes32 indexed periodKey, uint32 newCap);

    /// @notice Emitted on pause/unpause.
    event PauseChanged(bool paused);

    // -----------------------------------------------------------------------
    // Types
    // -----------------------------------------------------------------------

    /// @dev Tier values: 0 = TEN_M (10,000,000 PLS), 1 = HUNDRED_M (100,000,000 PLS).
    enum Tier { TEN_M, HUNDRED_M }

    /// @dev Period kind: 0 = WEEKLY, 1 = MONTHLY, 2 = YEARLY.
    enum Period { WEEKLY, MONTHLY, YEARLY }

    /// @dev EIP-712 voucher signed by the backend Entry service.
    struct EntryVoucher {
        bytes32 aliasHash;        // keccak256(lowercase(alias))
        address primaryWallet;    // player's primary wallet
        Tier    tier;
        Period  period;
        uint64  startsAt;         // competition window start (unix)
        uint64  endsAt;           // competition window end (unix)
        uint64  nonce;            // per-(alias,period,tier) nonce to bind a voucher
        bytes   signature;        // EIP-712 signature by `signer`
    }

    // -----------------------------------------------------------------------
    // Storage
    // -----------------------------------------------------------------------

    /// @notice The trusted backend signer. Only signatures by this address are accepted.
    address public immutable signer;

    /// @notice Multisig that can pause entries (cannot move PLS).
    address public pauser;

    /// @notice Funding amounts per tier, in PLS wei.
    mapping(Tier => uint256) public fundingAmount;

    /// @notice Per-period entry cap. Key = keccak256(period, periodIdentifier).
    mapping(bytes32 => uint32) public capByPeriod;

    /// @notice Count of entries funded for a given period.
    mapping(bytes32 => uint32) public entriesByPeriod;

    /// @notice Set of (alias, tier, period) tuples already funded — prevents double-funding.
    mapping(bytes32 => bool) public funded;

    bool public paused;

    // -----------------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------------

    constructor(address _signer, address _pauser) {
        require(_signer != address(0), "signer=0");
        require(_pauser != address(0), "pauser=0");
        signer = _signer;
        pauser = _pauser;

        // PLS denominated in 18 decimals (matches ETH-compatible chain).
        fundingAmount[Tier.TEN_M]     =  10_000_000 ether;
        fundingAmount[Tier.HUNDRED_M] = 100_000_000 ether;
    }

    // -----------------------------------------------------------------------
    // Modifiers
    // -----------------------------------------------------------------------

    modifier whenNotPaused() {
        if (paused) revert Paused();
        _;
    }

    modifier onlyPauser() {
        if (msg.sender != pauser) revert NotPauser();
        _;
    }

    // -----------------------------------------------------------------------
    // External: enter
    // -----------------------------------------------------------------------

    /**
     * @notice Fund a competition wallet for an authorized entry.
     * @param v Voucher signed by the backend Entry service.
     * @return competitionWallet The deterministic address that received funding.
     *
     * Requirements:
     *  - Contract is not paused.
     *  - Voucher signature recovers to `signer`.
     *  - (alias, tier, period) has not been funded before.
     *  - Per-period cap is not exceeded.
     *
     * Side effects:
     *  - Marks the entry tuple as funded.
     *  - Increments the period entry count.
     *  - Transfers `fundingAmount[tier]` PLS to the deterministic wallet.
     *  - Emits Funded.
     */
    function enter(EntryVoucher calldata v)
        external
        whenNotPaused
        returns (address competitionWallet)
    {
        // TODO: EIP-712 hash + ECDSA.recover(v.signature) must equal signer.
        // TODO: Validate v.tier / v.period are in range.
        // TODO: Validate now within [v.startsAt, v.endsAt].

        bytes32 periodKey  = _periodKey(v.period, v.startsAt, v.tier);
        bytes32 entryKey   = keccak256(abi.encodePacked(v.aliasHash, v.tier, periodKey));

        if (funded[entryKey]) revert AlreadyFunded(entryKey);

        uint32 cap = capByPeriod[periodKey];
        uint32 count = entriesByPeriod[periodKey];
        if (cap != 0 && count >= cap) revert CapExceeded(periodKey, cap, count);

        funded[entryKey] = true;
        entriesByPeriod[periodKey] = count + 1;

        competitionWallet = _deriveCompetitionWallet(v.primaryWallet, periodKey, v.tier);

        uint256 amount = fundingAmount[v.tier];
        (bool ok, ) = competitionWallet.call{ value: amount }("");
        if (!ok) revert TransferFailed();

        emit Funded(
            v.aliasHash,
            uint8(v.tier),
            periodKey,
            competitionWallet,
            v.primaryWallet,
            amount,
            uint64(block.timestamp)
        );
    }

    // -----------------------------------------------------------------------
    // Admin: caps and pause
    // -----------------------------------------------------------------------

    function setCap(bytes32 periodKey, uint32 cap) external onlyPauser {
        capByPeriod[periodKey] = cap;
        emit CapUpdated(periodKey, cap);
    }

    function pause() external onlyPauser {
        paused = true;
        emit PauseChanged(true);
    }

    function unpause() external onlyPauser {
        paused = false;
        emit PauseChanged(false);
    }

    // -----------------------------------------------------------------------
    // Views
    // -----------------------------------------------------------------------

    function isFunded(bytes32 aliasHash, Tier tier, Period period, uint64 startsAt)
        external
        view
        returns (bool)
    {
        bytes32 periodKey  = _periodKey(period, startsAt, tier);
        bytes32 entryKey   = keccak256(abi.encodePacked(aliasHash, tier, periodKey));
        return funded[entryKey];
    }

    function competitionWalletFor(address primary, Period period, uint64 startsAt, Tier tier)
        external
        view
        returns (address)
    {
        bytes32 periodKey = _periodKey(period, startsAt, tier);
        return _deriveCompetitionWallet(primary, periodKey, tier);
    }

    // -----------------------------------------------------------------------
    // Internal
    // -----------------------------------------------------------------------

    function _periodKey(Period p, uint64 startsAt, Tier t) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(uint8(p), startsAt, uint8(t)));
    }

    /**
     * @dev Derive the deterministic competition wallet.
     *      Real implementation uses CREATE2 with a minimal-account proxy.
     *      Stub: returns a deterministic address derived from inputs.
     */
    function _deriveCompetitionWallet(address primary, bytes32 periodKey, Tier tier)
        internal
        pure
        returns (address)
    {
        bytes32 h = keccak256(abi.encodePacked(primary, periodKey, uint8(tier)));
        return address(uint160(uint256(h)));
    }

    // -----------------------------------------------------------------------
    // Receive — Treasury tops up the contract by sending PLS to it.
    // -----------------------------------------------------------------------

    receive() external payable {}
}
