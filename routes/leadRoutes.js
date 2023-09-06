/*
This file contain the HTTP routes for the Lead controller functions.
Author(s): David Morales
Last Modified: 09/05/2023
 */

const express = require("express");
const Lead = require("../controllers/leadController");
const router = express.Router();

router.post("/dashboard/v1/lead", function (req, res) {
  Lead.createLead(req, res);
});

router.get("/dashboard/v1/lead", function (req, res) {
  Lead.getLeads(req, res);
});

router.get("/dashboard/v1/lead/:id", function (req, res) {
  Lead.getLeadById(req, res);
});

router.post("/dashboard/v1/lead/search", function (req, res) {
  Lead.getLeadsByPagination(req, res);
});

router.patch("/dashboard/v1/lead/:id", function (req, res) {
  Lead.updateLeadById(req, res);
});

router.delete("/dashboard/v1/lead/:id", function (req, res) {
  Lead.deleteLeadById(req, res);
});

module.exports = router;
