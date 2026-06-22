import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('PaymentPermit', {
    from: deployer,
    args: [],
    log: true,
  });
};
export default func;
func.tags = ['PaymentPermit'];
// PaymentPermit is a legacy contract and is no longer deployed.
// Always skipped (applies to full deploys and `--tags PaymentPermit` alike);
// remove this guard if it ever needs to be deployed again.
func.skip = async () => true;
