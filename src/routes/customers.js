var express = require("express");
var router = express.Router();
const controller = require("../controllers/CustomersController");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

router.get("/", (req, res) => {
  controller.getAllCustomers(req, res);
});

router.get("/:email", async (req, res) => {
  controller.getCustomerByEmailAddress(req, res);
});

router.post("/login", async (req, res) => {
  controller.login(req, res);
});

router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.status(401);
  if (!refreshTokens.includes(refreshToken)) return res.status(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, customer) => {
      if (err) return res.status(403);
      const accessToken = jwt.sign(
        customer.email,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      );
    }
  );

  res.json({ accessToken: accessToken });
});

module.exports = router;
