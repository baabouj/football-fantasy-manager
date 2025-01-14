import { Router } from "express";

import { teamController } from "../controllers/team.controller";

const teamRouter = Router();

teamRouter.get("/", teamController.find);

export { teamRouter };
