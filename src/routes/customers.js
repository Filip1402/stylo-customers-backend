var express = require("express");
var router = express.Router();
const { query, body } = require("express-validator");

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

router.post(
  "/signup",
  body("email").isEmail().withMessage("Invalid email format"),
  body("first_name").exists().withMessage("First name should not be empty"),
  body("last_name").exists().withMessage("Last name should not be empty"),
  body("phone_number").exists().withMessage("Phone number should not be empty"),
  async (req, res) => {
    controller.signup(req, res);
  }
);

router.post("/activate", async (req, res) => {
  controller.activateAccount(req, res);
});

module.exports = router;
