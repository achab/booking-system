import React, { useState, useEffect } from "react";
import { MyForm } from "../components/MyForm";
import SimpleTable from "../components/MyTable";
import Layout from "../components/MyLayout";
import data from "../components/data.json";

import web3 from "../ethereum/web3";
import booking from "../ethereum/booking";

const roomnumbers = data["roomnumbers"];

var statusToIsAvailable = {
  free: true,
  booked: false
};

function ascii_to_hexa(str) {
  var arr1 = [];
  var n = str.length;
  for (var i = 0; i < n; i++) {
    var hex = Number(str.charCodeAt(i)).toString(16);
    arr1.push(hex);
  }
  return "0x".concat(arr1.join("")).padEnd(66, "0");
}

function getId(timeslot_, room_) {
  // timeslot and room start at 0
  return parseInt(timeslot_) * roomnumbers.length + parseInt(room_);
}

const bookRoom = async function(timeslot, room, name, password) {
  var accounts = await web3.eth.getAccounts();
  await booking.methods
    .bookRoom(timeslot, room, ascii_to_hexa(name), ascii_to_hexa(password))
    .send({ from: accounts[0], gasLimit: "1000000" })
    .then(result => console.log("bookRoom: ", result))
    .catch(err => console.error(err));
};

const cancelReservation = async function(timeslot, room, name, password) {
  var accounts = await web3.eth.getAccounts();
  await booking.methods
    .cancelReservation(
      timeslot,
      room,
      ascii_to_hexa(name),
      ascii_to_hexa(password)
    )
    .send({ from: accounts[0], gasLimit: "1000000" })
    .then(result => console.log("cancelReservation: ", result))
    .catch(err => console.error(err));
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
              throw "`newStatus` should be either `free` or `booked`.";
            }
            setAvailability(currentAvailability => {
              var id = getId(timeslot, roomnumber);
              return currentAvailability.map(function(val, index) {
                return index != id ? val : statusToIsAvailable[newStatus];
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
