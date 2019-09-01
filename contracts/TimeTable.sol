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
          availability.push(false);
        }
      }
    }

    function getId(uint timeslot, uint room) public view returns (uint) {
      uint id = (timeslot - 1) * n_rooms + room - 1;
      return id;
    }

    function bookRoom(uint timeslot, uint room) public {
      uint id = getId(timeslot, room);
      require(!availability[id]);
      availability[id] = true;
      owners[id] = msg.sender;
    }

    function cancelRoom(uint timeslot, uint room) public {
      uint id = getId(timeslot, room);
      require(owners[id] == msg.sender);
      availability[id] = false;
    }

    function getAvailability() public view returns (bool[] memory) {
      return availability;
    }

    function getOwners() public view returns (address[] memory) {
      return owners;
    }

}
