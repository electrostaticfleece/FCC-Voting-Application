module.exports = {
  'development': {
    "dialect": "postgres",
    "use_env_variable": "DATABASE_URL",
    "dialectOptions":{
      "ssl":{
         "require":true
      }
    }
  },
  'production': {
    "dialect": "postgres",
    "use_env_variable": "DATABASE_URL",
    "dialectOptions":{
      "ssl":{
         "require":true
      }
    }
  }
}
