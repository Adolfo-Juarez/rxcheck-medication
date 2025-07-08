import GenericResponse from "../../../shared/dto/genericResponse";
import GetMedicationListByIdUseCase from "../../application/getMedicationListByIdUseCase";
import MedicationResponse from "../../domain/dto/mediationResponse";
import { Request, Response } from "express";

export default class GetMedicationListByIdController {
  constructor(readonly useCase: GetMedicationListByIdUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const ids = req.body.ids as string[];
      const result = await this.useCase.execute(ids);
      const response: GenericResponse<MedicationResponse[]> = {
        message:
          result.length > 0
            ? "Medications retrieved successfully"
            : "No medications found",
        success: result.length > 0,
        error: result.length === 0 ? "No medications found" : undefined,
        data: result,
      };
      res.status(result.length > 0 ? 200 : 404).json(response);
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
