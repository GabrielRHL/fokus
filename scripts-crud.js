const addTaskBtn = document.querySelector('.app__button--add-task')
const addTaskForm = document.querySelector('.app__form-add-task')
const textArea = document.querySelector('.app__form-textarea')
const tasksUl = document.querySelector('.app__section-task-list')
const cancelFormBtn = document.querySelector('.app__form-footer__button--cancel')
const onProgress = document.querySelector('.app__section-active-task-description')
const wipeFinishedTasks = document.querySelector('#btn-remover-concluidas')
const wipeAllTasks = document.querySelector('#btn-remover-todas')
let selectedTask = null
let liSelectedTask = null
let tasks = JSON.parse(localStorage.getItem('tasks')) || []

function updateLStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function createTask(task) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')
    const svg = document.createElement('svg')
    svg.innerHTML = `
            <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
                <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
            </svg>
    `
    const p = document.createElement('p')
    p.classList.add('app__section-task-list-item-description')
    p.textContent = task.typedTask
    
    const button = document.createElement('button')
    button.classList.add('app_button-edit')
    button.onclick = () => {
        const newTask = prompt("Digite a nova tarefa")
        if (newTask) {
            p.textContent = newTask
            task.typedTask = newTask
            updateLStorage()
        }
    }

    const img = document.createElement('img')
    img.setAttribute('src', '/imagens/edit.png')

    button.append(img)
    li.append(svg)
    li.append(p)
    li.append(button)

    if (task.completed) {
        li.classList.add('app__section-task-list-item-complete')
        button.setAttribute('disabled', 'disabled')
    } else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active').forEach(element => {
                element.classList.remove('app__section-task-list-item-active')
            })
            if (selectedTask == task) {
                onProgress.textContent = ''
                selectedTask = null
                liSelectedTask = null
                return
            }
            selectedTask = task
            liSelectedTask = li
            onProgress.textContent = task.typedTask
            li.classList.add('app__section-task-list-item-active')
        }
    }
    return li
}

addTaskBtn.addEventListener('click', () => {
    addTaskForm.classList.toggle('hidden')
})

addTaskForm.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const task = {
        typedTask: textArea.value
    }
    tasks.push(task)
    const taskElement = createTask(task)
    tasksUl.append(taskElement)
    updateLStorage()
    textArea.value = ''
})

tasks.forEach(task => {
    const taskElement = createTask(task)
    tasksUl.append(taskElement)
})

cancelFormBtn.addEventListener('click', () => {
    textArea.value = ''
    addTaskForm.classList.toggle('hidden')
})

document.addEventListener('FinishedFocus', () => {
    if (selectedTask && liSelectedTask) {
        liSelectedTask.classList.remove('app__section-task-list-item-active')
        liSelectedTask.classList.add('app__section-task-list-item-complete')
        liSelectedTask.querySelector('button').setAttribute('disabled', 'disabled')
        selectedTask.completed = true
        updateLStorage()
    }
})

const wipeTasks = (onlyCompleted) => {
    const selector = onlyCompleted ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(selector).forEach(element => {
        element.remove()
    })
    tasks = onlyCompleted ? tasks.filter(task => !task.completed) : []
    updateLStorage()
}

wipeFinishedTasks.onclick = () => wipeTasks(true)
wipeAllTasks.onclick= () => wipeTasks(false)