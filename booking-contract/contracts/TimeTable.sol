pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";


contract TimeTable is ERC721 {

    uint public n_timeslots;
    uint public n_rooms;
    bool[] public availability;

    event ReservationHasChanged(uint timeslot, uint room);

    constructor(uint n_timeslots_, uint n_rooms_) public ERC721() {
        n_timeslots = n_timeslots_;
        n_rooms = n_rooms_;
        initTableTokens(n_timeslots, n_rooms);
    }

    function getTokenId(uint timeslot, uint room) public view returns (uint) {
      // timeslot and room start at 0
      uint id = room + timeslot * n_rooms;
      return id;
    }

    function castBytes32Toaddres(bytes32 owner) internal pure returns (address) {
      return address(uint160(bytes20(owner)));
    }

    function initTableTokens(uint r_rows, uint n_cols) internal {
      for (uint i = 0; i < r_rows; i++) {
        for (uint j = 0; j < n_cols; j++) {
          uint tokenId = getTokenId(i, j);
          _mint(msg.sender, tokenId);
          availability.push(true);
        }
      }
    }

    function bookRoom(uint timeslot, uint room, bytes32 newOwner) public {
      uint tokenId = getTokenId(timeslot, room);
      address currentOwner = ownerOf(tokenId);
      address newOwner_ = castBytes32Toaddres(newOwner);
      approve(newOwner_, tokenId);
      safeTransferFrom(currentOwner, newOwner_, tokenId);
      availability[tokenId] = false;
      emit ReservationHasChanged(timeslot, room);
    }

    function cancelReservation(uint timeslot, uint room) public {
      uint tokenId = getTokenId(timeslot, room);
      require(!availability[tokenId], "The room has not been booked yet !");
      availability[tokenId] = true;
      emit ReservationHasChanged(timeslot, room);
    }

    function getAvailability() public view returns (bool[] memory) {
      return availability;
    }

}
