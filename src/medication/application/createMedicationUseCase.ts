import MedicationRepository from "../domain/repository/MedicationRepository";
import Medication from "../domain/schemas/Medication";

export default class CreateMedicationUseCase {
    constructor(readonly repository: MedicationRepository) {}

    async run(medication: Medication) {
        return await this.repository.save(medication)
    }
}