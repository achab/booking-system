import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import data from "./data.json";
import web3 from "../ethereum/web3";

// define constants
const timeslots = data["timeslots"];
const companies = data["companies"];
const roomnumbers = data["roomnumbers"];
const company_char = companies[0];

var isAvailableToStatus = {
  true: "free",
  false: "booked"
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  }
}));

function getId(timeslot_, room_) {
  // timeslot and room start at 0
  return timeslot_ * roomnumbers.length + room_;
}

function SimpleTable({ availability, owners }) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Time slot</TableCell>
            {roomnumbers.map(roomnumber => (
              <TableCell align="center" key={roomnumber}>
                {company_char}
                {roomnumber}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {timeslots.map((slot, row) => (
            <TableRow key={slot}>
              <TableCell align="center" component="th" scope="row">
                {slot}
              </TableCell>
              {roomnumbers.map((roomnumber, col) => (
                <TableCell align="center" key={slot + roomnumber}>
                  {isAvailableToStatus[availability[getId(row, col)]] +
                    (availability[getId(row, col)] ||
                    owners[getId(row, col)] === undefined ||
                    !web3.utils.isHexStrict(owners[getId(row, col)])
                      ? ""
                      : " by " + web3.utils.toAscii(owners[getId(row, col)]))}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default SimpleTable;
