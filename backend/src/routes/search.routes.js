import { Router } from "express";
import { createSearch, listMySearches } from "../controllers/search.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createSearch);
router.get("/mine", authMiddleware, listMySearches);

export const searchRoutes = router;
