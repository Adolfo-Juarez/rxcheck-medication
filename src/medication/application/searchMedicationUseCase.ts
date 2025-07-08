import MedicationResponse from "../domain/dto/mediationResponse";
import MedicationRepository from "../domain/repository/MedicationRepository";

export default class SearchMedicationUseCase {
  constructor(readonly repository: MedicationRepository) {}

  async run(query: string): Promise<MedicationResponse[]> {
    const results = await this.repository.search(query);
    const medications: MedicationResponse[] = results.map((result) => ({
      id: result.id,
      name: result.name,
      category: result.category,
      form: result.form,
      strength: result.strength,
      classification: result.classification,
      indication: result.indication,
      text: `${result.name} (${result.category}) - ${result.form}, ${result.strength}`,
    }));
    return medications;
  }
}
