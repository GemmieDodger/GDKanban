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

    return `<li
        id="${task.id}"
        draggable="true" 
        
        ondragstart="app.run('onDragTask', event)"
        class=" taskList"
        >${task.text} 

</li>
`
}

// //</br> 
// <button class="classOption" ondragover="event.preventDefault()" id="${task.id}" onclick="app.run('switchPriority', event, ${task.id}, ${task.status})">
// ${task.status === true ? `⭐️` : `🙂 `}
// </button> 

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
        <div class="lists" ">

                    ${state.lists.map(viewList).join("")}
                    
            </div>

    <div class="options deleteOnHover" ondragover="event.preventDefault()" ondrop="app.run('onDropDeleteTask', event)">Delete</div>
    </div>
`



const update = {
    add: (state, form) => {
        const data = new FormData(form)
        const list_id = state.lists[0].id
        //LIST ID

        const task = new Task(data.get('text'))

        const postRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        }
        fetch(`/projects/${state.project.id}/lists/${list_id}/tasks`, postRequest).then(() => app.run('getLists'))

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

        const listCheck = state.lists[0].tasks.find(task => task.id == task_id)
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



        fetch(`/projects/${project_id}/lists/${list_id}/tasks/${task_id}/${newList}`).then(() => app.run('getLists'))
        return state
    },

    onDropDeleteTask: (state, event) => {
        const project_id = state.project.id

        const task_id = event.dataTransfer.getData('text')

        const listCheck = state.lists[0].tasks.find(task => task.id == task_id)
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

        fetch(`/projects/${project_id}/lists/${list_id}/tasks/${task_id}/delete`).then(() => app.run('getLists'))
        return state
    },
    switchPriority: async (state, event, task_id, task_status) => {
        event.stopPropagation()
        const project_id = state.project.id
       
        console.log('original task status')
        console.log(task_status)

        const listCheck = await state.lists[0].tasks.find(task => task.id == task_id)
        const list2Check = await state.lists[1].tasks.find(task => task.id == task_id)
        const list3Check = await state.lists[2].tasks.find(task => task.id == task_id)

        var list_id
        if (listCheck) {
            list_id = state.lists[0].id
 
        }
        if (list2Check) {
            list_id = state.lists[1].id
       
        }
        if (list3Check) {
            list_id = state.lists[2].id

        }

        var priority
        if (task_status == false) {
            task_status = 1
        } else {
            task_status = 0
        }
        console.log('task id')
        console.log(task_id)
        console.log('task status')
        console.log(task_status)
        await fetch(`/projects/${project_id}/lists/${list_id}/tasks/${task_id}/${task_status}`).then(() => app.run('getLists'))
        return state

    }
   

}


app.start('project', state, view, update)