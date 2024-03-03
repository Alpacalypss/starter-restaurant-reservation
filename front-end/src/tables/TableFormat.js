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
            <th className="table-item" scope="col">
              ID
            </th>
            <th className="table-item" scope="col">
              Table Number
            </th>
            <th className="table-item" scope="col">
              Capacity
            </th>
            <th className="table-item" scope="col">
              Status
            </th>
            <th className="table-item" scope="col">
              Finish
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default TableFormat;
