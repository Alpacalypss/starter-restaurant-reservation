import React from "react";
import TableCancel from "./TableCancel";
import TableSubmit from "./TableSubmit";

export default function TableForm({
  initialTableData,
  handleFormChange,
  tableForm,
  handleSubmit,
}) {
  return (
    initialTableData && (
      <form onSubmit={handleSubmit} className="form-group">
        <fieldset>
          <legend className="d-flex justify-content-center"></legend>
          <div className="pb-3">
            <input
              type="text"
              name="table_name"
              className="form-control"
              id="table_name"
              placeholder="Table Name"
              value={tableForm?.table_name}
              onChange={handleFormChange}
              minLength={2}
            />
          </div>
          <div className="pb-3">
            <input
              type="text"
              name="capacity"
              className="form-control"
              id="capacity"
              placeholder="Table Capacity"
              onChange={handleFormChange}
              min="1"
            />
          </div>
          <div className="d-md-flex justify-content-center mr-3">
            <TableCancel />
            <div className="pr-3"></div>
            <TableSubmit />
          </div>
        </fieldset>
      </form>
    )
  );
}
