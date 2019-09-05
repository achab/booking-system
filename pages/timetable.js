import React from 'react';
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
const roomnumbers = data['roomnumbers'];
const company_char = companies[0];


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

const MyTableCell = props => {
  const { color, ...other } = props;
  const classes = useStyles(props);
  return <TableCell style={{backgroundColor:'orange', color: 'white'}} align="center" {...other} />;
  // return <TableCell className={classes.cell} align="center" {...other} />;
}

const MyPaper = props => {
  const classes = useStyles();
  return <Paper className={classes.root}>{props.children}</Paper>;
}

const MyTable = props => {
  const classes = useStyles();
  return <Table className={classes.table}>{props.children}</Table>;
}



class SimpleTable extends React.Component {

  state = {
    count: 0
  }

  render() {
    return (
      <Layout>
        <p>This is the timetable page.</p>
        <MyPaper>
          <MyTable>
            <TableHead>
              <TableRow>
                <TableCell>Time slot</TableCell>
                {roomnumbers.map((roomnumber, col) => (
                  <TableCell align="center" key={roomnumber}>{company_char}{roomnumber}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {timeslots.map((slot, row) => (
                <TableRow key={slot}>
                  <TableCell component="th" scope="row">{slot}</TableCell>
                  {roomnumbers.map((roomnumber, col) => (
                    <MyTableCell key={slot + roomnumber}>
                      <SimpleMenu
                        timeslot={row} room={col} count={this.state.count}
                        setCount={(count) => this.setState({ count })}
                      />
                    </MyTableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </MyTable>
        </MyPaper>
      </Layout>
    );
  }
}


SimpleTable.getInitialProps = async function() {
  const res = await fetch('https://api.tvmaze.com/search/shows?q=batman');
  const data = await res.json();

  console.log(`Show data fetched. Count: ${data.length}`);

  return {
    shows: data.map(entry => entry.show)
  };
};


export default SimpleTable;
