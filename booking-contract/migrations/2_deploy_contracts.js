const TimeTable = artifacts.require("./TimeTable.sol");

module.exports = function(deployer) {
  deployer.deploy(TimeTable, 10, 10);
};
