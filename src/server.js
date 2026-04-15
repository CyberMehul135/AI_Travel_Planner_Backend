import dotenv from "dotenv";
dotenv.config({ quiet: true });
import app from "./app.js";
import initializeDatabase from "./config/db.connect.js";

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start", err);
  }
})();
