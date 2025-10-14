import { promptController } from "./controller";
import express from "express";
const app = express();

app.use(express.json());

app.post("/api/prompt", promptController);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
