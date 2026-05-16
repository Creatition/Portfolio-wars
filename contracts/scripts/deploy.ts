/**
 * Deploys FundingContract.
 * For local dev only. For mainnet/testnet, this needs:
 *   - A signer multi-sig
 *   - A pauser multi-sig
 *   - Pre-stocked Cold Treasury
 *   - Audit sign-off
 */

import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const SIGNER  = process.env.FUNDING_SIGNER ?? deployer.address;
  const PAUSER  = process.env.FUNDING_PAUSER ?? deployer.address;

  const Factory = await hre.ethers.getContractFactory("FundingContract");
  const c = await Factory.deploy(SIGNER, PAUSER);
  await c.waitForDeployment();

  console.log("FundingContract deployed at:", await c.getAddress());
}

main().catch((err) => { console.error(err); process.exit(1); });
