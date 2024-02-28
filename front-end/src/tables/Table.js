import React from "react";
import TableForm from "./TableForm";

function Table() {
  const initialFormData = {
    table_name: "",
    capacity: 0,
  };
  return (
    <>
      <h1 className="d-flex justify-content-center">Create New Table</h1>
      <div className="container">
        <TableForm initialFormData={initialFormData} />
      </div>
    </>
  );
}

export default Table;
