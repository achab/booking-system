import booking from "./booking";
import web3 from "./web3";
var data = require("../components/data.json");

// define arrays from parsed json
var timeslots = data["timeslots"];
var companies = data["companies"];
var roomnumbers = data["roomnumbers"];

// define constants related to issuance
const issuanceAmount = 1;
const VALID_CERTIFICATE =
  "0x1000000000000000000000000000000000000000000000000000000000000000";

issueByPart = async partition => {
  const accounts = await web3.eth.getAccounts();
  await booking.methods
    .issueByPartition(partition, accounts[0], issuanceAmount, VALID_CERTIFICATE)
    .send({ from: accounts[0], gasLimit: "1000000" })
    .then(result => console.log("tmp:", result))
    .catch(err => console.error(err));
};

function getId(timeslot_index, company_index, roomnumber_index, status_index) {
  return "".concat(
    timeslot_index,
    company_index,
    roomnumber_index,
    status_index
  );
}

function getPartition(
  timeslot_index,
  company_index,
  roomnumber_index,
  status_index
) {
  var id = getId(timeslot_index, company_index, roomnumber_index, status_index);
  return "".concat(VALID_CERTIFICATE.slice(0, -4), id);
}

// define list of partitions we'd like to issue
var partitions = [];
for (var i = 0; i < timeslots.length; i++) {
  for (var j = 0; j < companies.length; j++) {
    for (var k = 0; k < roomnumbers.length; k++) {
      var partition = getPartition(i, j, k, 0);
      partitions.push(partition);
    }
  }
}

// issue one token per
partitions.map(partition => issueByPart(partition));

// export
module.exports = { getId: getId };
