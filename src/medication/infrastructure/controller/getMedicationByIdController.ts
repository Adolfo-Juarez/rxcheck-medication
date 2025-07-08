import GenericResponse from "../../../shared/dto/genericResponse";
import GetMedicationByIdUseCase from "../../application/getMedicationByIdUseCase";
import { Request, Response } from "express";
import MedicationResponse from "../../domain/dto/mediationResponse";

export default class GetMedicationByIdController {
  constructor(readonly useCase: GetMedicationByIdUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const result = await this.useCase.run(id);

      const response: GenericResponse<MedicationResponse> = {
        message: result
          ? "Medication retrieved successfully"
          : "Medication not found",
        success: result !== null,
        error: result === null ? "Medication not found" : undefined,
        data: result ?? undefined,
      };

      res.status(result ? 200 : 404).json(response);
    } catch (error) {
      const errorResponse: GenericResponse<MedicationResponse> = {
        message: "Failed to retrieve medication",
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };

      res.status(500).json(errorResponse);
    }
  }
}
