import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

// Canonical Permit2 address, identical on all EVM chains (deployed via CREATE2).
// Override with PERMIT2_ADDRESS if the target Tron network uses a different one.
const CANONICAL_PERMIT2 = '0xBE365314f2E77FD1257d60C346Bb32DbDa369403';

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
