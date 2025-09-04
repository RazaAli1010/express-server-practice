import express from "express";
import dotenv from "dotenv";
import logger from "./logger.js";
import morgan from "morgan";
dotenv.config({ path: "./.env" });
const app = express();

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
app.use(express.json());

let myCollection = [];
let id = 1;

app.post("/add", (req, res) => {
  const { name, price } = req.body;
  const item = {
    id: id++,
    name,
    price,
  };
  myCollection.push(item);

  res.status(201).send(item);
});
app.get("/add", (req, res) => {
  res.status(200).send(myCollection);
});
app.get("/add/:id", (req, res) => {
  const item = myCollection.find((i) => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).send("item not found");
  }
  res.status(200).send(item);
});
app.put("/add/:id", (req, res) => {
  const item = myCollection.find((i) => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).send("404 not found");
  }
  const { name, price } = req.body;
  item.name = name;
  item.price = price;
  res.status(200).send(item);
});

app.delete("/add/:id", (req, res) => {
  const index = myCollection.findIndex((i) => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send("404 not found");
  }
  myCollection.splice(index, 1);
  res.status(200).send("deleted successfully");
});

app.get("/", (req, res) => {
  res.send("welcome to home unknown");
});
app.listen(process.env.PORT, () => {
  console.log("app is listening");
});
