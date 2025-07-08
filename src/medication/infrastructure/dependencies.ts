import GetMedicationByIdUseCase from "../application/getMedicationByIdUseCase";
import SearchMedicationUseCase from "../application/searchMedicationUseCase";
import GetMedicationByIdController from "./controller/getMedicationByIdController";
import SearchMedicationController from "./controller/searchMedicationController";
import SequelizeMedicationRepository from "./sequelizeMedicationRepository";

export const sequelizeMedicationRepository = new SequelizeMedicationRepository();

export const getUseCase = new GetMedicationByIdUseCase(sequelizeMedicationRepository);
export const searchUseCase = new SearchMedicationUseCase(sequelizeMedicationRepository);

export const getController = new GetMedicationByIdController(getUseCase);
export const searchController = new SearchMedicationController(searchUseCase);
