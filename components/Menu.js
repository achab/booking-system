import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import web3 from "../ethereum/web3";
import booking from "../ethereum/booking";

const bookRoom = async function(timeslot, room) {
  var accounts = await web3.eth.getAccounts();
  await booking.methods
    .bookRoom(timeslot, room)
    .send({ from: accounts[0], gasLimit: "1000000" })
    .then(result => console.log("bookRoom: ", result))
    .catch(err => console.error(err));
};

const cancelReservation = async function(timeslot, room) {
  var accounts = await web3.eth.getAccounts();
  await booking.methods
    .cancelReservation(timeslot, room)
    .send({ from: accounts[0], gasLimit: "1000000" })
    .then(result => console.log("cancelReservation: ", result))
    .catch(err => console.error(err));
};

const getStatus = async function(timeslot, room) {
  await booking.methods
    .getAvailability()
    .call()
    .then(
      async array => array[await booking.methods.getId(timeslot, room).call()]
    )
    .then(cond => (cond ? "free" : "booked"));
};

class SimpleMenu extends React.Component {
  _isMounted = false;

  state = {
    status: "empty",
    anchorEl: null,
    isLoading: true
  };

  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleClick = async event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = async () => {
    this.setState({ anchorEl: null });
  };

  handleStatus = async () => {
    getStatus(this.props.timeslot, this.props.room)
      .then(status => this.setState({ status }))
      .then(() => this.props.setCount(this.props.count + 1));
  };

  render() {
    return (
      <div>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          {this.state.status}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem
            onClick={() => {
              bookRoom(this.props.timeslot, this.props.room)
                .then(this.handleStatus())
                .then(this.handleClose());
            }}
          >
            Book room
          </MenuItem>
          <MenuItem
            onClick={() => {
              cancelReservation(this.props.timeslot, this.props.room)
                .then(this.handleStatus())
                .then(this.handleClose());
            }}
          >
            Cancel reservation
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default SimpleMenu;
