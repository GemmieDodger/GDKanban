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
id="${task.task_id}"
draggable="true" 
onclick="app.run('done', ${task.task_id})"
ondragstart="app.run('onDragTask', event)"
class="${task.status === 0 ? '' : 'done'} task"
>${task.text} ${task.status === 1 ? `<button class="deleteButton" onclick="app.run('deleteTask', ${task.task_id})">Delete</button>` : ''} 

</li>
`
}
const viewList = list => {

    return `
           <div class="card" id="toDoList" style="width: 100%; height:100%">
                <h2 class="listHeader">${list.title}</h2>
                
        
                <ul class="taskLists"  ondragover="event.preventDefault()" ondrop="app.run('onDropTask', event)">
                    ${list.tasks.map(viewTask).join("")}
                </ul>

                ${list.title == 'To Do' ? `
                <form class="form1" onsubmit="app.run('add', this);return false;">
                    <input name="task" id="taskInput" placeholder="add a task" />
                    <input name="list_id" type="hidden" value=${list.id}> </input>
                    <button class="addButton">+ Add</button>
                </form> 
                `: ''}
            </div>
            `
}
const view = (state) =>
    `<div class="wrapper">
    <div class="lists" style="width: 80%">
       ${console.log(state.project)}
       ${console.log('lists')}
       ${console.log(state.project.lists)}
            ${state.project.lists.map(viewList).join("")}
               
    </div>

    <div class="deleteOnHover" ondragover="event.preventDefault()" ondrop="app.run('onDropDeleteTask', event)">Delete</div>


        
                </div>
`



const update = {
    add: async (state, form) => {
        const data = new FormData(form)
        const list_id = data.get('list_id')
        
        const task = new Task(data.get('task'))

        const postRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        }

        const list = state.lists.find(list => list.list_id === data.get('list_id'))
        list.tasks.push(task)
        console.log("new task")
        console.log(task) //this is right
        // console.log("to do list tasks")
        // console.log(list.tasks) //this is right
        fetch(`/projects/${project_id}/lists/${list_id}/tasks`, postRequest).then(() => app.run('getTasks', project_id, list_id))
        return state
    },

    getLists: async (state) => {

        console.log('project get lists')
        console.log(state.project) //this works     



        state.lists = await fetch(`/projects/${state.project.id}`).then(res => res.json())
        state.lists = state.lists.lists //cheating...
        
        console.log(state.lists)
        return state
    },

    deleteTask: (state, task_id) => {
        const index = state.doneTasks.findIndex(element => element.task_id === task_id)
        //fetch(`/projects/${project_id}/lists/${list_id}/delete`)
        state.doneTasks.splice(index, 1)
        return state
    },

    onDragTask: (state, event) => {
        event.dataTransfer.setData('text', event.target.task_id)
        return state
    },

    onDropTask(state, event) {
        const task_id = event.dataTransfer.getData('text')
        const list_id = state.currentList
        console.log('on drop task')
        console.log(task_id)
        console.log('on drop task list')
        console.log(list_id)
        const task = state.lists.find(task => task.task_id == task_id)
        state.lists.splice(index, 1)
        state.doingTasks.push(task)
        return state
    },

    onDropDeleteTask: (state, event) => {
        const task_id = event.dataTransfer.getData('text')
        console.log(task_id)
        const index = state.doneTasks.findIndex(task => task.task_id == task_id)
        state.doneTasks.splice(index, 1)
        return state
    },
    getTasks: async (state, project_id, list_id)  => {
        console.log('project get tasks')
        console.log(project_id, list_id)   
        state.tasks = await fetch(`/projects/${project_id}/lists/${list_id}/tasks`).then(res => res.json())
        state.tasks = state.tasks.tasks 
        console.log(state.tasks)
        return state
    },

}


app.start('projectView', state, view, update)
app.run(`getLists`)