const express = require('express')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()
const {project, List, sequelize, Project, Task} = require('./models')
const {response} = require('express')


const handlebars = expressHandlebars({ 
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.use(express.static('public'))
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true}))
app.use(express.json())


//GET HOME

// app.get('/', (request, response) => {
//     response.render('projects', {date: new Date()})
// })


//PROJECTS

//GET ALL PROJECTS

app.get(['/','/projects'], async (request, response) => {
    const projects = await Project.findAll({
        include: [
            {model: List, as: 'lists'}
        ]
    })
   // SENDS BACK TO SERVER response.send(projects) //not sure this is right
    response.render('projects', {projects:JSON.stringify(projects), date: new Date()}) //looks for view engine (handlebars)
    
})

//GET SINGULAR PROJECT
 
app.get('/projects/:project_id', async (request, response) => {
    const project = await Project.findByPk(request.params.project_id)
    const lists = await project.getLists({
        include: [
            {model: Task, as: 'tasks'}
        ]
    })
    response.render('project',{project, date: new Date()}
    )
})

app.post('/projects', async (req,res) => {
    const projects = await Project.findAll({
        include: [
            {model: List, as: 'lists'}
        ]
    })
    const project = req.body
    console.log(project)
    projects.push(project)
    console.log(projects)
    res.send()
})


app.get('/projects/:project_id/delete', async (req, res) => {
    const projects = await Project.findAll({
        include: [
            {model: List, as: 'lists'}
        ]
    })
    const index = projects.findIndex( project => {
        return project.project_id == req.params.project_id
    }) 
    projects.splice(index, 1)
    res.send()
})
app.listen(3000, () => {
    console.log('app server running on port', 3000)
})