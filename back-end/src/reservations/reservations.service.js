const knex = require("../db/connection");

const listByDate = (reservation_date) => {
  return knex("reservations as r")
    .select("*")
    .where({ reservation_date })
    .orderBy("r.reservation_time");
};

const list = () => {
  return knex("reservations")
    .select("*")
    .orderBy("reservations.reservation_date");
};

const create = (reservation) => {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdReservation) => createdReservation[0]);
};

const read = (reservation_id) => {
  return knex("reservations").select("*").where({ reservation_id }).first();
};

module.exports = {
  list,
  listByDate,
  read,
  create,
};
