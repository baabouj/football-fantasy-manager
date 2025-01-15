import { Router } from "express";

import { transfersController } from "../controllers/transfers.controller";

const transfersRouter = Router();

transfersRouter.get("/", transfersController.find);
transfersRouter.post("/:playerId", transfersController.add);
transfersRouter.patch("/:playerId", transfersController.buy);
transfersRouter.delete("/:playerId", transfersController.remove);

export { transfersRouter };
