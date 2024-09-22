import User from "../models/user.js";
import zod from "zod";
import Address from "../models/address.js";

const userVerifySchema = zod.string().email();

// Signin
export const signinHandler = async (req, res) => {
    try {
        console.log('======== signin route ======')
        const { username } = req.body;
        console.log(username, 'username')
        // Verify username
        try {
            userVerifySchema.parse(username);
        } catch (error) {
            console.log(error)
            return res.status(403).json({
                message: error, // Improved error message handling
                success: false,
            });
        }

        // Check if the user exists
        const user = await User.findOne({ email: username }).populate("addresses");

        if (!user) {
            return res.status(403).json({
                message: "User not registered",
                success: false,
            });
        }

        return res.status(200).json({
            data: user,
            success: true,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while signing in",
        });
    }
};




// Signup
export const signupHandler = async (req, res) => {
    try {
        const { username } = req.body;

        // Verify username
        try {
            userVerifySchema.parse(username);
        } catch (error) {
            return res.status(403).json({
                message: error, // Improved error message handling
                success: false,
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email: username });
        if (existingUser) {
            return res.status(403).json({
                message: "User already registered",
                success: false,
            });
        }

        // Create a new user
        await User.create({ email: username });

        return res.status(200).json({
            message: "Successfully registered",
            success: true,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while signing up",
        });
    }
};





const addressSchema = zod.object({
    addressName: zod.string().min(1),
    address: zod.string().min(1),
    addressCity: zod.string().min(1),
    addressState: zod.string().min(1),
    addressZipCode: zod.string().regex(/^\d{6}$/),
});

// Add Address
export const addAddressHandler = async (req, res) => {
    try {
        const { username } = req.headers;
        const { addressName, address, addressCity, addressState, addressZipCode } = req.body;
        console.log(
            username,
            addressName,
            address,
            addressCity,
            addressState,
            addressZipCode
        )
        // Verify user
        try {
            userVerifySchema.parse(username);
        } catch (error) {
            return res.status(404).json({
                message: error,
                success: false,
            });
        }

        // Validate address data
        try {
            addressSchema.parse({ addressName, address, addressCity, addressState, addressZipCode });
        } catch (error) {
            return res.status(404).json({
                message: error,
                success: false,
            });
        }

        // Create address
        const AddressData = await Address.create({ addressName, address, addressCity, addressState, addressZipCode });

        // Update user with new address
        const data = await User.findOneAndUpdate(
            { email: username },
            { $push: { addresses: AddressData._id } },
            { new: true }
        ).populate("addresses");

        return res.status(200).json({
            data,
            success: true,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while adding address",
        });
    }
};




// Delete Address
export const deleteAddressHandler = async (req, res) => {
    try {
        const { username } = req.headers;
        const { id } = req.body;

        console.log(username, id)

        // Delete the address and update the user's addresses
        await Address.findOneAndDelete({ _id: id });
        await User.findOneAndUpdate(
            { email: username },
            { $pull: { addresses: id } }
        );

        const data = await User.findOne({ email: username }).populate("addresses");;

        return res.status(200).json({
            data,
            success: true,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while deleting address",
        });
    }
};




// Update Address
export const updateAddressHandler = async (req, res) => {
    try {
        const { username } = req.headers;
        const { id, addressName, address, addressCity, addressState, addressZipCode } = req.body;

        console.log(username, id, addressName, address, addressCity, addressState, addressZipCode)
        // Verify user
        try {
            userVerifySchema.parse(username);
        } catch (error) {
            return res.status(403).json({
                message: error,
                success: false,
            });
        }

        // Validate address data
        try {
            addressSchema.parse({ addressName, address, addressCity, addressState, addressZipCode });
        } catch (error) {
            return res.status(404).json({
                message: error,
                success: false,
            });
        }

        // Update address
        const updatedAddress = await Address.findOneAndUpdate(
            { _id: id },
            { addressName, address, addressCity, addressState, addressZipCode },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({
                message: "Address not found",
                success: false,
            });
        }

        const userData = await User.findOne({ email: username }).populate("addresses");;

        return res.status(200).json({
            data: userData,
            success: true,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while updating address",
        });
    }
};
