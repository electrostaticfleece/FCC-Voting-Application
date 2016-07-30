module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    location: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    picture: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    google: {
      type: DataTypes.STRING
    },
  }, {
    timestamps: false,

    classMethods: {
      associate(models) {
        User.hasMany(models.Token, {
          foreignKey: 'userId'
        });
        User.hasMany(models.Poll, {
          foreignKey: 'userId'
        });
      },
    },
    instanceMethods: {
      toJSON(){
        return {
          id: this.id,
          email: this.email, 
          profile: {
            name: this.name,
            gender: this.gender,
            location: this.location,
            picture: this.picture
          }
        };
      }
    }
  });

  return User;
};
