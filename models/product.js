import mongoose from "mongoose";
import { APP_URL } from '../config'
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true

    },
    size: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        get: (image) => {
            return `${APP_URL}/${image}`
        }
    }
}, { timestamps: true, toJSON: { getters: true }, id: false })
const Product = new mongoose.model("Product", productSchema, "products")
export default Product