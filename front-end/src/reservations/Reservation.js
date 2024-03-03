import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createReservation } from "../utils/api";

import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

export default function Reservations() {
  const history = useHistory();
  const [reservationsError, setReservationsError] = useState(null);
  const initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormData });

  //function to handle input key strokes and update data
  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  //submission function with abort controller
  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const errors = [];
    if (errors.length) {
      setReservationsError({ message: errors });
      return;
    }
    try {
      //changes typeof on people to a number
      formData.people = Number(formData.people);
      //await the creation of a new reservation
      await createReservation(formData, abortController.signal);
      //sets date to the date of the reservation, and redirects you to that date on the dashboard
      const date = formData.reservation_date;
      history.push(`/dashboard?date=${date}`);
    } catch (error) {
      setReservationsError(error);
    }
    return () => abortController.abort();
  };

  return (
    <div className="container">
      <ErrorAlert error={reservationsError} />
      <ReservationForm
        initialformData={formData}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
