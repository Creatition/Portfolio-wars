# Portfolio Wars — Smart Contracts

The `FundingContract` is the only on-chain code Portfolio Wars deploys in v1.
It mints a deterministic competition wallet for each (alias, tier, period)
and disburses real PLS into it.

## Status

**STUB. Not audited. Do not deploy to mainnet.**

This package compiles, tests, and demonstrates the contract's intended
interface and core invariants. Before any mainnet deployment, the following
gates must clear:

1. EIP-712 voucher verification — full implementation + tests
2. CREATE2 minimal-account factory — replace the stub `_deriveCompetitionWallet`
3. Two independent audits (Spearbit + ChainSecurity recommended)
4. Immunefi bug bounty live for ≥ 14 days
5. Time-locked upgrade key (7-day delay) wired to a multi-sig
6. Pause-only emergency key tested end-to-end

See `Portfolio_Wars_Architecture_Plan.docx` §5 and §15.

## Local development

```bash
npm install
npm run compile
npm run test
```

## Networks

| Network              | Chain ID | RPC                                              |
|----------------------|----------|--------------------------------------------------|
| PulseChain Mainnet   | 369      | https://rpc.pulsechain.com                       |
| PulseChain Testnet v4 | 943     | https://rpc.v4.testnet.pulsechain.com            |
| Hardhat local         | 31337   | http://127.0.0.1:8545                            |

## Environment

```
DEPLOYER_KEY=0x...      # only for testnet/mainnet
FUNDING_SIGNER=0x...    # backend EIP-712 signer (real address in prod)
FUNDING_PAUSER=0x...    # multi-sig with pause-only authority
```
