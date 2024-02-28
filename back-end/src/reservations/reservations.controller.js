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

function _validateTime(str) {
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

function isValidReservation(req, res, next) {
  const reservation = req.body.data;

  if (!reservation) {
    return next({ status: 400, message: `Must have data property.` });
  }

  validFields.forEach((field) => {
    if (!reservation[field]) {
      return next({ status: 400, message: `${field} field required` });
    }

    if (field === "people" && typeof reservation[field] !== "number") {
      return next({
        status: 400,
        message: `${field} must be a number.`,
      });
    }

    if (field === "reservation_date" && !Date.parse(reservation[field])) {
      return next({ status: 400, message: `${field} is not a valid date.` });
    }

    if (field === "reservation_time") {
      if (!_validateTime(reservation[field])) {
        return next({ status: 400, message: `${field} is not a valid time` });
      }
    }
  });

  next();
}

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

function isWithinOpenHours(req, res, next) {
  const reservation = req.body.data;
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

async function list(req, res) {
  const { date, mobile_number } = req.query;
  let reservations;
  if (mobile_number) {
    reservations = await reservationService.search(mobile_number);
  } else {
    reservations = date
      ? await reservationService.listByDate(date)
      : await reservationService.list();
  }
  res.json({
    data: reservations,
  });
}

async function read(req, res) {
  const reservation = res.locals.reservation;
  console.log(reservation);
  res.json({ data: reservation });
}

async function create(req, res) {
  const reservation = req.body.data;
  const { reservation_id } = await reservationService.create(reservation);
  reservation.reservation_id = reservation_id;
  res.status(201).json({ data: reservation });
}

async function update(req, res, next) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;
  const reservation = await reservationService.update(reservation_id, status);
  res.status(200).json({ data: reservation });
}

async function modify(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = req.body.data;
  const data = await reservationService.modify(reservation_id, reservation);
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
