export default (sequelize, DataTypes) => {
  const Poll = sequelize.define('Poll', {
    question: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pollId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    voters: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    }
  }, {
    timestamps: false,

    classMethods: {
      associate(models) {
        Poll.belongsTo(models.User, {
          foreignKey: 'pollId'
        });
        Poll.hasMany(models.Item, {
          foreignKey: 'poll'
        });
      }
    }
  });

  return Poll;
};