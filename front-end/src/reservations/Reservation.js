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

  const handleFormChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const errors = [];
    if (errors.length) {
      setReservationsError({ message: errors });
      return;
    }
    try {
      formData.people = Number(formData.people);
      await createReservation(formData, abortController.signal);
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
