import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,      
        lowercase: true,
    },
    addresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
    }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
