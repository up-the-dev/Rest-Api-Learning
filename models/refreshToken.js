import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        unique: true
    }
})
const RefreshToken = new mongoose.model("RefreshToken", refreshTokenSchema, "refreshtokens")
export default RefreshToken