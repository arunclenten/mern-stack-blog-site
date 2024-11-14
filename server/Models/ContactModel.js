const mongoose = require("mongoose");

// Define the schema
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
});

// Define and export the model based on the schema
const ContactModel = mongoose.model("Contact", ContactSchema);

module.exports = ContactModel;
