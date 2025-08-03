import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  brand: String,
  category: String,
  motorBrands: [String],
  sizes: { type: Object, default: {} },
  productStructure: Object,
  images: [String],
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
