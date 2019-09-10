pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TimeTable.sol";

contract TestTimeTable {

  function testInitialStatus() public {
    uint n_timeslots = 3;
    uint n_rooms = 4;
    TimeTable timetable = new TimeTable(n_timeslots, n_rooms);

    uint id = 0;
    Assert.equal(timetable.getAvailability()[id], true, "After deployment, all rooms should be free.");
    Assert.equal(timetable.getOwners()[id], 0x0, "After deployment, `0x0` should own all rooms.");
  }

  function testBookAndCancel() public {
    uint n_timeslots = 3;
    uint n_rooms = 4;
    TimeTable timetable = new TimeTable(n_timeslots, n_rooms);

    uint timeslot = 2;
    uint room = 1;
    uint id = timetable.getId(timeslot, room);

    bytes32 owner = 0x0;
    bytes32 password = 0x0;

    // book the room
    timetable.bookRoom(timeslot, room, owner, password);
    Assert.equal(timetable.getAvailability()[id], false, "This room should be booked.");
    // cancel the room
    timetable.cancelReservation(timeslot, room, owner, password);
    Assert.equal(timetable.getAvailability()[id], true, "This room should be free.");
  }

}
