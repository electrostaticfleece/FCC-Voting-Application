let dbConfig = require('./postgres');

export const connect = dbConfig.connect;
export const session = dbConfig.session;
export const passport = dbConfig.passport;
export const controllers = dbConfig.controllers;

export default dbConfig.default;