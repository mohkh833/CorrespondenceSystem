const path = require("path");
const express = require("express");

const app = express();

var current_path= path.join(__dirname, "/dist/client");
app.use(express.static(current_path));
app.use((err, req, res, next) => {
  res.send(err);
});

app.get('/*', (req, res) => res.sendFile(current_path));

//starting the server
app.listen(4202, () => {
  console.log("Server is up and running at http://localhost:4202/");
});
