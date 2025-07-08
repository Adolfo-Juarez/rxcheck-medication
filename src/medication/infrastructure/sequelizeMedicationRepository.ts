import CreateMedication from "../domain/dto/createMedication";
import MedicationRepository from "../domain/repository/MedicationRepository";
import Medication from "../domain/schemas/Medication";
import MedicationModel from "./models/MedicationModel";
import { Op } from "sequelize";

export default class SequelizeMedicationRepository
  implements MedicationRepository
{
  async bulkGetByIds(ids: string[]): Promise<Medication[]> {
    try {
      const medications = await MedicationModel.findAll({
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      });
      return medications.map((med) => med.toJSON() as Medication);
    } catch (Error: any) {
      console.error("Error in bulkGetByIds:", Error.message);
      return [];
    }
  }
  async bulkSave(medications: CreateMedication[]): Promise<number | null> {
    try {
      // Create valid model objects with required fields including generated IDs if needed
      const medicationsToCreate = medications.map((medication) => ({
        name: medication.name,
        category: medication.category,
        dosage: medication.dosage,
        form: medication.form,
        strength: medication.strength,
        classification: medication.classification,
        indication: medication.indication,
      }));

      // Use the proper options to handle auto-increment IDs
      const result = await MedicationModel.bulkCreate(medicationsToCreate, {
        fields: [
          "name",
          "category",
          "dosage",
          "form",
          "strength",
          "classification",
          "indication",
        ],
      });
      return result.length;
    } catch (error: any) {
      console.error("Error in bulkSave:", error.message);
      return null;
    }
  }

  async getById(id: string): Promise<Medication | null> {
    try {
      const medication = await MedicationModel.findByPk(id);

      if (!medication) {
        return null;
      }

      return medication.toJSON() as Medication;
    } catch (error: any) {
      return null;
    }
  }

  async search(q: string): Promise<Medication[]> {
    try {
      const keywords = q.trim().split(/\s+/); // Separar por palabras

      const orConditions = keywords.flatMap((keyword) => [
        { name: { [Op.like]: `%${keyword}%` } },
        { category: { [Op.like]: `%${keyword}%` } },
        { form: { [Op.like]: `%${keyword}%` } },
        { strength: { [Op.like]: `%${keyword}%` } },
        { classification: { [Op.like]: `%${keyword}%` } },
        { indication: { [Op.like]: `%${keyword}%` } },
      ]);

      const medications = await MedicationModel.findAll({
        where: {
          [Op.or]: orConditions,
        },
        limit: 10,
      });

      return medications.map((med) => med.toJSON() as Medication);
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  }

  async save(medication: Medication): Promise<Medication | null> {
    try {
      const result = await MedicationModel.create({
        id: medication.id,
        name: medication.name,
        category: medication.category,
        dosage: medication.dosage,
        form: medication.form,
        strength: medication.strength,
        classification: medication.classification,
        indication: medication.indication,
      });

      return result.toJSON() as Medication;
    } catch (error: any) {
      return null;
    }
  }
}
