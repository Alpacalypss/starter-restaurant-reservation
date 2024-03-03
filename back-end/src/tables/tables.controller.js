const tableService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/*********Middleware Validaters*********/
// Need to validate table name is at least 2 characters and non nullable
// Need to validate capacity is >= 1 non nullable
//Validate that table exists
const validTables = ["table_name", "capacity"];

//Validate a table has correct properties
async function validTable(req, res, next) {
  const table = req.body.data;
  //If no data is requested
  if (!table) {
    return next({ status: 400, message: "Must have data property." });
  }
  //conditionals for each valid (non-nullable field)
  validTables.forEach((field) => {
    if (!table[field]) {
      return next({
        status: 400,
        message: `table must contain a ${field} property.`,
      });
    }
    //Validation that capacity is a number
    if (field == "capacity" && typeof table[field] !== "number") {
      return next({ status: 400, message: `${field} must be a number.` });
    }
    //Validation the table_name is at least 2 characters (e.g #2)
    if (table["table_name"].length < 2) {
      return next({
        status: 400,
        message: `${field} must be at least 2 characters.`,
      });
    }
  });
  next();
}

/* CRUD functions */
//list all tables
async function list(req, res, next) {
  res.json({ data: await tableService.list() });
}

//function to create tables and assign reservation_id
async function create(req, res, next) {
  const table = req.body.data;
  const createdTable = await tableService.create(table);
  table.reservation_id = createdTable.reservation_id;
  table.table_id = createdTable.table_id;
  res.status(201).json({ data: table });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(validTable), asyncErrorBoundary(create)],
  validTable,
};
