const express = require("express")
require("dotenv").config()

const server = express()
const port = process.env.PORT | 3004;

server.get("/", (req, res) => {
    res.json({message: "Hello this is customers microservice!"})
})

server.listen(port, () => {
    console.log("Server listening on port " + port)
})