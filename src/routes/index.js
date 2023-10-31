var express = require('express');
var router = express.Router();

router.get("/", (req, res) => {
  res.json({message: "Hello this is customers microservice!"})
})

module.exports = router;
