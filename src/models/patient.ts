import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

export class Patient extends Model<InferAttributes<Patient>, InferCreationAttributes<Patient>> {
	declare id: string;
	declare name: string;
	declare email: string;
	declare address: string;
	declare documentPhoto: string;
	declare phoneNumber: string;
}

export function initpatientModel(sequelize: Sequelize) {
	Patient.init(
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false
			},
			address: {
				type: DataTypes.STRING
			},
			documentPhoto: {
				type: DataTypes.TEXT
			},
			phoneNumber: {
				type: DataTypes.STRING
			}
		},
		{
			sequelize
		}
	);
}
