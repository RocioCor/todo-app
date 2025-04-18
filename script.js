const addBtn = document.getElementById ('addTaskBtn');
const input = document.getElementById ('taskInput');
const taskList = document.getElementById ('taskList');
document.addEventListener('DOMContentLoaded, loadTasks');
addBtn.assEvenListener ('click', ()=> {
    const taskText = input.value.trim();
    if (taskText ==="") return;
    addTask(taskText);
    input.value = "";
    saveTasks();
});
    function addTask(text, done = false) {
        const li = document.createElement ('li');
        li.textContent = text;
        if (done) li.classList.add ('done');
    }
    const delBtn = document.createElement('button');
    delBtn.textContent = '❌'; 
    delBtn.onclick = () => {
        li.remove();
        saveTasks();
    };
    li.onclick = () => {
        li.classList.toggle('done');
        saveTasks();
    };
    li.appendChild(delBtn);
    taskList.appendChild(li);
  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.firstChild.textContent,
            done: li.classList.contains('done')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks))
  } ;
  function loadTasks() {
    const tasks = JSON.parse(localStorage,getItem('tasks')) 
    || [];
    tasks.forEach(task => addTask(task.text, task.done));
  }
    