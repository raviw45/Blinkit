import mongoose from "mongoose";

//Base User Schema
const branchShcema = new mongoose.Schema({
  name: {
    type: String,
  },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  address: {
    type: String,
  },
  deliveryPartners: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
    },
  ],
});

export const Branch = mongoose.model("Branch", branchShcema);

export default Branch;
