const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;
const db = require("./src/queries");
const cors = require("cors");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

app.get("/covers", db.getCovers);
