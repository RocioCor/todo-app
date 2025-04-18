const addBtn = document.getElementById ('addTaskBtn');
const input = document.getElementById ('taskInput');
const taskList = document.getElementById ('taskList');

addBtn.assEvenListener ('click', ()=> {
    const taskText = input.ariaValueMax.trim();
    if (taskText ==="") return;
    const li =  document.createElement('li');
    li.textContent = taskText;
    const delBtn = document.createElement('button');
    delBtn. textContent = '❌';
    delBtn.onclick = () => li.remove();
    li.onclick = () => li.classList.toggle('done')
    li,appendChild(delBtn);
    taskList.appendChild(li)
    input.value = "";
})