import GenericResponse from "../../shared/dto/genericResponse";
import MedicationResponse from "../domain/dto/mediationResponse";
import MedicationRepository from "../domain/repository/MedicationRepository";

export default class GetMedicationByIdUseCase {
  constructor(readonly repository: MedicationRepository) {}

  async run(id: string): Promise<MedicationResponse | null> {
    const result = await this.repository.getById(id);
    const medication: MedicationResponse | null = result
      ? {
          id: result.id,
          name: result.name,
          category: result.category,
          form: result.form,
          strength: result.strength,
          classification: result.classification,
          indication: result.indication,
          text: `${result.name} (${result.category}) - ${result.form}, ${result.strength}`,
        }
      : null;
    return medication;
  }
}