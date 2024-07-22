'use strict';

const Sequelize = require('sequelize');
const sequelize = require('./connection');

module.exports = sequelize.define('revision', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  state: Sequelize.STRING,
  title: Sequelize.STRING,
  description: Sequelize.STRING,
  issueId: {
    type: Sequelize.INTEGER,
    field: 'issue_id'
  },
  created_by: {
    type: Sequelize.STRING,
    defaultValue: 'unknown'
  },
  updated_by: {
    type: Sequelize.STRING,
    defaultValue: 'unknown'
  }
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  tableName: 'revisions'
});
