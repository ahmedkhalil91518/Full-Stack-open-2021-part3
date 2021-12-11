require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
let data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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
  res.send(data);
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
  console.log(data);
  res.send(data);
});

app.post("/api/persons", (req, res) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].name === req.body.name) {
      res.status(403).send({ error: "name must be unique" });
    }
  }

  if (req.body.name === "") {
    res.status(400).send({ error: "name field is mandatory" });
  }
  if (req.body.number === "") {
    res.status(400).send({ error: "number field is mandatory" });
  }
  const newData = [
    { id: getRandomInt(1000000), name: req.body.name, number: req.body.number },
    ...data,
  ];
  data = newData;
  res.send(newData);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
