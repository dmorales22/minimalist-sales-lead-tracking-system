/*
This file contains the settings of the Express server
Author(s): David Morales
Last Modified: 09/03/2023
 */

const express = require("express");
const compression = require("compression");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const leadRoutes = require("./routes/leadRoutes");

app.use(compression()); //Enables text compression
app.use(
  cors({
    //Checks if request are coming from a specific origin
    origin: process.env.CORSURL, //Replace URL upon deployment
    methods: [
      "POST",
      "PUT",
      "GET",
      "OPTIONS",
      "HEAD",
      "DELETE",
      "UPDATE",
      "PATCH",
    ],
    credentials: true,
  })
);

//For parsing JSON data from the POST requests
app.use(bodyparser.json({ limit: "16mb" }));

//For urlencoded and form data
app.use(bodyparser.urlencoded());
app.use(bodyparser.urlencoded({ extended: true }));

// for parsing multipart/form-data
app.use(express.static("public"));

//Non-protected routes. Should be use for public/unauthenticated routes
app.use(leadRoutes);
app.use(express.static(__dirname + "/static", { dotfiles: "allow" }));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});


module.exports = app;
