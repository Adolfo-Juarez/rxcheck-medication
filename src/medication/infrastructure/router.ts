import { Router } from "express";
import { getController, getMedicationListByIdController, searchController } from "./dependencies";

const router = Router();

router.get("/health", (req, res) => {
  res.send("OK Medication Service");
});

router.get("/search", searchController.run.bind(searchController));
router.post("/fetch", getMedicationListByIdController.run.bind(getMedicationListByIdController));
router.get("/:id", getController.run.bind(getController));

export default router;
