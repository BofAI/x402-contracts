import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TronWeb = require('tronweb').TronWeb || require('tronweb');

// Convert a Tron base58 address to its 20-byte EVM hex form (drops the 0x41 prefix).
const toEvmAddress = (addr: string): string =>
  addr.startsWith('0x') ? addr : '0x' + TronWeb.address.toHex(addr).slice(2);

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  // ERC3009DepositCollector forwards pulled tokens to x402BatchSettlement.
  // Override with X402_BATCH_SETTLEMENT to target an existing deployment.
  const batchSettlement = toEvmAddress(
    process.env.X402_BATCH_SETTLEMENT || (await get('x402BatchSettlement')).address
  );

  await deploy('ERC3009DepositCollector', {
    from: deployer,
    args: [batchSettlement],
    log: true,
  });
};
export default func;
func.tags = ['ERC3009DepositCollector'];
func.dependencies = ['x402BatchSettlement'];
