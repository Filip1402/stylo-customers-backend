const jwt = require("jsonwebtoken");
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
    return res.status(404).json({ Error: "Customer doesn't exist" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const response = await service.loginCustomer(email, password);
    const customer = response.customer;

    if (!customer.isEmailVerified) {
      return res
        .status(401)
        .json({ Error: "Email address of account not verified!" });
    }

    const token = jwt.sign(customer, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(customer, process.env.REFRESH_TOKEN_SECRET);

    return res.status(200).json({
      success: "Valid customer credentials",
      status: 200,
      customer: customer,
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (err) {
    return res
      .status(401)
      .json({ Error: "Account with the given credentials not found." });
  }
}

async function signup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { first_name, last_name, email, password, phone_number } = req.body;

  try {
    const response = await service.registerCustomer(
      first_name,
      last_name,
      email,
      password,
      phone_number
    );
    const customer = response.customer;
    const token = await service.getActivationToken(customer.id);
    service.sendActivationMail(email, token);
    return res.status(200).json({ customer });
  } catch (err) {
    return res
      .status(err.response.data.statusCode)
      .json({ Error: err.response.data.message });
  }
}

async function activateAccount(req, res) {
  const token = req.query["activation_token"];
  try {
    const response = await service.activateMail(token);
    const customer = response.data;
    return res.status(200).json({ customer });
  } catch (err) {
    return res.status(401).json({ error: "Could not activate account" });
  }
}

module.exports = {
  getAllCustomers,
  getCustomerByEmailAddress,
  login,
  signup,
  activateAccount,
};
