import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../database/sequelize';

class MedicationModel extends Model {
  public id!: string;
  public name!: string;
  public category!: string;
  public dosage!: string;
  public form!: string;
  public strength!: string;
  public classification!: string;
  public indication!: string;
}

MedicationModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dosage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    form: {
      type: DataTypes.STRING,
      allowNull: true
    },
    strength: {
      type: DataTypes.STRING,
      allowNull: true
    },
    classification: {
      type: DataTypes.STRING,
      allowNull: true
    },
    indication: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'medication',
    tableName: 'medication',
    timestamps: false
  }
).sync({alter: true});



export default MedicationModel;
