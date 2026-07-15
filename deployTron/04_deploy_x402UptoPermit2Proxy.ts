import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

// Permit2 address per Tron network.
// Override with PERMIT2_ADDRESS to target a different one.
//   tron (mainnet): TTJxU3P8rHycAyFY4kVtGNfmnMH4ezcuM9
//   nile (testnet): TYQuuhGbEMxF7nZxUHV3uHJxAVVAegNU9h
//   shasta (testnet): TJMkP7a3ucTMkvi17p7ChhTCw6zriFX3tg
const PERMIT2_BY_NETWORK: Record<string, string> = {
  tron: '0xbe365314f2e77fd1257d60c346bb32dbda369403',
  shasta: '0x5c045a33b71c50eecc94618451bf7436ded5564f',
  nile: '0xf62f506D1FaA02e2354a9886B4A200496EE96F4b',
};

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const permit2 = process.env.PERMIT2_ADDRESS || PERMIT2_BY_NETWORK[hre.network.name];
  if (!permit2) {
    throw new Error(
      `No Permit2 address for network "${hre.network.name}". Set PERMIT2_ADDRESS to override.`
    );
  }

  await deploy('x402UptoPermit2Proxy', {
    from: deployer,
    args: [permit2],
    log: true,
  });
};
export default func;
func.tags = ['x402UptoPermit2Proxy'];
