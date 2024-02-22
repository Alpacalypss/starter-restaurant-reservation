const tables = require("./01-tables.json");

exports.seed = function (knex) {
  // Deletes ALL existing entries and restarts ID count
  return knex.raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE").then(() => {
    return knex("tables").insert(tables);
  });
};
