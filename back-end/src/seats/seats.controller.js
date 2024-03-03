const seatService = require("./seats.service");
const reservationService = require("../reservations/reservations.service");
const tableService = require("../tables/tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/*********Middleware Validaters*********/

//Function to check if a table has been given a reservation id
function tableHasReservationId(req, res, next) {
  const table = req.body.data;
  //If no valid table is given
  if (!table) {
    return next({ status: 400, message: "Must be a valid table" });
  }
  //If a reservation id has not been applied (sat)
  if (!table.reservation_id) {
    return next({ status: 400, message: "Must have a valid reservation_id" });
  }
  next();
}

//validation function testing to see if a reservation is already seated
function isAlreadySeated(req, res, next) {
  //destructure status variable from reservation
  const { status } = res.locals.reservation;
  if (status == "seated") {
    return next({ status: 400, message: "Reservation is already seated" });
  }
  next();
}

//Function to check if reservation exists
async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationService.read(reservation_id);
  //Is there a reservation for the given id
  if (!reservation) {
    return next({ status: 404, message: `${reservation_id} does not exist.` });
  }
  //declare res.locals for use in other functions
  res.locals.reservation = reservation;
  next();
}

//Validation to check if table is available and fits a given reservation
async function validTable(req, res, next) {
  const { table_id } = req.params;
  const table = await tableService.read(table_id);
  const reservation = res.locals.reservation;
  //Can the table fit the reservation
  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: "Table capacity will not fit your party.",
    });
  }
  //Is the table currently seated?
  if (table.reservation_id) {
    return next({
      status: 400,
      message: "Table is currently occupied by a reservation.",
    });
  }
  next();
}

//Function to check if a table is currently occupied to update
async function isTableOccupied(req, res, next) {
  const { table_id } = req.params;
  const table = await tableService.read(table_id);
  //Does table exist
  if (!table) {
    return next({ status: 404, message: `${table_id} was not found.` });
  }
  //Is there currently a reservation at an existing table?
  if (!table.reservation_id) {
    return next({ status: 400, message: "Table is not occupied." });
  }
  res.locals.reservation_id = table.reservation_id;
  next();
}

/******** CRUD FUNCTIONS ********/
async function update(req, res, next) {
  //destructure ids from table and reservation
  const { reservation_id } = req.body.data;
  const { table_id } = req.params;
  //await the update with ids and return it
  await seatService.update(table_id, reservation_id);
  res.status(200).json({ data: reservation_id });
}

//function to finish a table for the reservation id and open it to be seated again
async function unassign(req, res, next) {
  const { table_id } = req.params;
  const reservation = await reservationService.finish(
    res.locals.reservation_id
  );
  //Sets table data to not include reservation id
  const table = await seatService.update(table_id, null);
  res.json({ data: table });
}

module.exports = {
  update: [
    tableHasReservationId,
    asyncErrorBoundary(reservationExists),
    isAlreadySeated,
    asyncErrorBoundary(validTable),
    asyncErrorBoundary(update),
  ],
  unassign: [asyncErrorBoundary(isTableOccupied), asyncErrorBoundary(unassign)],
};
