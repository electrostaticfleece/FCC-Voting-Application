export default (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    poll: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    }
  }, {
    timestamps: false,

    classMethods: {
      associate(models) {
        Item.belongsTo(models.Poll, {
          foreignKey: 'poll'
        });
      }
    }
  });

  return Item;
}