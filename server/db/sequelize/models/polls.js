export default (sequelize, DataTypes) => {
  const Poll = sequelize.define('Poll', {
    question: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pollId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    timestamps: false,

    classMethods: {
      associate(models) {
        Poll.belongsTo(models.User, {
          foreignKey: 'pollId'
        });
      }
    }
  });

  return Poll;
};