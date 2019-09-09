pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";


contract TimeTable is ERC721 {

    uint public n_timeslots;
    uint public n_rooms;
    address public creator;
    bool[] public availability;
    bytes32[] public owners;

    event ReservationHasChanged(uint timeslot, uint room);

    constructor(uint n_timeslots_, uint n_rooms_) public ERC721() {
        creator = msg.sender;
        n_timeslots = n_timeslots_;
        n_rooms = n_rooms_;
        initTableTokens(n_timeslots, n_rooms);
    }

    function getTokenId(uint timeslot, uint room) public view returns (uint) {
      // timeslot and room start at 0
      uint id = room * n_timeslots + timeslot;
      return id;
    }

    function bytes32ToAddress(bytes32 b) public pure returns (address) {
      return address(uint160(bytes20(b)));
    }

    function addressToBytes32(address a) public pure returns (bytes32) {
      // return abi.encodePacked(a);
      return bytes32(uint256(a));
    }

    function initTableTokens(uint r_rows, uint n_cols) internal {
      for (uint i = 0; i < r_rows; i++) {
        for (uint j = 0; j < n_cols; j++) {
          uint tokenId = getTokenId(i, j);
          _mint(creator, tokenId);
          availability.push(true);
          owners.push(addressToBytes32(creator));
        }
      }
    }

    function bookRoom(uint timeslot, uint room, bytes32 newOwner) public {
      uint tokenId = getTokenId(timeslot, room);
      require(availability[tokenId], "The room is not available !");
      address currentOwner = ownerOf(tokenId);
      address newOwner_ = bytes32ToAddress(newOwner);
      approve(newOwner_, tokenId);
      safeTransferFrom(currentOwner, newOwner_, tokenId);
      availability[tokenId] = false;
      owners[tokenId] = newOwner;
      emit ReservationHasChanged(timeslot, room);
    }

    function cancelReservation(uint timeslot, uint room, bytes32 owner) public {
      uint tokenId = getTokenId(timeslot, room);
      require(owners[tokenId] == owner, "You can not cancel a reservation you have not made !");
      require(!availability[tokenId], "The room has not been booked yet !");
      availability[tokenId] = true;
      emit ReservationHasChanged(timeslot, room);
    }

    function getAvailability() public view returns (bool[] memory) {
      return availability;
    }

    function getOwners() public view returns (bytes32[] memory) {
      return owners;
    }

}
