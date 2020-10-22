

class Task {
    constructor(text, task_id) {
        this.task_id = task_id || window.crypto.getRandomValues(new Uint8Array(3)).join("")
        this.text = text
        this.status = 0
        this.users = []
    }
}
class List {
    constructor(title) {
        this.list_id = window.crypto.getRandomValues(new Uint8Array(3)).join("")
            this.title = title
            this.tasks = []
    }
}

const viewTask = task => {
    //split into a new function to show the viewing of task
    return `<li
id="${task.id}"
draggable="true" 
onclick="app.run('done', ${task.id})"
ondragstart="app.run('onDragTask', event)"
class="${task.status === 0 ? '' : 'done'} taskList"
>${task.text} ${task.status === 1 ? `
 <button onclick="app.run('deleteTask', ${task.id})">Delete</button>` : ''} 

</li>
`
}
const viewList = list => {

    return `
           <div class="card" id="toDoList" style="width: 100%; height:100%">
                <h2 class="listHeader">${list.title}</h2>
        
                    <ul class="taskLists"  ondragover="event.preventDefault()" ondrop="app.run('onDropTask', event, ${list.id})">
                        ${list.tasks.map(viewTask).join("")}
                    </ul>

                ${list.title == 'To Do' ? `
                <form class="form1" onsubmit="app.run('add', this);return false;">
                    <input name="text" id="taskInput" placeholder="add a task" />
                    
                    <button class="addButton">+ Add</button>
                </form> 
                `: ''}
            </div>
            `
}
const view = (state) =>
    `<div class="wrapper">
        <div class="lists" style="width: 80%">

                    ${state.lists.map(viewList).join("")}
                    
            </div>

    <div class="options deleteOnHover" ondragover="event.preventDefault()" ondrop="app.run('onDropDeleteTask', event)">Delete</div>


        
                </div>
`



const update = {
    add:  (state, form) => {
        const data = new FormData(form)
        const list_id = state.lists[0].id
        //LIST ID

        const task =  new Task(data.get('text'))
  
        const postRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        }
        fetch(`/projects/${state.project.id}/lists/${list_id}/tasks`, postRequest).then(() => app.run('getProject'))
        // const list = state.lists.find(list => list.list_id === data.get('list_id'))
        // list.tasks.push(task)
        // console.log("new task")
        // console.log(task) //this is right
        // // console.log("to do list tasks")
        // // console.log(list.tasks) //this is right
        // fetch(`/projects/${project_id}/lists/${list_id}/tasks`, postRequest).then(() => app.run('getTasks', project_id, list_id))
        return state
    },

    getProject: async (state) => {
        state.project = await fetch(`/projects/${state.project.id}`).then(res => res.json())
        return state
    },
    getLists: async (state) => {
        state.lists = await fetch(`/projects/${state.project.id}/lists`).then(res => res.json())
        return state
    },


    onDragTask: (state, event) => {
        event.dataTransfer.setData('text', event.target.id)

        return state
    },

    onDropTask(state, event, new_list) {


        const newList = new_list
        const project_id = state.project.id
        
        const task_id = event.dataTransfer.getData('text')
        console.log(state.lists)
         console.log(task_id)

        const listCheck = state.lists[0].tasks.find(task => task.id == task_id )
        const list2Check = state.lists[1].tasks.find(task => task.id == task_id)
        const list3Check = state.lists[2].tasks.find(task => task.id == task_id) 
        
        var list_id
        if (listCheck) { 
           list_id = state.lists[0].id
           console.log(list_id)
        }
        if (list2Check) { 
           list_id = state.lists[1].id
            console.log(list_id)
         }
         if (list3Check) { 
           list_id = state.lists[2].id
            console.log(list_id)
         }
         console.log(list_id)



        fetch(`/projects/${project_id}/lists/${list_id}/tasks/${task_id}/${newList}`).then(() => app.run('getProject'))
        return state
    },

    onDropDeleteTask: (state, event) => {
        const project_id = state.project.id
        
        const task_id = event.dataTransfer.getData('text')

        const listCheck = state.lists[0].tasks.find(task => task.id == task_id )
        const list2Check = state.lists[1].tasks.find(task => task.id == task_id)
        const list3Check = state.lists[2].tasks.find(task => task.id == task_id) 
        
        var list_id
        if (listCheck) { 
           list_id = state.lists[0].id
           console.log(list_id)
        }
        if (list2Check) { 
           list_id = state.lists[1].id
            console.log(list_id)
         }
         if (list3Check) { 
           list_id = state.lists[2].id
            console.log(list_id)
         }
         console.log(list_id)


         const task = state.lists.find(list => {
            return list_id == list.id
        })

        fetch(`/projects/${project_id}/lists/${list_id}/tasks/${task_id}/delete`)
        return state
    }
    

}


app.start('project', state, view, update)
// app.run(`getProject`)