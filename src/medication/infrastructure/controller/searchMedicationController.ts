import GenericResponse from "../../../shared/dto/genericResponse";
import SearchMedicationUseCase from "../../application/searchMedicationUseCase";
import MedicationResponse from "../../domain/dto/mediationResponse";
import { Request, Response } from "express";

export default class SearchMedicationController {
  constructor(readonly useCase: SearchMedicationUseCase) {}

  async run(req: Request, res: Response) {
    try {
      const query = req.query.q as string;
      const medications = await this.useCase.run(query);
      
      const response: GenericResponse<MedicationResponse[]> = {
        message: "Medications retrieved successfully",
        success: true,
        data: medications,
      };
      res.json(response);
    } catch (error) {
      const errorResponse: GenericResponse<MedicationResponse[]> = {
        message: "Failed to retrieve medications",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
      res.status(500).json(errorResponse);
    }
  }
}
