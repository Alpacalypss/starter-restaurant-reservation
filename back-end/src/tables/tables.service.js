const knex = require("../db/connection");

const list = () => {
  return knex("tables").select("*").orderBy("tables.table_name");
};

const read = (table_id) => {
  return knex("tables").select("*").where({ table_id }).first();
};

const create = (table) => {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdTable) => createdTable[0]);
};

module.exports = {
  list,
  read,
  create,
};
