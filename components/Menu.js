import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import booking from "../ethereum/booking";


const bookRoom = async function(timeslot, room) {
  // var accounts = await web3.eth.getAccounts().catch((err) => console.error(err));
	await booking.methods.bookRoom(timeslot, room)
	.send({ from: '0x903E8B7CA909A5E6F61f199f485bDb5bc6B6625C', 'gasLimit': '1000000' })
	.then(result => console.log('bookRoom: ', result))
	.catch((err) => console.error(err));
};

const cancelReservation = async function(timeslot, room) {
  // var accounts = await web3.eth.getAccounts().catch((err) => console.error(err));
	await booking.methods.cancelReservation(timeslot, room)
	.send({ from: '0x903E8B7CA909A5E6F61f199f485bDb5bc6B6625C', 'gasLimit': '1000000' })
	.then(result => console.log('cancelReservation: ', result))
	.catch((err) => console.error(err));
};

// const getStatus = async function(timeslot, room) {
//   var id = await booking.methods.getId(timeslot, room).call();
//   var isAvailable = await booking.methods.getAvailability().call()[id];
//   var status_ = isAvailable ? "free" : "booked";
//   return status_;
// }


function SimpleMenu({ timeslot, room }) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [status, setStatus] = React.useState('free')

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {status}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            console.log('You have clicked on `Book room`, from cell', {timeslot}, {room});
            bookRoom(timeslot, room);
            setStatus("booked");
            handleClose();
          }}>
            Book room
        </MenuItem>
        <MenuItem
          onClick={() => {
            console.log('You have clicked on `Cancel reservation`, from cell', {timeslot}, {room});
            cancelReservation(timeslot, room);
            setStatus("free");
            handleClose();
          }}>
            Cancel reservation
        </MenuItem>
      </Menu>
    </div>
  );
}

export default SimpleMenu;
