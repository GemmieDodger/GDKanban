class Project {
    constructor(text) {
        this.project_id = window.crypto.getRandomValues(new Uint8Array(3)).join("")
        this.text = text
        this.lists = []
    }
}



const viewProject = project => {

    return `<li
    id="${project.project_id}"
    class="projectCard vertical-center">${project.text} </br>
        <button class="classOption" onclick="app.run('delete', ${project.id} )" >❌</button> 
        <button class="classOption" onclick="app.run('showEdit', ${project.id} )" >📝</button></br>
        <form onsubmit="app.run('edit', ${project.id}, this ); return false" id="${project.id}" hidden>
        <input class="input2" name="text" placeholder="Edit name here" required>
        <button class="classOption" >✅</button></form></br>
        <a class="a1" href="/projects/${project.id}">=></a>
     
    </li>
    `
}

const view = (state) => `
    <div class="wrapper">        

            <ul class="projects">
                ${state.projects.map(viewProject).join("")}
            </ul>
      
    </div>
    <div class="options">
        <form onsubmit="app.run('add', this);return false;">
            <input class="input1" name="text" placeholder="Add project" required/>
            <button class="addButton">Add</button>
        </form>
    </div>
    `

const update = {
    add: async (state, form) => {
        console.log(state)
        const data = new FormData(form)
        const project = new Project(data.get('text'))
        console.log(project)
        const postRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        }
        state.projects.push(project)
        fetch('/projects', postRequest).then(() => app.run('getProjects'))
        
        return state
    },

    delete: (state, id) => {
        var index = 0
        var count = 0

        console.log(id)

        state.projects.forEach(project => {
            console.log(id)
            if (id == id) {
                index = count
            }
            count = count + 1
        })

        console.log(index)
        fetch(`/projects/${id}/delete`)
        state.projects.splice(index, 1)

        return state
    },

    doing: (state, project_id) => {
        var index = 0
        var count = 0

        console.log(project_id)

        state.projects.forEach(project => {
            console.log(project.project_id)
            if (project_id == project.project_id) {
                index = count
            }
            count = count + 1
        })
        /*
        if (state.projects[index].doing === "Inactive 😢") {
            state.projects[index].doing = "Active ✅"
        }
        else {
            state.projects[index].doing = "Inactive 😢"
        }*/

        return state
    },

    showEdit: (state, project_id, form) => {
        var x = document.getElementById(project_id)
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    },

    edit: async (state, project_id, form) => {
        const project = state.projects.find(project => {
           return project.project_id == project_id
        })
        const data = new FormData(form)
        project.text = data.get("text")
        console.log(project)
        const postRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        }
        fetch(`/projects/${project_id}/edit`, postRequest).then(() => app.run('getProjects'))
        return state
    },

    getProjects: async (state) => {
        state.projects = await fetch('/projects').then(res => res.json())
        
        return state
    }


}

app.start('KanbanProject', state, view, update)
app.run('getProjects')