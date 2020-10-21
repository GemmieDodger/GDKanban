const {Sequelize, Model, DataTypes} = require('sequelize')
const path = require('path')
const sequelize = process.env.NODE_ENV === 'test'
    ? new Sequelize('sqlite::memory', null, null, {dialect: 'sqlite'})
    : new Sequelize({dialect: 'sqlite', storage: path.join(__dirname, 'data.db')})

class Project extends Model {}
Project.init({
    text: DataTypes.STRING,   
}, {sequelize: sequelize})

class List extends Model {}
List.init({
    title: DataTypes.STRING
}, {sequelize})

class Task extends Model {}
Task.init({
    text: DataTypes.STRING,
    status: DataTypes.BOOLEAN
}, {sequelize})

Project.hasMany(List, {as: 'lists'})
List.belongsTo(Project)

List.hasMany(Task, {as:'tasks'})
Task.belongsTo(List)

module.exports = {Project, List, Task, sequelize}
