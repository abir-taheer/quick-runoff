"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../sequelize.js")[env];
const db = {};

let sequelize;
if (config.url) {
	sequelize = new Sequelize(config.url, config);
} else {
	sequelize = new Sequelize(
		config.database,
		config.username,
		config.password,
		config
	);
}

const options = require("./options")(sequelize, Sequelize.DataTypes);
const users = require("./users")(sequelize, Sequelize.DataTypes);
const rankings = require("./rankings")(sequelize, Sequelize.DataTypes);

Object.assign(db, { options, rankings, users });

options.associate(db);
users.associate(db);
rankings.associate(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
