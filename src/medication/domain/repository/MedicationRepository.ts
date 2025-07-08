import CreateMedication from "../dto/createMedication";
import Medication from "../schemas/Medication";

export default interface MedicationRepository {
  getById(id: string): Promise<Medication | null>;
  search(query: string): Promise<Medication[]>;
  save(medication: CreateMedication): Promise<Medication | null>;
  bulkSave(medications: CreateMedication[]): Promise<number | null>;
  bulkGetByIds(ids: string[]): Promise<Medication[]>;
}
