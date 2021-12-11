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

app.get("/api/persons", (req, res, next) => {
  PhoneNumber.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((error) => next(error));
});
app.get("/info", (req, res) => {
  PhoneNumber.find({})
    .then((result) => {
      console.log(result.length);
      const exercise32Html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>exercise 3-2</title>
  </head>
  <body>
  <div> phonebook has info for ${result.length} people </div>
  <div> ${d} </div>
  </body>
</html>`;
      res.send(exercise32Html);
    })
    .catch((error) => next(error));
});
const d = new Date().toString();

app.get("/api/persons/:id", (req, res) => {
  PhoneNumber.findById(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => next(error));
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
  const phoneNumber = new PhoneNumber({
    name: req.body.name,
    number: req.body.number,
  });

  phoneNumber
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      if (error.name === "ValidationError"){
        res.status(409).send({errorMessage : "this name is already in the phonebook"})
      }
      return next(error);
    });
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
