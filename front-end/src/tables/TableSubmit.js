import React from "react";
import { useHistory } from "react-router";

function TableSubmit() {
  const history = useHistory();
  function handleSubmit() {
    //Add handlers and initial values to be updated on submit
    history.push("/dashboard");
  }
  return (
    <div>
      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit<i class="bi bi-check"></i>
      </button>
    </div>
  );
}

export default TableSubmit;
