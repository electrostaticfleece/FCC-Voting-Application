import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize'
import sequelizeConfig from '../sequelize_config';
import { ENV } from '../../../config/appConfig';

console.log('Configuring Sequelize')
const config = sequelizeConfig[ENV];
const basename = path.basename(module.filename);
const db = {};
let sequelize; 

const dbUrl = process.env.DATABASE_URL;

sequelize = new Sequelize(dbUrl, config);

fs
  .readdirSync(__dirname)
  .filter((file) => 
    (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if(db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = sequelize;

module.exports = db; 