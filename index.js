require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const PhoneNumber = require("./models/phoneNumber")
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('the-phonebook/build'))

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
  <div> phonebook has info for ${data.length} people </div>
  <div> ${d} </div>
  </body>
</html>`;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.get("/api/persons", (req, res) => {
  PhoneNumber.find({}).then((result) => {
    res.send(result)
    // mongoose.connection.close();
  });
});

app.get("/info", (req, res) => {
  res.send(exercise32Html);
});

app.get("/api/persons/:id", (req, res) => {
  if (data[req.params.id]) {
    res.send(data[req.params.id]);
  } else {
    res.status(404).send("Not Found");
  }
});

app.delete("/api/persons/:id", (req, res) => {
  let newData = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === +req.params.id) {
      continue;
    } else {
      newData.push(data[i]);
    }
  }
  data = newData;
  res.send(data);
});

app.post("/api/persons", (req, res) => {
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

  phoneNumber.save().then((result) => {
    res.send(result)
    console.log(result);
    // mongoose.connection.close();
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
