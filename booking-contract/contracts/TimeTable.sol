pragma solidity ^0.5.0;


contract TimeTable {

    uint public n_timeslots;
    uint public n_rooms;
    bytes32[] public owners;
    bytes32[] public passwords;
    bool[] public availability;

    event ReservationHasChanged(uint timeslot, uint room, bytes32 owner);

    constructor(uint n_timeslots_, uint n_rooms_) public {
        n_timeslots = n_timeslots_;
        n_rooms = n_rooms_;
        initTable(n_timeslots, n_rooms);
    }

    function initTable(uint n_rows, uint n_cols) internal {
      for (uint i = 0; i < n_rows; i++) {
        for (uint j = 0; j < n_cols; j++) {
          owners.push("");
          passwords.push("");
          availability.push(true);
        }
      }
    }

    function getId(uint timeslot, uint room) public view returns (uint) {
      // timeslot and room start at 0
      uint id = timeslot * n_rooms + room;
      return id;
    }

    function bookRoom(uint timeslot, uint room, bytes32 owner, bytes32 password) public {
      uint id = getId(timeslot, room);
      require(availability[id], "The room is not available !");
      availability[id] = false;
      owners[id] = owner;
      passwords[id] = password;
      emit ReservationHasChanged(timeslot, room, owner);
    }

    function cancelReservation(uint timeslot, uint room, bytes32 owner, bytes32 password) public {
      uint id = getId(timeslot, room);
      require(owners[id] == owner, "You can not cancel a reservation you have not made !");
      require(!availability[id], "The room has not been booked yet !");
      require(passwords[id] == password, "The password is not correct !");
      availability[id] = true;
      emit ReservationHasChanged(timeslot, room, owner);
    }

    function getAvailability() public view returns (bool[] memory) {
      return availability;
    }

    function getOwners() public view returns (bytes32[] memory) {
      return owners;
    }

}
