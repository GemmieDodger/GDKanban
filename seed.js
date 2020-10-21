const { Project, List, Task, sequelize } = require('./models')
const data = [
    {   "project_id": '1',
    "text": "Chores",
    "lists": [
        {   "list_id": '1',
            "title": "To Do",
            "tasks": [
                {   "task_id": '1',
                    "text": "Cook dinner",
                    "status": 0,
                    "users": [{
                        "user_id": '1',
                        "name": 'Dev',
                        "image": '/public/images/dino1.png'
                    },
                    {
                        "user_id": '2',
                        "name": 'Ben',
                        "image": '/public/images/dino2.png'
                    }
                ]
                },
                {   "task_id": '2',
                    "text": "Paint",
                    "status": 0,
                    "users": []
                },
                {   "task_id": '3',
                    "text": "Eat",
                    "status": 0,
                    "users": []
                }
            ]
        },
        {   "list_id": '2',
            "title": "Doing",
            "tasks": [
                {   "task_id": '4',
                    "text": "Sort out clothes",
                    "status": 0,
                    "users": []
                },
                {   "task_id": '4',
                    "text": "washing",
                    "status": 0,
                    "users": []
                },
                {   "task_id": '5',
                    "text": "washing up",
                    "status": 0,
                    "users": []
                }
            ]
        },
        {   "list_id": '3',
            "title": "Done",
            "tasks": [
                {   "task_id": '6',
                    "text": "HW",
                    "status": 0,
                    "users": []
                },
                {   "task_id": '7',
                    "text": "dancing",
                    "status": 0,
                    "users": []
                }
            ]
        }
    ]
},
{   "project_id": '2',
    "text": "DIY",
    "lists": [
        {   "list_id": '4',
            "title": "To Do",
            "tasks": [
                {   "task_id": '7',
                    "text": "Cook dinner",
                    "status": 0,
                    "users": []
                },
                {   "task_id": '8',
                    "text": "Paint",
                    "status": 0,
                    "users": []
                },
                {"task_id": '9',
                    "text": "Eat",
                    "status": 0,
                    "users": []
                }
            ]
        },
        {   "list_id": '5',
            "title": "Doing",
            "tasks": [
                {   "task_id": '10',
                    "text": "Sort out clothes",
                    "status": 0,
                    "users": []
                },
                {   "task_id": '11',
                    "text": "washing",
                    "status": 0,
                    "users": []
                },
                {   "task_id": '12',
                    "text": "washing up",
                    "status": 0,
                    "users": []
                }
            ]
        },
        {   "list_id": '6',
            "title": "Done",
            "tasks": [
                {   "task_id": '13',
                    "text": "HW",
                    "status": 1,
                    "users": []
                },
                {   "task_id": '14',
                    "text": "dancing",
                    "status": 1,
                    "users": []
                }
            ]
        }
    ]
},
{   "project_id": '3',
    "text": "Lessons",
    "lists": [
        {   "list_id": '7',
            "title": "To Do",
            "tasks": [
                {   "task_id": '15',
                    "text": "Math",
                    "status": 0,
                    "users": []
                },
                {   "task_id": '16',
                    "text": "English",
                    "status": 0,
                    "users": []
                },
                {   "task_id": '17',
                    "text": "Science",
                    "status": 0,
                    "users": []
                }
            ]
        },
        {   "list_id": '8',
            "title": "Doing",
            "tasks": [
                {   "task_id": '18',
                    "text": "English",
                    "status": 0,
                    "users": []
                },
                {   "task_id": '19',
                    "text": "German",
                    "status": 0,
                    "users": []
                },
                {   "task_id": '20',
                    "text": "Art",
                    "status": 0,
                    "users": []
                }
            ]
        },
        {   "list_id": '9',
            "title": "Done",
            "tasks": [
                {   "task_id": '21',
                    "text": "Tech",
                    "status": 1,
                    "users": []
                },
                {   "task_id": '22',
                    "text": "Drama",
                    "status": 1,
                    "users": []
                }
            ]
        }
    ]
},
{   "project_id": '4',
    "text": "Happiness",
    "lists": [
        {   "list_id": '10',
            "title": "To Do",
            "tasks": [
                {   "task_id": '23',
                    "text": "Sleep",
                    "status": 0,
                    "users": []
                },
                {   "task_id": '24',
                    "text": "Paint",
                    "status": 0,
                    "users": []
                },
                {   "task_id": '25',
                    "text": "Eat",
                    "status": 0,
                    "users": []
                }
            ]
        },
        {   "list_id": '11',
            "title": "Doing",
            "tasks": [
                {   "task_id": '26',
                    "text": "Yoga",
                    "status": 0,
                    "users": []
                },
                {   "task_id": '27',
                    "text": "Run",
                    "status": 0,
                    "users": []
                },
                {   "task_id": '28',
                    "text": "Sewing",
                    "status": 0,
                    "users": []
                }
            ]
        },
        {   "list_id": '12',
            "title": "Done",
            "tasks": [
                {   "task_id": '29',
                    "text": "Drawing",
                    "status": 1,
                    "users": []
                },
                {   "task_id": '30',
                    "text": "Baking",
                    "status": 1,
                    "users": []
                }
            ]
        }
    ]
}
]
sequelize.sync().then(async () => {
    const taskQueue = data.map(async (_project) => {
            const project = await Project.create({text: _project.text})
            const lists = await Promise.all(_project.lists.map(async (_list) => {
                const list = await List.create({title: _list.title})
                const tasks = await Promise.all(_list.tasks.map(({text, status}) => Task.create({text, status})))

                return list.setTasks(tasks)
            }))
            return await project.setLists(lists)
        })
    await Promise.all(taskQueue).then(projects => {
        console.log(JSON.stringify(projects, null, 2))
    }).catch(console.error)
})