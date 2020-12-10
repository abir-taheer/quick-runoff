"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class options extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			options.hasMany(models.rankings);
			options.belongsTo(models.users, { foreignKey: "addedBy" });
		}
	}
	options.init(
		{
			name: DataTypes.STRING,
			active: DataTypes.BOOLEAN,
			addedBy: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "options",
		}
	);
	return options;
};
