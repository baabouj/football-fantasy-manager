import { Router } from "express";

import { authController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", authController.login);

authRouter.post("/logout", authController.logout);

authRouter.get("/me", authController.me); // route to get the authenticated user

export { authRouter };
