import React, { useState } from "react";
import TableForm from "./TableForm";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Table() {
  const initialTableData = {
    table_name: "",
    capacity: 0,
  };

  const history = useHistory();
  const [tableError, setTableError] = useState(null);
  const [tableForm, setTableForm] = useState({ ...initialTableData });

  const handleFormChange = (event) => {
    setTableForm({
      ...tableForm,
      [event.target.name]: event.target.value,
    });
  };

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
    <>
      <ErrorAlert error={tableError} />
      <h1 className="d-flex justify-content-center">Create New Table</h1>
      <div className="container">
        <TableForm
          initialTableData={initialTableData}
          handleFormChange={handleFormChange}
          tableForm={tableForm}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
}

export default Table;
