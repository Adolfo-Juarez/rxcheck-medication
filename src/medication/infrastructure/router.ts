import { Router } from "express";
import { getController, searchController } from "./dependencies";

const router = Router();

router.get("/health", (req, res) => {
  res.send("OK Medication Service");
});

router.get("/search", searchController.run.bind(searchController));
router.get("/:id", getController.run.bind(getController));

export default router;
