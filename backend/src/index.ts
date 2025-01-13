import pino from "pino";

import { app } from "./app";

const port = process.env.PORT || 4000;

const logger = pino();

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
