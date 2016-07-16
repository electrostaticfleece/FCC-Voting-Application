//Use old export style until sequelize cli supports es6 syntax.

function defaultExport() {};

defaultExport.DB_TYPE = process.env.DB_TYPE || 'POSTGRES';
defaultExport.ENV = process.env.NODE_ENV || 'development';

module.exports = defaultExport;