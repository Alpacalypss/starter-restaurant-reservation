import React from "react";

function TableSubmit({ handleSubmit }) {
  return (
    <div>
      <button className="btn btn-primary" onClick={handleSubmit}>
        <i class="oi oi-pencil mr-2"></i>Create
      </button>
    </div>
  );
}

export default TableSubmit;
