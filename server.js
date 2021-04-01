const express = require("express");
const app = express();
require("dotenv").config();
const {PORT = 5000} = process.env;
const bodyParser = require("body-parser");
const vareRoute = require("./routes/myapp");

let busboy = require("busboy"); //middleware for form/file upload
app.use(bodyParser.json());
// app.get("/", (req, res) => res.send("Hello World"));

app.use(express.static("public"));
app.use("/myapp", express.static("public"));
app.use("/myapp", vareRoute);

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
