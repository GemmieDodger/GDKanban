class Project {
    constructor(text) {
        this.project_id = window.crypto.getRandomValues(new Uint8Array(3)).join("")
        this.text = text
        this.lists = []
    }
}



const viewProject = project => {

    return `<li
    id="${project.text}"
    class="projectCard vertical-center" 
    onmouseover="app.run('colourIn',${project.text})" "onmouseout="app.run('colourOut',${project.text})"
    >${project.text} </br>
        <button class="classOption" onclick="event.preventDefault(); app.run('delete', ${project.id})">❌</button> </br>
        <form onsubmit="app.run('edit', ${project.id}, this ); return false" >
            <input class="input2" name="text" placeholder="Edit title here" required>
            <button class="classOption" >✅</button>
        </form>
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
    add: (state, form) => {
        
        const data = new FormData(form)
        const project = new Project(data.get('text'))
        
        const postRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        }
       
        fetch('/projects', postRequest).then(() => app.run('getProjects'))
        
        return state
    },

    delete: async (state, project_id) => {
             
        const index = state.projects.findIndex(project => {
            return project.id == project_id
         })
         console.log(index)
         console.log(project_id)
         state.projects.splice(index, 1)
                 
        await fetch(`/projects/${project_id}/delete`)

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

    // showEdit: (state, project_id) => {
    //     var x = document.getElementById(project_id)
    //     if (x.style.display === "none") {
    //         x.style.display = "block";
            
    //     } else {
    //         x.style.display = "none";
    //     }
    // },

    edit: async (state, project_id, form) => {
        
        const project = state.projects.find(project => {
           return project.id == project_id
        })
        console.log('check')
        console.log(project)
        console.log(project.text)
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
    },

    colourIn: (state, project_text) => {
        var x = document.getElementById(project_text);
        x.style.backgroundColor = 'grey';
        return state
    },

    colourOut: (state, project_text) => {
        var x = document.getElementById(project_text);
        x.style.backgroundColor = 'rgba(46, 42, 42, 0.671)';
        return state
    }


}

app.start('KanbanProject', state, view, update)
app.run('getProjects')