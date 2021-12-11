require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const PhoneNumber = require("./models/phoneNumber");
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("the-phonebook/build"));

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);
let data = [];

const d = new Date().toString();

app.get("/api/persons", (req, res, next) => {
  PhoneNumber.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res) => {
  if (data[req.params.id]) {
    res.send(data[req.params.id]);
  } else {
    res.status(404).send("Not Found");
  }
});

app.delete("/api/persons/:id", (req, res, next) => {
  PhoneNumber.findByIdAndRemove(req.params.id)
    .then((x) => {
      PhoneNumber.find({}).then((result) => {
        res.send(result);
      });
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  if (req.body.name === "") {
    res.status(400).send({ error: "name field is mandatory" });
  }
  if (req.body.number === "") {
    res.status(400).send({ error: "number field is mandatory" });
  }
  const phoneNumber = new PhoneNumber({
    name: req.body.name,
    number: req.body.number,
  });

  phoneNumber
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const number = {
    name: req.body.name,
    number: req.body.number,
  };
  PhoneNumber.findByIdAndUpdate(req.params.id, number, { new: true })
    .then((updatedNumber) => {
      res.json(updatedNumber);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  next(error);
};
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
