pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TimeTable.sol";

contract TestTimeTable {

  function testEncodingDecoding() public {
    TimeTable timetable = new TimeTable(1, 2);
    bytes32 b = 0x0;
    address bEncoded = timetable.bytes32ToAddress(b);
    bytes32 bEncodedDecoded = timetable.addressToBytes32(bEncoded);
    address bEncodedDecodedEncoded = timetable.bytes32ToAddress(bEncodedDecoded);

    Assert.equal(bEncodedDecoded, b, "Decoding an encoded bytes32 gives the original value.");
    Assert.equal(bEncodedDecodedEncoded, bEncoded, "Decoding an encoded address gives the original value.");
  }

  function testInitialStatus() public {
    TimeTable timetable = new TimeTable(4, 3);
    uint id = 0;
    address creatorAddress = timetable.creator();
    bytes32 creatorBytes32 = timetable.addressToBytes32(creatorAddress);

    Assert.equal(timetable.getAvailability()[id], true, "After deployment, all rooms should be free.");
    Assert.equal(timetable.ownerOf(id), creatorAddress, "After deployment, `creator` should own all tokens.");
    Assert.equal(timetable.getOwners()[id], creatorBytes32, "After deployment, `creator` should own all tokens.");
  }

  function testBookAndCancel() public {
    uint n_timeslots = 3;
    uint n_rooms = 4;
    uint timeslot = 2;
    uint room = 1;
    TimeTable timetable = new TimeTable(n_timeslots, n_rooms);
    uint id = timetable.getTokenId(timeslot, room);
    bytes32 owner = 0x7465737400000000000000000000000000000000000000000000000000000000;

    // book the room
    timetable.bookRoom(timeslot, room, owner);
    Assert.equal(timetable.getAvailability()[id], false, "This room should be booked.");
    // cancel the room
    timetable.cancelReservation(timeslot, room, owner);
    Assert.equal(timetable.getAvailability()[id], true, "This room should be free.");
  }

  function testConsistencyOwnersArrayAndOwnerOfFunction() public {
    TimeTable tt = new TimeTable(3, 3);

    uint timeslot1 = 0; uint room1 = 0; uint tokenId1 = tt.getTokenId(timeslot1, room1);
    uint timeslot2 = 1; uint room2 = 1; uint tokenId2 = tt.getTokenId(timeslot2, room2);
    uint timeslot3 = 2; uint room3 = 2; uint tokenId3 = tt.getTokenId(timeslot3, room3);

    // define owners address (in bytes32)
    bytes32 owner1 = 0x6F776E6572310000000000000000000000000000000000000000000000000000;
    bytes32 owner2 = 0x6F776E6572320000000000000000000000000000000000000000000000000000;
    bytes32 owner3 = 0x6F776E6572330000000000000000000000000000000000000000000000000000;

    // book rooms
    tt.bookRoom(timeslot1, room1, owner1);
    tt.bookRoom(timeslot2, room2, owner2);
    tt.bookRoom(timeslot3, room3, owner3);

    Assert.equal(tt.bytes32ToAddress(tt.getOwners()[tokenId1]), tt.ownerOf(tokenId1), "Consistency error for `owner1`.");
    Assert.equal(tt.bytes32ToAddress(tt.getOwners()[tokenId2]), tt.ownerOf(tokenId2), "Consistency error for `owner2`.");
    Assert.equal(tt.bytes32ToAddress(tt.getOwners()[tokenId3]), tt.ownerOf(tokenId3), "Consistency error for `owner3`.");
  }

}
