import React from "react";
import ReservationRow from "./ReservationRow";
import { cancelReservation } from "../utils/api";
import { useHistory } from "react-router";

function ReservationFormat({ reservations, setReservations, setError }) {
  const history = useHistory();
  if (!reservations) {
    return null;
  }

  async function cancelRez(reservation) {
    try {
      const { status } = await cancelReservation(reservation.reservation_id);
      const updated = reservations.map((res) => {
        if (res.reservation_id === reservation.reservation_id) {
          res.status = status;
        }
        return res;
      });
      setReservations(updated);
      history.go(`/dashboard?date=${reservation.reservation_date}`);
    } catch (error) {
      setError(error);
    }
  }
  //declare variable for rows of the table with map w/ unique id as key
  const rows = reservations.map((result) => {
    return (
      <ReservationRow
        key={result.reservation_id}
        reservation={result}
        cancelRez={cancelRez}
      />
    );
  });
  return (
    <div className="container">
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Number Of guests</th>
            <th scope="col">Time</th>
            <th scope="col">Status</th>
            <th scope="col">Seat</th>
            <th scope="col">Edit</th>
            <th scope="col">Cancel</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default ReservationFormat;
