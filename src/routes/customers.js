var express = require("express");
var router = express.Router();

const controller = require("../controllers/CustomersController");

router.get("/", async (req, res) => {
  controller.getAllCustomers(req, res);
});

router.get("/:email", async (req, res) => {
  controller.getCustomerByEmailAddress(req, res);
});

router.post("/login", async (req, res) => {
  controller.login(req, res);
});

module.exports = router;
