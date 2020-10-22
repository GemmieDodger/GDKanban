const express = require('express')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app = express()
const {List, sequelize, Project, Task} = require('./models')
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

app.get(['/'], async (request, response) => {
    const projects = await Project.findAll({
        include: [
            {model: List, as: 'lists'}
        ]
    })
   // SENDS BACK TO SERVER response.send(projects) 
    response.render('projects', {projects:JSON.stringify(projects), date: new Date()}) //looks for view engine (handlebars)
    
})
// regular get all projects
app.get(['/projects'], async (request, response) => {
    const projects = await Project.findAll({
        include: [
            {model: List, as: 'lists'}
        ]
        
    })
   // SENDS BACK TO SERVER response.send(projects) 
    response.send(projects) //looks for view engine (handlebars)
    
})

//create
app.post(['/','/projects'], async (req,res) => {
    await Project.create({text: req.body.text})
   
    res.send()
})

//EDIT PROJECT
app.post('/projects/:project_id/edit', async(request, response) => {
    const project = await Project.findByPk(request.params.project_id)
    await project.update(request.body)
    
    // const project = await Project.findByPk(request.params.project_id)
    // Project.findByPk(req.params.project_id)
    // .then (project => {
    //     project.text = {text: req.body.text}
    //     res.send()
    // })
    response.send()
})

//DELETE PROJECT
app.get('/projects/:project_id/delete', async (req, res) => {
    Project.findByPk(req.params.project_id)
    .then(project => {
        project.destroy()
        res.send()

    })
})
//GET SINGULAR PROJECT
 
app.get('/projects/:project_id', async (request, response) => {
    const project = await Project.findByPk(request.params.project_id, {nest: true, include: {all: true}})
    const lists = await project.getLists({
        include: [
            {model: Task, as: 'tasks'}
        ]
    })
  
 
    response.render('project',{
        project: JSON.stringify(project), 
        lists: JSON.stringify(lists),
        date: new Date()}
    )
})
    


app.listen(3000, () => {
    console.log('app server running on port', 3000)
})