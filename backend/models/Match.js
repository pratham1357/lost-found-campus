const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Match = sequelize.define('Match', {
    match_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    lost_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'item_id'
      }
    },
    found_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'item_id'
      }
    },
    verified_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    status: {
      type: DataTypes.ENUM('matched', 'returned'),
      defaultValue: 'matched'
    },
    verified_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'matches',
    timestamps: false
  });

  return Match;
};