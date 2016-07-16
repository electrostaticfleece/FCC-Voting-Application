module.exports = {
  up(queryInterface, DataTypes) {
    return queryInterface.createTable(
      'Polls', {
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
      }
    );
  },

  down(queryInterface) {
    return queryInterface.dropTable('Tokens');
  }
};