import mongoose from "mongoose";

//Base User Schema
const userShcema = new mongoose.Schema({
  name: {
    type: String,
  },
  role: {
    type: String,
    enum: ["customer", "admin", "deliveryPartner"],
    required: true,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
});

//Customer schema
const customerSchema = new mongoose.Schema({
  ...userShcema.obj,
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["customer"],
    default: "customer",
  },
  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  address: {
    type: String,
  },
});

//Delivery Partner schema
const deliveryPartnerSchema = new mongoose.Schema({
  ...userShcema.obj,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["deliveryPartner"],
    default: "deliveryPartner",
  },
  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  address: {
    type: String,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
});

//Admin Schema
const adminSchema = new mongoose.Schema({
  ...userShcema.obj,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin"], default: "admin" },
});

export const Customer = mongoose.model("Customer", customerSchema);
export const DeliveryPartner = mongoose.model(
  "DeliveryPartner",
  deliveryPartnerSchema
);
export const Admin = mongoose.model("Admin", adminSchema);
