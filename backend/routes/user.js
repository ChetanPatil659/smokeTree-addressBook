import { Router } from "express";
import {
    addAddressHandler,
    deleteAddressHandler,
    signinHandler,
    signupHandler,
    updateAddressHandler
} from "../controllers/user.js";

const router = Router();

// User authentication routes
router.post("/signin", signinHandler);
router.post("/signup", signupHandler);


// Address management routes
router.post("/addAddress", addAddressHandler);
router.delete("/deleteAddress", deleteAddressHandler);
router.put("/updateAddress", updateAddressHandler);

export default router;