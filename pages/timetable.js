{3}import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import SimpleMenu from '../components/Menu';
import Layout from '../components/MyLayout';
import data from '../components/data.json';

// define constants
const timeslots = data['timeslots'];
const status = data['status'];
const companies = data['companies'];
const company_char = companies[0];

console.log('timeslots = ', timeslots)
console.log('status = ', status)
console.log('companies = ', companies)

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  cell: {
    background: props =>
      props.color === 'red'
        ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  },
}));


function MyTableCell(props) {
  const { color, ...other } = props;
  const classes = useStyles(props);
  return <TableCell className={classes.cell} align="center" {...other} />;
}

export default function SimpleTable() {
  const classes = useStyles();

  return (
    <Layout>
      <p>This is the timetable page.</p>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Time slot</TableCell>
              <TableCell align="center">{company_char}01</TableCell>
              <TableCell align="center">{company_char}02</TableCell>
              <TableCell align="center">{company_char}03</TableCell>
              <TableCell align="center">{company_char}04</TableCell>
              <TableCell align="center">{company_char}05</TableCell>
              <TableCell align="center">{company_char}06</TableCell>
              <TableCell align="center">{company_char}07</TableCell>
              <TableCell align="center">{company_char}08</TableCell>
              <TableCell align="center">{company_char}09</TableCell>
              <TableCell align="center">{company_char}10</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeslots.map((slot, index) => (
              <TableRow key={slot}>
                <TableCell component="th" scope="row">{slot}</TableCell>
                <TableCell align="center"><SimpleMenu timeslot={index} room={1} /></TableCell>
                <TableCell align="center"><SimpleMenu timeslot={index} room={2} /></TableCell>
                <TableCell align="center"><SimpleMenu timeslot={index} room={3} /></TableCell>
                <TableCell align="center"><SimpleMenu timeslot={index} room={4} /></TableCell>
                <TableCell align="center"><SimpleMenu timeslot={index} room={5} /></TableCell>
                <TableCell align="center"><SimpleMenu timeslot={index} room={6} /></TableCell>
                <TableCell align="center"><SimpleMenu timeslot={index} room={7} /></TableCell>
                <TableCell align="center"><SimpleMenu timeslot={index} room={8} /></TableCell>
                <TableCell align="center"><SimpleMenu timeslot={index} room={9} /></TableCell>
                <TableCell align="center"><SimpleMenu timeslot={index} room={10} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Layout>
  );
}
