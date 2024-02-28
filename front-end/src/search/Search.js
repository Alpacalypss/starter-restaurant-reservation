import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationFormat from "../reservations/ReservationFormat";
import ErrorAlert from "../layout/ErrorAlert";

export default function Search() {
  const [reservations, setReservations] = useState([]);
  const [display, setDisplay] = useState(false);
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState(null);

  function changeHandler(event) {
    setMobile(event.target.value);
  }

  async function searchHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const reservations = await listReservations(
        { mobile_number: mobile },
        abortController.signal
      );
      setReservations(reservations);
      setDisplay(true);
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  }

  return (
    <>
      <div className="d-flex justify-content-center">
        <h3>Search</h3>
      </div>
      <ErrorAlert error={error} />
      <div className="container">
        <form className="form-group" onSubmit={searchHandler}>
          <div class="p-2">
            <input
              name="mobile_number"
              id="mobile_number"
              onChange={changeHandler}
              placeholder="Enter the reservations phone number"
              value={mobile}
              className="form-control"
              required
            />
          </div>
          <div class="d-flex justify-content-center p-2">
            <button type="submit" className="btn btn-primary">
              <i class="bi bi-search mr-2"></i>
              Find
            </button>
          </div>
        </form>
      </div>
      {display && (
        <div>
          {reservations.length ? (
            <ReservationFormat
              reservations={reservations}
              setReservations={setReservations}
              setError={setError}
            />
          ) : (
            <h3>No reservations found</h3>
          )}
        </div>
      )}
    </>
  );
}
