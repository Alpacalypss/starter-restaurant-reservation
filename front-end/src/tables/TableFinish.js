import React from "react";
import { useHistory } from "react-router";
import { unassignTable } from "../utils/api";

export default function FinishButton({ status, table, loadDashboard }) {
  const history = useHistory();

  //function to warn users they are clearing a table
  async function handleClick() {
    return window.confirm(
      "Is this table ready for new guests? Action cannot be undone."
    ) //if confirmed awaits "finish" for reservation_id at table.table_id
      ? await handleFinish(table.table_id, table.reservation_id)
      : null;
  }

  //function to unassign the table and load the dashboard w/ api call
  async function handleFinish(table_id, reservation_id) {
    await unassignTable(table_id, reservation_id);
    await loadDashboard();
    history.push("/dashboard");
  }

  return (
    status === "Occupied" && (
      <td>
        <button
          data-table-id-finish={table.table_id}
          type="button"
          onClick={handleClick}
          className="btn btn-sm btn-primary"
        >
          Finish
        </button>
      </td>
    )
  );
}
