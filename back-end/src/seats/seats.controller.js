const seatService = require("./seats.service");
const reservationService = require("../reservations/reservations.service");
const tableService = require("../tables/tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/* Validation Middleware */

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

function isAlreadySeated(req, res, next) {
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
  res.locals.reservation = reservation;
  next();
}

//Function to check if table is valid for a given reservation
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
    return next({ status: 404, message: `${table_id} not found.` });
  }
  //Is there currently a reservation at an existing table?
  if (!table.reservation_id) {
    return next({ status: 400, message: "Table is not occupied." });
  }
  res.locals.reservation_id = table.reservation_id;
  next();
}

async function update(req, res, next) {
  const { reservation_id } = req.body.data;
  const { table_id } = req.params;
  await seatService.update(table_id, reservation_id);
  res.status(200).json({ data: reservation_id });
}

async function unassign(req, res, next) {
  const { table_id } = req.params;
  const reservation = await reservationService.finish(
    res.locals.reservation_id
  );
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
