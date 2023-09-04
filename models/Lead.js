const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    name: String,
    status: String,
    email: String,
    estimatedSaleAmount: Number,
    estimatedCommission: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema, "Lead");
