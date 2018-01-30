// Example model

const Sequelize = require('sequelize');
const User = require('./user')
module.exports = (sequelize, DataTypes) => {
    const SkillUser = sequelize.define('SkillUser', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        skill_id: {
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER
        }
    }, {underscored: true});
    return SkillUser;
};
