pragma solidity 0.5.0;


contract TimeTable {

    address public manager;
    uint public n_timeslots;
    uint public n_rooms;
    address[] public owners;
    bool[] public availability;

    constructor(uint n_timeslots_, uint n_rooms_, address creator) public {
        manager = creator;
        n_timeslots = n_timeslots_;
        n_rooms = n_rooms_;
        initTable(n_timeslots, n_rooms, manager);
    }

    function initTable(uint r_rows, uint n_cols, address creator) internal {
      for (uint i = 0; i < r_rows; i++) {
        for (uint j = 0; j < n_cols; j++) {
          owners.push(creator);
          availability.push(true);
        }
      }
    }

    function getId(uint timeslot, uint room) public view returns (uint) {
      // timeslot and room start at 0
      uint id = timeslot * n_rooms + room;
      return id;
    }

    function bookRoom(uint timeslot, uint room) public {
      uint id = getId(timeslot, room);
      require(availability[id], "The room is not available !");
      availability[id] = false;
      owners[id] = msg.sender;
    }

    function cancelReservation(uint timeslot, uint room) public {
      uint id = getId(timeslot, room);
      require(owners[id] == msg.sender, "You can not cancel a reservation you have not made !");
      require(!availability[id], "The room has not been booked yet !");
      availability[id] = true;
    }

    function getAvailability() public view returns (bool[] memory) {
      return availability;
    }

    function getOwners() public view returns (address[] memory) {
      return owners;
    }

}
