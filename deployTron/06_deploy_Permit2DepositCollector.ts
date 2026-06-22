import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TronWeb = require('tronweb').TronWeb || require('tronweb');

// Permit2 address per Tron network (Shasta has no Permit2 deployed).
// Override with PERMIT2_ADDRESS to target a different one.
//   tron (mainnet): TTJxU3P8rHycAyFY4kVtGNfmnMH4ezcuM9
//   nile (testnet): TYQuuhGbEMxF7nZxUHV3uHJxAVVAegNU9h
const PERMIT2_BY_NETWORK: Record<string, string> = {
  tron: '0xbe365314f2e77fd1257d60c346bb32dbda369403',
  nile: '0xf62f506D1FaA02e2354a9886B4A200496EE96F4b',
};

// Convert a Tron base58 address to its 20-byte EVM hex form (drops the 0x41 prefix).
const toEvmAddress = (addr: string): string =>
  addr.startsWith('0x') ? addr : '0x' + TronWeb.address.toHex(addr).slice(2);

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  // Permit2DepositCollector forwards Permit2 transfers to x402BatchSettlement.
  // Override with X402_BATCH_SETTLEMENT to target an existing deployment.
  const batchSettlement = toEvmAddress(
    process.env.X402_BATCH_SETTLEMENT || (await get('x402BatchSettlement')).address
  );
  const permit2 = process.env.PERMIT2_ADDRESS || PERMIT2_BY_NETWORK[hre.network.name];
  if (!permit2) {
    throw new Error(
      `No Permit2 address for network "${hre.network.name}". Set PERMIT2_ADDRESS to override.`
    );
  }

  await deploy('Permit2DepositCollector', {
    from: deployer,
    args: [batchSettlement, permit2],
    log: true,
  });
};
export default func;
func.tags = ['Permit2DepositCollector'];
func.dependencies = ['x402BatchSettlement'];
