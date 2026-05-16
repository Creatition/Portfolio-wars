/**
 * Basic invariant tests for FundingContract.sol.
 *
 * These tests exercise the stub. The real audit-ready test suite must cover:
 *  - EIP-712 voucher verification (positive + negative)
 *  - Replay protection across periods and tiers
 *  - Cap enforcement at the exact boundary and beyond
 *  - Pause-only emergency stop semantics
 *  - Reentrancy attempts via competition wallets that revert
 *  - Front-running guarantees (signature pinning)
 */

import { expect } from "chai";
import hre from "hardhat";

describe("FundingContract (stub)", () => {
  async function deploy() {
    const [signer, pauser, primary] = await hre.ethers.getSigners();
    const Factory = await hre.ethers.getContractFactory("FundingContract");
    const c = await Factory.deploy(signer.address, pauser.address);
    await c.waitForDeployment();
    // Pre-fund the contract so it can disburse.
    await signer.sendTransaction({ to: await c.getAddress(), value: hre.ethers.parseEther("1000000000") });
    return { c, signer, pauser, primary };
  }

  it("initializes funding amounts for both tiers", async () => {
    const { c } = await deploy();
    expect(await c.fundingAmount(0)).to.equal(hre.ethers.parseEther("10000000"));
    expect(await c.fundingAmount(1)).to.equal(hre.ethers.parseEther("100000000"));
  });

  it("computes the same deterministic competition wallet across calls", async () => {
    const { c, primary } = await deploy();
    const startsAt = 1_715_817_600n; // arbitrary
    const a = await c.competitionWalletFor(primary.address, 0, startsAt, 0);
    const b = await c.competitionWalletFor(primary.address, 0, startsAt, 0);
    expect(a).to.equal(b);
  });

  it("pauser can pause and unpause", async () => {
    const { c, pauser } = await deploy();
    await c.connect(pauser).pause();
    expect(await c.paused()).to.equal(true);
    await c.connect(pauser).unpause();
    expect(await c.paused()).to.equal(false);
  });

  it("non-pauser cannot pause", async () => {
    const { c, primary } = await deploy();
    await expect(c.connect(primary).pause()).to.be.revertedWithCustomError(c, "NotPauser");
  });
});
