import React, { useState, useEffect } from "react";
import { MyForm } from "../components/MyForm";
import SimpleTable from "../components/MyTable";
import Layout from "../components/MyLayout";
import data from "../components/data.json";

import booking from "../ethereum/booking";

const timeslots = data["timeslots"];
const roomnumbers = data["roomnumbers"];
const companies = data["companies"];
const company_char = companies[1];

var statusToIsAvailable = {
  free: true,
  booked: false
};

function getTokenId(timeslot_, room_) {
  // timeslot and room start at 0
  return parseInt(timeslot_) + parseInt(room_) * timeslots.length;
}

function bookingMessage(timeslot, room, toAddress) {
  var message =
    "The room " +
    company_char +
    roomnumbers[room] +
    " has succesfully been booked at " +
    timeslots[timeslot] +
    " by " +
    toAddress +
    ".";
  return message;
}

function cancellationMessage(timeslot, room, toAddress) {
  var message =
    "The reservation of the romm " +
    company_char +
    roomnumbers[room] +
    " at " +
    timeslots[timeslot] +
    " has succesfully been canceled by " +
    toAddress +
    ".";
  return message;
}

const bookRoom = async function(timeslot, room, toAddress) {
  var tokenId = getTokenId(timeslot, room);
  var fromAddress = await booking.methods.ownerOf(tokenId).call();
  try {
    await booking.methods
      .bookRoom(timeslot, room, toAddress)
      .send({ from: fromAddress, gasLimit: "1000000" })
      .then(result => console.log("bookRoom: ", result))
      .catch(err => {
        console.log(err);
        throw err;
      })
      .then(() => alert(bookingMessage(timeslot, room, toAddress)));
  } catch (err) {
    alert(err);
  }
};

const cancelReservation = async function(timeslot, room, toAddress) {
  var tokenId = getTokenId(timeslot, room);
  var fromAddress = await booking.methods.ownerOf(tokenId).call();
  try {
    await booking.methods
      .cancelReservation(timeslot, room, toAddress)
      .send({ from: fromAddress, gasLimit: "1000000" })
      .then(result => console.log("bookRoom: ", result))
      .catch(err => {
        console.log(err);
        throw err;
      })
      .then(() => alert(cancellationMessage(timeslot, room, toAddress)));
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

const Index = () => {
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
          onSubmit={async ({ toAddress, timeslot, roomnumber, newStatus }) => {
            if (newStatus == "booked") {
              bookRoom(timeslot, roomnumber, toAddress);
            } else if (newStatus == "free") {
              cancelReservation(timeslot, roomnumber, toAddress);
            } else {
              alert("`newStatus` should be either `free` or `booked`.");
            }
            booking.once("ReservationHasChanged", {}, function(error, event) {
              console.log(event);
              if (!error) {
                setAvailability(currentAvailability => {
                  var id = getTokenId(timeslot, roomnumber);
                  return currentAvailability.map(function(val, index) {
                    return index != id ? val : statusToIsAvailable[newStatus];
                  });
                });
                setOwners(currentOwners => {
                  var id = getTokenId(timeslot, roomnumber);
                  return currentOwners.map(function(val, index) {
                    return index != id ? val : toAddress;
                  });
                });
              }
            });
          }}
        />
        <br />
        <SimpleTable availability={availability} owners={owners} />
      </div>
    </Layout>
  );
};

export default Index;
