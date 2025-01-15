import { app } from "./app";
import { logger } from "./config/pino";

const port = process.env.PORT || 4000;

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
