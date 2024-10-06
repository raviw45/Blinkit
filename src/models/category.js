import mongoose from "mongoose";

export const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
});

export const Category = mongoose.model("Category", categorySchema);

export default Category;
