import React from "react";
import TableFinish from "./TableFinish";

function TableRows({ table, loadDashboard }) {
  const tableStatus = table.reservation_id ? "Occupied" : "Free";
  return (
    <tr>
      <th scope="row">{table.table_id}</th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id}>{tableStatus}</td>
      <TableFinish
        status={tableStatus}
        table={table}
        loadDashboard={loadDashboard}
      />
    </tr>
  );
}

export default TableRows;
