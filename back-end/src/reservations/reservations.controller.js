/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("./reservations.service");

/*********Middleware Validaters*********/
const validFields = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

//Validating time parameters
function validTime(str) {
  const [hour, minute] = str.split(":");

  if (hour.length > 2 || minute.length > 2) {
    return false;
  }
  if (hour < 1 || hour > 23) {
    return false;
  }
  if (minute < 0 || minute > 59) {
    return false;
  }
  return true;
}

//Validate a reservation at id exists
async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await reservationService.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation_id ${reservation_id} does not exist.`,
  });
}

//Field validation for required reservation info
function isValidReservation(req, res, next) {
  const reservation = req.body.data;

  if (!reservation) {
    return next({ status: 400, message: `Must have data property.` });
  }
  //Loop each valid field to validate they all exist
  validFields.forEach((field) => {
    if (!reservation[field]) {
      return next({ status: 400, message: `${field} field required` });
    }
    //If people field is NaN
    if (field === "people" && typeof reservation[field] !== "number") {
      return next({
        status: 400,
        message: `${field} must be a number.`,
      });
    }
    //Validate reservation_date fits Date format
    if (field === "reservation_date" && !Date.parse(reservation[field])) {
      return next({ status: 400, message: `${field} is not a valid date.` });
    }
    //Validate reservation_time is within time parameters
    if (field === "reservation_time") {
      if (!validTime(reservation[field])) {
        return next({ status: 400, message: `${field} is not a valid time` });
      }
    }
  });

  next();
}

//Validation that date is not on tuesday
function isNotTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const [year, month, day] = reservation_date.split("-");
  const date = new Date(`${month} ${day}, ${year}`);
  res.locals.date = date;
  if (date.getDay() === 2) {
    return next({
      status: 400,
      message:
        "We are currently closed Tuesdays. Please select a day we are open.",
    });
  }
  next();
}

//Validate the requested date has not passed
function notInPast(req, res, next) {
  const date = res.locals.date;
  const today = new Date();
  if (date < today) {
    return next({
      status: 400,
      message:
        "Requested reservation date is in the past. Please reserve a future date.",
    });
  }
  next();
}

//Validate the reservation is within open hours
function isWithinOpenHours(req, res, next) {
  const reservation = req.body.data;
  //Breaks the time into seperate variables for if statements
  const [hour, minute] = reservation.reservation_time.split(":");
  if (hour < 10 || hour > 21) {
    return next({
      status: 400,
      message: "Reservation must be made within business hours",
    });
  }
  if ((hour < 11 && minute < 30) || (hour > 20 && minute > 30)) {
    return next({
      status: 400,
      message: "Reservation must be made within business hours",
    });
  }
  next();
}

//Valid conditionals for when a reservation is editable
function hasBookedStatus(req, res, next) {
  const { status } = res.locals.reservation
    ? res.locals.reservation
    : req.body.data;
  if (status === "seated" || status === "finished" || status === "cancelled") {
    return next({
      status: 400,
      message: `New reservation can not have ${status} status.`,
    });
  }
  next();
}

//Validation for acceptable reservation statuses
function isValidStatus(req, res, next) {
  const validStatuses = ["booked", "seated", "finished", "cancelled"];
  const { status } = req.body.data;
  if (!validStatuses.includes(status)) {
    return next({
      status: 400,
      message: `Status unknown. Needs to contain a valid status: ${validStatuses}.`,
    });
  }
  next();
}

//Validate a reservation has finished and cannot be edited
function isAlreadyFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: "Cannot change a reservation with a finished status.",
    });
  }
  next();
}

/******** CRUD FUNCTIONS *********/

//List function for reservations
async function list(req, res) {
  //setting query parameter variables
  const { date, mobile_number } = req.query;
  //declaring a reservation variable
  let reservations;
  //If a mobile number query parameter is given await search
  if (mobile_number) {
    reservations = await reservationService.search(mobile_number);
  } else {
    //If there is a date query parameter
    reservations = date
      ? //list reservations for date
        await reservationService.listByDate(date)
      : //otherwise list all reservations
        await reservationService.list();
  }
  res.json({
    data: reservations,
  });
}

//function to return a specific reservation id
async function read(req, res) {
  const reservation = res.locals.reservation;
  //console.log(reservation);
  res.json({ data: reservation });
}

//function to create a new reservation
async function create(req, res) {
  const reservation = req.body.data;
  //declare a variable for created reservation id and return it
  const { reservation_id } = await reservationService.create(reservation);
  reservation.reservation_id = reservation_id;
  res.status(201).json({ data: reservation });
}

//function to update an existing reservation
async function update(req, res, next) {
  const { reservation_id } = req.params;
  //destructure status for update
  const { status } = req.body.data;
  //await update status for a given reservation id
  const reservation = await reservationService.update(reservation_id, status);
  res.status(200).json({ data: reservation });
}

//function to edit an existing reservation
async function modify(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = req.body.data;
  //await the modification for the reservation
  const data = await reservationService.modify(reservation_id, reservation);
  //sets old reservation data to new reservation data amd returns it
  reservation.reservation_id = data.reservation_id;
  res.json({ data: reservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  create: [
    asyncErrorBoundary(isValidReservation),
    isNotTuesday,
    notInPast,
    isWithinOpenHours,
    hasBookedStatus,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    isValidStatus,
    isAlreadyFinished,
    asyncErrorBoundary(update),
  ],
  modify: [
    isValidReservation,
    isNotTuesday,
    notInPast,
    isWithinOpenHours,
    asyncErrorBoundary(reservationExists),
    hasBookedStatus,
    asyncErrorBoundary(modify),
  ],
};
