const TimeTable = artifacts.require("./TimeTable.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(TimeTable, 10, 10, accounts[0]);
}
