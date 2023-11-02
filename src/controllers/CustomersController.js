const service = require("../services/CustomersService");
const { validationResult } = require("express-validator");

async function getAllCustomers(req, res) {
  const customers = await service.getAllCustomers();
  res.json(customers);
}

async function getCustomerByEmailAddress(req, res) {
  const email = req.params.email;
  const customer = await service.getCustomerByEmailAddress(email);
  if (customer.length > 0) {
    return res.status(200).json(customer[0]);
  } else {
    return res.status(401).json({ Error: "Customer doesn't exist" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const response = await service.loginCustomer(email, password);
    const customer = response.customer;
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
}

async function signup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ Error: errors.array()[0].msg });
  }

  const { first_name, last_name, email, password } = req.body;

  try {
    const response = await service.registerCustomer(
      first_name,
      last_name,
      email,
      password
    );
    const customer = response.customer;
    return res.status(200).json({ customer });
  } catch (err) {
    return res
      .status(err.response.data.statusCode)
      .json({ Error: err.response.data.message });
  }
}

module.exports = {
  getAllCustomers,
  getCustomerByEmailAddress,
  login,
  signup,
};
