import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: string;
	declare email: string;
}

export function initUserModel(sequelize: Sequelize) {
	User.init(
		{
			id: {
				type: DataTypes.STRING,
				primaryKey: true
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			}
		},
		{
			sequelize
		}
	);
}
