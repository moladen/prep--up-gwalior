import { Router } from "express";
import {
  getPublicContact,
  updateContact,
} from "../controllers/contactController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/public", getPublicContact);
router.put("/", protect, updateContact);

export default router;
