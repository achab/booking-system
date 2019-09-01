pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TimeTable.sol";

contract TestTimeTable {

  function testInitialStatus() public {
    uint n_timeslots = 3;
    uint n_rooms = 4;
    TimeTable timetable = new TimeTable(n_timeslots, n_rooms, msg.sender);

    uint id = 0;

    Assert.equal(timetable.getAvailability()[id], false, "After deployment, all rooms should be free.");
    Assert.equal(timetable.getOwners()[id], timetable.manager(), "After deployment, `manager` should own all rooms.");
  }

  function testBookAndCancel() public {
    uint n_timeslots = 3;
    uint n_rooms = 4;
    TimeTable timetable = new TimeTable(n_timeslots, n_rooms, msg.sender);

    uint timeslot = 2;
    uint room = 1;
    uint id = timetable.getId(timeslot, room);

    // book the room
    timetable.bookRoom(timeslot, room);
    Assert.equal(timetable.getAvailability()[id], true, "This room should be booked.");
    // cancel the room
    timetable.cancelReservation(timeslot, room);
    Assert.equal(timetable.getAvailability()[id], false, "This room should be free.");
  }

}
