const DATABASE_URL = process.env.DATABASE_URL;
const logger =
	process.env.SEQUELIZE_LOG === "advanced"
		? console.log
		: query => console.log(query);

const logging = process.env.SEQUELIZE_LOG ? logger : false;

module.exports = {
	development: {
		url: DATABASE_URL,
		define: {
			charset: "utf8",
			collate: "utf8_unicode_ci",
		},
		ssl: true,
		native: true,
		logging,
	},
	production: {
		url: DATABASE_URL,
		define: {
			charset: "utf8",
			collate: "utf8_unicode_ci",
		},
		native: true,
		ssl: true,
		logging,
	},
};
