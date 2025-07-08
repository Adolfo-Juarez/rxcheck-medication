import GetMedicationByIdUseCase from "../application/getMedicationByIdUseCase";
import GetMedicationListByIdUseCase from "../application/getMedicationListByIdUseCase";
import SearchMedicationUseCase from "../application/searchMedicationUseCase";
import GetMedicationByIdController from "./controller/getMedicationByIdController";
import GetMedicationListByIdController from "./controller/getMedicationListByIdController";
import SearchMedicationController from "./controller/searchMedicationController";
import SequelizeMedicationRepository from "./sequelizeMedicationRepository";

export const sequelizeMedicationRepository = new SequelizeMedicationRepository();

export const getUseCase = new GetMedicationByIdUseCase(sequelizeMedicationRepository);
export const searchUseCase = new SearchMedicationUseCase(sequelizeMedicationRepository);
export const getMedicationListByIdUseCase = new GetMedicationListByIdUseCase(sequelizeMedicationRepository);

export const getController = new GetMedicationByIdController(getUseCase);
export const searchController = new SearchMedicationController(searchUseCase);
export const getMedicationListByIdController = new GetMedicationListByIdController(getMedicationListByIdUseCase);
