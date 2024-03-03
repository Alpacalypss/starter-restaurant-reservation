const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const seatRouter = require("../seats/seats.router");

//uses the router functions from seatRouter
//Could put on app.js with "/table/:table_id/seat"
router.use("/:table_id/seat", seatRouter);

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
