import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

// Permit2 address on the target Tron network.
// base58: TYQuuhGbEMxF7nZxUHV3uHJxAVVAegNU9h
// Override with PERMIT2_ADDRESS if the target Tron network uses a different one.
const CANONICAL_PERMIT2 = '0xf62f506D1FaA02e2354a9886B4A200496EE96F4b';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const permit2 = process.env.PERMIT2_ADDRESS || CANONICAL_PERMIT2;

  await deploy('x402ExactPermit2Proxy', {
    from: deployer,
    args: [permit2],
    log: true,
  });
};
export default func;
func.tags = ['x402ExactPermit2Proxy'];
