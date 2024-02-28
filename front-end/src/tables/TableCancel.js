import React from "react";
import { useHistory } from "react-router";

function TableCancel() {
  const history = useHistory();

  function handleCancel() {
    history.goBack();
  }
  return (
    <>
      <button className="btn btn-danger" onClick={handleCancel}>
        <i class="oi oi-ban mr-2"></i>Cancel
      </button>
    </>
  );
}

export default TableCancel;
