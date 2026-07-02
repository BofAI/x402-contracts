import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

// Permit2 address per Tron network (Shasta has no Permit2 deployed).
// Override with PERMIT2_ADDRESS to target a different one.
//   tron (mainnet): TTJxU3P8rHycAyFY4kVtGNfmnMH4ezcuM9
//   nile (testnet): TYQuuhGbEMxF7nZxUHV3uHJxAVVAegNU9h
const PERMIT2_BY_NETWORK: Record<string, string> = {
  tron: '0xbe365314f2e77fd1257d60c346bb32dbda369403',
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
