import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next } from "../utils/date-time";
import { useHistory } from "react-router";
import "./Dashboard.css";
import ReservationFormat from "../reservations/ReservationFormat";
import TableFormat from "../tables/TableFormat";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [errors, setErrors] = useState(null);
  const [tables, setTables] = useState([]);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setErrors(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .then(listTables)
      .then(setTables)
      .catch(setErrors);
    return () => abortController.abort();
  }

  function handleToday() {
    history.push(`/dashboard`);
  }

  function handleNext() {
    history.push(`/dashboard?date=${next(date)}`);
  }

  function handlePrevious() {
    history.push(`dashboard?date=${previous(date)}`);
  }

  return (
    <main>
      <h1 className="d-md-flex justify-content-center">
        Find Your Perfect Reservation Date
      </h1>
      <ReservationFormat
        reservations={reservations}
        setReservations={setReservations}
        setErrors={setErrors}
      />
      <div className="d-md-flex mb-3 justify-content-center">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div className="pb-3 d-flex justify-content-center">
        <button className="btn btn-primary mr-3" onClick={handlePrevious}>
          <i className="bi bi-arrow-left-short"></i>Previous
        </button>
        <button className="btn btn-primary mr-3" onClick={handleToday}>
          Today
        </button>
        <button className="btn btn-primary mr-3" onClick={handleNext}>
          Next<i className="bi bi-arrow-right-short"></i>
        </button>
      </div>
      <TableFormat tables={tables} loadDashboard={loadDashboard} />
      <ErrorAlert error={errors} />
    </main>
  );
}

export default Dashboard;
