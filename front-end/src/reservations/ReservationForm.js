import React from "react";
import { useHistory } from "react-router";

export default function ReservationForm({
  initialformData,
  handleFormChange,
  handleSubmit,
}) {
  const history = useHistory();

  const handleCancel = () => {
    history.goBack();
  };

  return (
    initialformData && (
      <form onSubmit={handleSubmit} className="form-group">
        <fieldset>
          <legend className="d-flex justify-content-center">
            Reservation Details
          </legend>
          <div className="pb-2">
            <input
              type="text"
              name="first_name"
              className="form-control"
              id="first_name"
              placeholder={initialformData?.first_name || "First Name"}
              value={initialformData?.first_name}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="pb-2">
            <input
              type="text"
              name="last_name"
              className="form-control"
              id="last_name"
              placeholder={initialformData?.last_name || "Last Name"}
              value={initialformData?.last_name}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="pb-2">
            <input
              type="tel"
              name="mobile_number"
              className="form-control"
              id="mobile_number"
              placeholder={initialformData?.mobile_number || "Mobile Number"}
              value={initialformData?.mobile_number}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="pb-2">
            <input
              type="number"
              name="people"
              className="form-control"
              id="people"
              placeholder={initialformData?.people || "Number of guests"}
              value={initialformData?.people}
              onChange={handleFormChange}
              required
              min="1"
            />
          </div>

          <input
            type="date"
            name="reservation_date"
            className="form-control mb-2"
            id="reservation_date"
            placeholder={initialformData?.reservation_date || "YYY-MM-DD"}
            value={initialformData?.reservation_date}
            onChange={handleFormChange}
            required
          />
          <input
            type="time"
            name="reservation_time"
            className="form-control"
            id="reservation_time"
            placeholder={initialformData?.reservation_time || "HH:MM"}
            value={initialformData?.reservation_time}
            onChange={handleFormChange}
            required
          />
        </fieldset>
        <div className="d-flex justify-content-center pt-2">
          <button
            type="button"
            className="btn btn-danger mr-2"
            onClick={handleCancel}
          >
            <i className="oi oi-ban mr-2"></i>Cancel
          </button>
          <button type="submit" className="btn btn-primary mr-1">
            <i className="oi oi-pencil mr-2"></i>Reserve
          </button>
        </div>
      </form>
    )
  );
}
