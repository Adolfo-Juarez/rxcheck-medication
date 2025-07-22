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

  async search(query: string): Promise<Medication[]> {
    try {
      if (!query.trim()) {
        return [];
      }

      const searchTerm = query.trim().toLowerCase();
      const keywords = searchTerm
        .split(/\s+/)
        .filter((word) => word.length > 2);

      // 1. Búsqueda por coincidencia exacta (mayor relevancia)
      const exactMatches = await this.findExactMatches(searchTerm);

      // 2. Búsqueda fuzzy complementaria
      const fuzzyResults = await this.findFuzzyMatches(keywords, searchTerm);

      // 3. Combinar y eliminar duplicados
      const allResults = this.combineAndDeduplicateResults(
        exactMatches,
        fuzzyResults
      );

      // 4. Ordenar por relevancia y limitar a 10
      const sortedResults = this.sortByRelevance(
        allResults,
        searchTerm,
        keywords
      );

      return sortedResults.slice(0, 10);
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  }

  private async findExactMatches(searchTerm: string): Promise<Medication[]> {
    const medications = await MedicationModel.findAll({
      where: {
        [Op.or]: [
          // Coincidencia exacta en nombre (más importante)
          { name: { [Op.iLike]: `%${searchTerm}%` } },
          // Nombre que empiece con el término
          { name: { [Op.iLike]: `${searchTerm}%` } },
          // Categoría exacta
          { category: { [Op.iLike]: searchTerm } },
        ],
      },
      limit: 15,
    });

    return medications.map((med) => med.toJSON() as Medication);
  }

  private async findFuzzyMatches(
    keywords: string[],
    searchTerm: string
  ): Promise<Medication[]> {
    if (keywords.length === 0) return [];

    // Crear condiciones más inteligentes para múltiples palabras
    let whereCondition;

    if (keywords.length === 1) {
      // Una sola palabra: buscar en todos los campos
      whereCondition = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${keywords[0]}%` } },
          { category: { [Op.iLike]: `%${keywords[0]}%` } },
          { indication: { [Op.iLike]: `%${keywords[0]}%` } },
          { classification: { [Op.iLike]: `%${keywords[0]}%` } },
          ...(searchTerm.length > 3
            ? [
                { form: { [Op.iLike]: `%${searchTerm}%` } },
                { strength: { [Op.iLike]: `%${searchTerm}%` } },
              ]
            : []),
        ],
      };
    } else {
      // Múltiples palabras: todas deben aparecer en algún campo
      whereCondition = {
        [Op.and]: keywords.map((keyword) => ({
          [Op.or]: [
            { name: { [Op.iLike]: `%${keyword}%` } },
            { category: { [Op.iLike]: `%${keyword}%` } },
            { indication: { [Op.iLike]: `%${keyword}%` } },
            { classification: { [Op.iLike]: `%${keyword}%` } },
            { form: { [Op.iLike]: `%${keyword}%` } },
          ],
        })),
      };
    }

    const medications = await MedicationModel.findAll({
      where: whereCondition,
      limit: 20,
    });

    return medications.map((med) => med.toJSON() as Medication);
  }

  private combineAndDeduplicateResults(
    exact: Medication[],
    fuzzy: Medication[]
  ): Medication[] {
    const seen = new Set(exact.map((med) => med.id));
    const unique = [...exact];

    for (const med of fuzzy) {
      if (!seen.has(med.id)) {
        unique.push(med);
        seen.add(med.id);
      }
    }

    return unique;
  }

  private sortByRelevance(
    medications: Medication[],
    searchTerm: string,
    keywords: string[]
  ): Medication[] {
    return medications.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, searchTerm, keywords);
      const scoreB = this.calculateRelevanceScore(b, searchTerm, keywords);
      return scoreB - scoreA; // Orden descendente (mayor relevancia primero)
    });
  }

  private calculateRelevanceScore(
    medication: Medication,
    searchTerm: string,
    keywords: string[]
  ): number {
    let score = 0;
    const name = (medication.name || "").toLowerCase();
    const category = (medication.category || "").toLowerCase();
    const indication = (medication.indication || "").toLowerCase();
    const classification = (medication.classification || "").toLowerCase();

    // Puntuaciones por coincidencia exacta (mayor peso)
    if (name === searchTerm) score += 1000;
    if (name.startsWith(searchTerm)) score += 500;
    if (name.includes(searchTerm)) score += 200;

    // Categoría y clasificación (peso medio)
    if (category === searchTerm || classification === searchTerm) score += 300;
    if (category.includes(searchTerm)) score += 100;
    if (classification.includes(searchTerm)) score += 80;

    // Indicación (menor peso)
    if (indication.includes(searchTerm)) score += 50;

    // Puntuación por keywords individuales
    keywords.forEach((keyword) => {
      if (name.includes(keyword)) score += 50;
      if (category.includes(keyword)) score += 30;
      if (indication.includes(keyword)) score += 20;
      if (classification.includes(keyword)) score += 25;
    });

    // Bonificación por múltiples coincidencias en el mismo campo
    const nameMatches = keywords.filter((k) => name.includes(k)).length;
    if (nameMatches > 1) score += nameMatches * 25;

    // Penalizar nombres muy largos (suelen ser menos específicos)
    if (name.length > 50) score -= 10;

    // Bonificar nombres cortos y concisos
    if (name.length < 20 && name.includes(searchTerm)) score += 20;

    return score;
  }
}
