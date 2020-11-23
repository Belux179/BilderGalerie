//require("dotenv").config();
const express = require("express");

const config = require("./server/config");
const app = config(express());

// database
require("./database");

// inicio de servidor
app.listen(app.get("port"), () => {
  console.log("Server en la puerto", app.get("port"));
});
