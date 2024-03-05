import React from "react";
import TableRows from "./TableRows";

function TableFormat({ tables, loadDashboard }) {
  if (!tables) return null;

  //maps rows of tables with unique id as key
  const rows = tables.map((result) => {
    return (
      <TableRows
        key={result.table_id}
        table={result}
        loadDashboard={loadDashboard}
      />
    );
  });
  return (
    <div className="container">
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Table Number</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
            <th scope="col">Finish</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default TableFormat;
