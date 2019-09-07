import React, { useState, useEffect } from "react";
import { MyForm } from "../components/MyForm";
import SimpleTable from "../components/MyTable";
import Layout from "../components/MyLayout";
import data from "../components/data.json";

import web3 from "../ethereum/web3";
import booking from "../ethereum/booking";

const timeslots = data["timeslots"];
const roomnumbers = data["roomnumbers"];
const companies = data["companies"];
const company_char = companies[0];

var statusToIsAvailable = {
  free: true,
  booked: false
};

function getId(timeslot_, room_) {
  // timeslot and room start at 0
  return parseInt(timeslot_) * roomnumbers.length + parseInt(room_);
}

function bookingMessage(timeslot, room, name) {
  var message =
    "The room " +
    company_char +
    roomnumbers[room] +
    " has succesfully been booked at " +
    timeslots[timeslot] +
    " by " +
    name +
    ".";
  return message;
}

function cancellationMessage(timeslot, room, name) {
  var message =
    "The reservation of the romm " +
    company_char +
    roomnumbers[room] +
    " at " +
    timeslots[timeslot] +
    " has succesfully been canceled by " +
    name +
    ".";
  return message;
}

const bookRoom = async function(timeslot, room, name, password) {
  var accounts = await web3.eth.getAccounts();
  try {
    await booking.methods
      .bookRoom(
        timeslot,
        room,
        web3.utils.fromAscii(name),
        web3.utils.fromAscii(password)
      )
      .send({ from: accounts[0], gasLimit: "1000000" })
      .then(result => console.log("bookRoom: ", result))
      .catch(err => {
        console.log(err);
        throw err;
      })
      .then(() => alert(bookingMessage(timeslot, room, name)));
  } catch (err) {
    alert(err);
  }
};

const cancelReservation = async function(timeslot, room, name, password) {
  var accounts = await web3.eth.getAccounts();
  try {
    await booking.methods
      .cancelReservation(
        timeslot,
        room,
        web3.utils.fromAscii(name),
        web3.utils.fromAscii(password)
      )
      .send({ from: accounts[0], gasLimit: "1000000" })
      .then(result => console.log("cancelReservation: ", result))
      .catch(err => {
        console.log(err);
        throw err;
      })
      .then(() => alert(cancellationMessage(timeslot, room, name)));
  } catch (err) {
    alert(err);
  }
};

const getAvailability = async () => {
  return await booking.methods.getAvailability().call();
};

const getOwners = async () => {
  return await booking.methods.getOwners().call();
};

function useAsync(getMethod) {
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getResource() {
    try {
      setLoading(true);
      const result = await getMethod();
      setValue(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getResource();
  }, []);

  return [value, error, loading];
}

function FetchResource(getMethod) {
  const [value, error, loading] = useAsync(getMethod);
  if (error) return "Failed to load the resource.";
  return loading ? "Loading..." : value;
}

const App = () => {
  // availability array
  var valueAvailability = FetchResource(getAvailability);
  const [availability, setAvailability] = useState(valueAvailability);
  // owners array
  var valueOwners = FetchResource(getOwners);
  const [owners, setOwners] = useState(valueOwners);
  // call useEffect
  useEffect(() => {
    setAvailability(valueAvailability);
    setOwners(valueOwners);
  }, [valueAvailability, valueOwners]);

  return (
    <Layout>
      <div style={{ textAlign: "center" }}>
        <MyForm
          onSubmit={async ({
            timeslot,
            roomnumber,
            newStatus,
            name,
            password
          }) => {
            if (newStatus == "booked") {
              bookRoom(timeslot, roomnumber, name, password);
            } else if (newStatus == "free") {
              cancelReservation(timeslot, roomnumber, name, password);
            } else {
              alert("`newStatus` should be either `free` or `booked`.");
            }
            setAvailability(currentAvailability => {
              var id = getId(timeslot, roomnumber);
              return currentAvailability.map(function(val, index) {
                return index != id ? val : statusToIsAvailable[newStatus];
              });
            });
            setOwners(currentOwners => {
              var id = getId(timeslot, roomnumber);
              return currentOwners.map(function(val, index) {
                return index != id ? val : web3.utils.fromAscii(name);
              });
            });
          }}
        />
        <SimpleTable availability={availability} owners={owners} />
      </div>
    </Layout>
  );
};

export default App;
