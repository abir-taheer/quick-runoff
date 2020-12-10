"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class rankings extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			rankings.belongsTo(models.users);
			rankings.belongsTo(models.options);
		}
	}
	rankings.init(
		{
			userId: DataTypes.INTEGER,
			optionId: DataTypes.INTEGER,
			rank: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "rankings",
		}
	);
	return rankings;
};
