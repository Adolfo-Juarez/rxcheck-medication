import MedicationResponse from "../domain/dto/mediationResponse";
import MedicationRepository from "../domain/repository/MedicationRepository";

export default class GetMedicationListByIdUseCase {
  constructor(private readonly medicationRepository: MedicationRepository) {}

  async execute(ids: string[]): Promise<MedicationResponse[]> {
    const result = await this.medicationRepository.bulkGetByIds(ids);
    return result.map((medication) => ({
      id: medication.id,
      name: medication.name,
      category: medication.category,
      form: medication.form,
      strength: medication.strength,
      classification: medication.classification,
      indication: medication.indication,
      text: `${medication.name} (${medication.category}) - ${medication.form}, ${medication.strength}`,
    }));
  }
}
