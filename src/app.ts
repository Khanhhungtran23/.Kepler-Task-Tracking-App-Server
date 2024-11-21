import app from "./index";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

// start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
