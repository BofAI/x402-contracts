import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

// Canonical Permit2 address, identical on all EVM chains (deployed via CREATE2).
const CANONICAL_PERMIT2 = '0x000000000022D473030F116dDEE9F6B43aC78BA3';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const permit2 = process.env.PERMIT2_ADDRESS || CANONICAL_PERMIT2;

  await deploy('x402UptoPermit2Proxy', {
    from: deployer,
    args: [permit2],
    log: true,
  });
};
export default func;
func.tags = ['x402UptoPermit2Proxy'];
