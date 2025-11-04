const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Log = sequelize.define('Log', {
    log_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'logs',
    timestamps: false
  });

  return Log;
};