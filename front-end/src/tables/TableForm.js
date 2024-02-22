import React from "react";
import TableCancel from "./TableCancel";
import TableSubmit from "./TableSubmit";

export default function TableForm({
  handleSubmit,
  handleCancel,
  initialFormData,
}) {
  return (
    <div>
      <form onSubmit={handleSubmit} className="form-group">
        <fieldset>
          <legend className="d-flex justify-content-center"></legend>
          <div className="pb-3">
            <input
              type="text"
              name="table_name"
              className="form-control"
              placeholder={initialFormData?.table_name || "Table Name"}
              value={initialFormData?.table_name}
              minLength={2}
            ></input>
          </div>
          <div className="pb-3">
            <input
              type="text"
              name="capacity"
              className="form-control"
              placeholder={initialFormData?.capacity || "Table Capacity"}
              value={initialFormData?.capacity}
              min="1"
            ></input>
          </div>
          <div className="d-md-flex justify-content-center mr-3">
            <TableCancel />
            <div className="pr-3"></div>
            <TableSubmit />
          </div>
        </fieldset>
      </form>
    </div>
  );
}
