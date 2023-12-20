const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const timeDisplay = document.getElementById('time');
const taskList = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task');
const addTaskButton = document.getElementById('add-task');

let timer;
let minutes = 25;
let seconds = 0;

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);
addTaskButton.addEventListener('click', addTask);

loadTasksFromLocalStorage();
loadTimerFromLocalStorage();

function startTimer() {
    timer = setInterval(updateTimer, 1000);
    startButton.disabled = true;
}

function stopTimer() {
    clearInterval(timer);
    startButton.disabled = false;
    saveTimerToLocalStorage();
}

function resetTimer() {
    clearInterval(timer);
    minutes = 25;
    seconds = 0;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    startButton.disabled = false;
    saveTimerToLocalStorage();
}

function updateTimer() {
    if (seconds > 0) {
        seconds--;
    } else if (minutes > 0) {
        minutes--;
        seconds = 59;
    } else {
        clearInterval(timer);
        startButton.disabled = false;
    }

    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    saveTimerToLocalStorage();
}

function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText !== '') {
        const taskItem = createTaskItem(taskText);
        taskList.appendChild(taskItem);
        saveTasksToLocalStorage();
        newTaskInput.value = '';
    }
}

function createTaskItem(taskText) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');

    const taskTextElement = document.createElement('span');
    taskTextElement.classList.add('task-text');
    taskTextElement.textContent = taskText;
    taskItem.appendChild(taskTextElement);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', deleteTask);
    taskItem.appendChild(deleteButton);

    return taskItem;
}

function deleteTask(event) {
    const taskItem = event.target.closest('.task-item');
    taskItem.remove();
    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
    const tasks = Array.from(taskList.children).map(taskItem => taskItem.querySelector('.task-text').textContent);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskText => {
        const taskItem = createTaskItem(taskText);
        taskList.appendChild(taskItem);
    });
}

function saveTimerToLocalStorage() {
    localStorage.setItem('minutes', minutes);
    localStorage.setItem('seconds', seconds);
}

function loadTimerFromLocalStorage() {
    minutes = parseInt(localStorage.getItem('minutes')) || 25;
    seconds = parseInt(localStorage.getItem('seconds')) || 0;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}