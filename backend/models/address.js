import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    addressName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    addressCity: {
        type: String,
        required: true,
    },
    addressState: {
        type: String,
        required: true,
    },
    addressZipCode: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);
export default Address;
