import "dotenv/config.js";
import mongoose from "mongoose";
import { Category, Product } from "./src/models/index.js";
import { categories, products } from "./speedData.js";

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Category.deleteMany({});

    const categoryDocs = await Category.insertMany(categories);

    const categoryMap = categoryDocs.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});

    console.log(categoryMap);
    const productsWithCategoryIds = products.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }));

    console.log(productsWithCategoryIds);
    await Product.insertMany(productsWithCategoryIds);
    console.log("DATABASE SEEDED SUCCESSFULLY");
  } catch (error) {
    console.log("Error Sending Database", error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
