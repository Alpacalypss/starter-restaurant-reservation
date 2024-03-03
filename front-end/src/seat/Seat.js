import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { listTables, seatReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function Seat() {
  const { reservation_id } = useParams();
  const history = useHistory();
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [seatTable, setSeatTable] = useState(null);

  useEffect(() => {
    //loads tables with api call
    async function loadTables() {
      const abortController = new AbortController();
      setError(null);
      try {
        const response = await listTables(abortController.signal);
        setTables(() => response);
      } catch (error) {
        setError(error);
      }
      return () => abortController.abort();
    }
    loadTables();
  }, [reservation_id]);

  //handler for form submission
  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      //await seat api call w/ params
      const response = await seatReservation(
        seatTable,
        reservation_id,
        abortController.signal
      );
      //if seated, redirects user to the dashboard page
      if (response) {
        history.push(`/dashboard`);
      }
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  }

  //returns to previous page on cancel
  function handleCancel() {
    history.goBack();
  }

  //sets input for seating
  function handleTableSeat(event) {
    setSeatTable(event.target.value);
  }

  //Setting options to be a map of the existing table
  const options = tables.map((table) => (
    <option
      key={table.table_id}
      value={table.table_id}
    >{`${table.table_name} - ${table.capacity}`}</option>
  ));

  return (
    <>
      <div className="d-flex justify-content-center pt-3">
        <h3>Select Table for Reservation</h3>
      </div>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit} className="d-flex justify-content-center">
        <label htmlFor="seat_reservation">
          Seat at:
          <select
            id="table_id"
            name="table_id"
            onChange={handleTableSeat}
            className="mr-1"
            required
          >
            <option defaultValue>Select a table</option>
            {options}
          </select>
        </label>
        <button className="btn btn-primary mr-1" type="submit">
          Submit
        </button>
        <button className="btn btn-danger mr-1" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </>
  );
}
