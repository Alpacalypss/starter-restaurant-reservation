import React from "react";
import { useHistory } from "react-router";
import TableForm from "./TableForm";

function Table() {
  const history = useHistory();
  const initialFormData = {
    table_name: "",
    capacity: "",
  };
  return (
    <>
      <h1 className="d-flex justify-content-center">Create New Table</h1>
      <div>
        <TableForm />
      </div>
    </>
  );
}

export default Table;
