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
const company_char = companies[1];

var statusToIsAvailable = {
  free: true,
  booked: false
};

function getTokenId(timeslot_, room_) {
  // timeslot and room start at 0
  return parseInt(room_) * timeslots.length + parseInt(timeslot_);
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
  var fromAddress = await booking.methods.ownerOf(tokenId);
  // define transaction object
  const tx = {
    from: fromAddress,
    to: toAddress,
    data: booking.methods
      .bookRoom(timeslot, room, web3.utils.fromAscii(toAddress))
      .encodeABI()
  };
  // sign the transaction (`tx.from` works as private key for unlocked accounts)
  var privateKey = tx.from;
  const signPromise = web3.eth.signTransaction(tx, privateKey);
  signPromise.then(signedTx => {
    const sentTx = web3.eth.sendSignedTransaction(
      signedTx.raw || signedTx.rawTransaction
    );
    sentTx.on("receipt", receipt => {
      console.log("receipt: ", receipt);
      alert(bookingMessage(timeslot, room, toAddress));
    });
    sentTx
      .on("error", err => {
        console.log("error:", err);
      })
      .catch(err => {
        alert(err);
      });
  });
};

const cancelReservation = async function(timeslot, room, toAddress) {
  var tokenId = getTokenId(timeslot, room);
  var fromAddress = await booking.methods.ownerOf(tokenId);
  // define transaction object
  const tx = {
    from: fromAddress,
    to: toAddress,
    data: booking.methods
      .cancelReservation(timeslot, room, web3.utils.fromAscii(toAddress))
      .encodeABI()
  };
  // sign the transaction (`tx.from` works as private key for unlocked accounts)
  var privateKey = tx.from;
  const signPromise = web3.eth.signTransaction(tx, privateKey);
  signPromise.then(signedTx => {
    const sentTx = web3.eth.sendSignedTransaction(
      signedTx.raw || signedTx.rawTransaction
    );
    sentTx.on("receipt", receipt => {
      console.log("receipt: ", receipt);
      alert(cancellationMessage(timeslot, room, toAddress));
    });
    sentTx
      .on("error", err => {
        console.log("error:", err);
      })
      .catch(err => {
        alert(err);
      });
  });
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
          onSubmit={async ({ timeslot, roomnumber, newStatus, toAddress }) => {
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
                    return index != id ? val : web3.utils.fromAscii(toAddress);
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
