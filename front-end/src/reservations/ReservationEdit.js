import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { isNotOnTuesday, isInTheFuture } from "../utils/date-time";
import { findReservation, modifyReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

export default function ReservationEdit() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [error, setError] = useState(null);
  const [reservationData, setReservationData] = useState(null);

  useEffect(() => {
    async function loadReservation() {
      const abortController = new AbortController();
      try {
        const reservation = await findReservation(
          reservation_id,
          abortController.signal
        );
        setReservationData(reservation);
      } catch (error) {
        setError(error);
      }
      return () => abortController.abort();
    }
    loadReservation();
  }, [reservation_id]);

  function findErrors(res, errors) {
    isNotOnTuesday(res.reservation_date, errors);
    isInTheFuture(res.reservation_date, errors);
    //in-line validation to ensure reservation can be modified
    if (res.status && res.status !== "booked") {
      errors.push(
        <li key="not booked">Reservation can no longer be changed</li>
      );
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    const errors = [];
    findErrors(reservationData, errors);
    if (errors.length) {
      setError({ message: errors });
      return;
    }
    try {
      reservationData.people = Number(reservationData.people);
      await modifyReservation(
        reservation_id,
        reservationData,
        abortController.signal
      );
      history.push(`/dashboard?date=${reservationData.reservation_date}`);
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  }

  function handleFormChange(event) {
    setReservationData({
      ...reservationData,
      [event.target.name]: event.target.value,
    });
  }

  return (
    <>
      <ErrorAlert error={error} />
      <ReservationForm
        initialformData={reservationData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}
