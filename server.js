/*
This file contains the main entry for the server
Author(s): David Morales
Last Modified: 09/05/2023
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./index");
dotenv.config({ path: "./.env" });

let DB = "";

if (process.env.IS_AUTH === 0) {
  DB =
    "mongodb://" +
    process.env.MONGODB_USER +
    ":" +
    process.env.DB_PASSWORD +
    "@" +
    process.env.MONGODB_SERVER +
    "/" +
    process.env.MONGODB_NAME +
    "?retryWrites=true&w=majority";
} else {
  DB =
    "mongodb://" + process.env.MONGODB_SERVER + "/" + process.env.MONGODB_NAME;
}

// Connect to MONGODB server.
mongoose.connect(
  DB,
  {
    useNewURLParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("Database connection successful!");
  }
);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});

// Close database connection when the app is terminated.
process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected on app termination");
    process.exit(0);
  });
});
