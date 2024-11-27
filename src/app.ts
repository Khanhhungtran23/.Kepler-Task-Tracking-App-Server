import app from "./index";
import * as dotenv from "dotenv";
import logger from "./configs/logger.config";

dotenv.config();

const PORT = process.env.PORT || 3000;

// start server
const server = app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});

export default server;
