import React, { useState } from "react";
import TableCancel from "./TableCancel";
import TableSubmit from "./TableSubmit";
import { createTable } from "../utils/api";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";

export default function TableForm({ initialFormData }) {
  const history = useHistory();
  const [tableError, setTableError] = useState(null);
  const [tableForm, setTableForm] = useState({ ...initialFormData });

  function handleFormChange(event) {
    setTableForm({
      ...tableForm,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      tableForm.capacity = Number(tableForm.capacity);
      const response = await createTable(tableForm, abortController.signal);
      if (response) {
        history.push("/dashboard");
      }
    } catch (error) {
      setTableError(error);
    }
    return () => abortController.abort();
  }

  return (
    <div>
      <ErrorAlert error={tableError} />
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
              onChange={handleFormChange}
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
              onChange={handleFormChange}
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
