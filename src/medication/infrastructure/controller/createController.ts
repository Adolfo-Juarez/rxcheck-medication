import CreateMedicationUseCase from "../../application/createMedicationUseCase";
import Medication from "../../domain/schemas/Medication";

export default class CreateController{
    constructor(readonly useCase: CreateMedicationUseCase){}

    async run(medication: Medication){
        return await this.useCase.run(medication)
    }
}