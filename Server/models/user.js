import mongoose from "mongoose";

export const UserSchema = mongoose.Schema({
    vkId: { type: String, },
    firstName: { type: String, },
    lastName: { type: String, },
    avatar: { type: String, },
    balance: { type: String },
    date: { type: Date },
});

export default mongoose.model("User", UserSchema);
