pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";


contract TimeTable is ERC721 {

    uint public n_timeslots;
    uint public n_rooms;
    address public creator;
    bool[] public availability;
    address[] public owners;

    event ReservationHasChanged(uint timeslot, uint room);

    constructor(uint n_timeslots_, uint n_rooms_) public ERC721() {
        creator = msg.sender;
        n_timeslots = n_timeslots_;
        n_rooms = n_rooms_;
        initTableTokens(n_timeslots, n_rooms);
    }

    function getTokenId(uint timeslot, uint room) public view returns (uint) {
      // timeslot and room start at 0
      return timeslot + room * n_timeslots;
    }

    function initTableTokens(uint n_rows, uint n_cols) internal {
      for (uint i = 0; i < n_rows; i++) {
        for (uint j = 0; j < n_cols; j++) {
          uint tokenId = getTokenId(i, j);
          _mint(creator, tokenId);
          availability.push(true);
          owners.push(creator);
        }
      }
    }

    function bookRoom(uint timeslot, uint room, address newOwner) public {
      require(timeslot < n_timeslots, "The index `timeslot` should be strictly lower then `n_timeslots`.");
      require(room < n_rooms, "The index `room` should be strictly lower then `n_rooms`.");
      uint tokenId = getTokenId(timeslot, room);
      require(availability[tokenId], "The room is not available !");
      address currentOwner = ownerOf(tokenId);
      approve(newOwner, tokenId);
      safeTransferFrom(currentOwner, newOwner, tokenId);
      availability[tokenId] = false;
      owners[tokenId] = newOwner;
      emit ReservationHasChanged(timeslot, room);
    }

    function cancelReservation(uint timeslot, uint room, address owner) public {
      uint tokenId = getTokenId(timeslot, room);
      require(owners[tokenId] == owner, "You can not cancel a reservation you have not made !");
      require(!availability[tokenId], "The room has not been booked yet !");
      availability[tokenId] = true;
      emit ReservationHasChanged(timeslot, room);
    }

    function getAvailability() public view returns (bool[] memory) {
      return availability;
    }

    function getOwners() public view returns (address[] memory) {
      return owners;
    }

}
