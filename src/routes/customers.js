var express = require("express");
var router = express.Router();

const service = require("../services/CustomersService");

router.get("/", async function (req, res, next) {
  const customers = await service.getAllCustomers();
  console.log(customers);
  res.json(customers);
});

router.get("/:email", async function (req, res, next) {
  const email = req.params.email;
  const customer = await service.getCustomerByEmailAddress(email);
  if (customer.length > 0) {
    return res.status(200).json(customer[0]);
  } else {
    return res.status(401).json({ Error: "Customer doesn't exist" });
  }
});

router.post("/login", async function (req, res, next) {
  const { email, password } = req.body;

  const response = await service.loginCustomer(email, password);
  try {
    const customer = response.customer;
    console.log(customer);
    if (customer.isEmailVerified == false) {
      return res.status(401).json({ Error: "Email address not verified" });
    } else {
      return res.status(200).json({ Success: "Valid customer credentials" });
    }
  } catch (err) {
    return res
      .status(401)
      .json({ Error: "Invalid credentials or account doesn't exist" });
  }
});

module.exports = router;
