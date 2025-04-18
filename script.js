const addBtn = document.getElementById('addTaskBtn');
const input = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');

document.addEventListener('DOMContentLoaded', loadTasks);

addBtn.addEventListener('click', () => {
  const taskText = input.value.trim();
  if (taskText === "") return;
  addTask(taskText);
  input.value = "";
  saveTasks();
});

function addTask(text, done = false) {
  const li = document.createElement('li');
  li.textContent = text;
  if (done) li.classList.add('done');

  const delBtn = document.createElement('button');
  delBtn.textContent = '❌';
  delBtn.onclick = (e) => {
    e.stopPropagation();
    li.remove();
    saveTasks();
  };

  li.ondblclick = () => {
    const currentText = li.textContent;
    const inputEdit = document.createElement('input');
    inputEdit.type = 'text';
    inputEdit.value = currentText;
    inputEdit.classList.add('editInput');

    li.innerHTML = '';
    li.appendChild(inputEdit);
    inputEdit.focus();

    const saveEdit = () => {
      const newText = inputEdit.value.trim();
      if (newText !== "") {
        li.textContent = newText;
        li.appendChild(delBtn);
        saveTasks();
      } else {
        li.remove();
        saveTasks();
      }
    };

    inputEdit.addEventListener('blur', saveEdit);
    inputEdit.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') inputEdit.blur();
    });
  };

  li.onclick = () => {
    li.classList.toggle('done');
    saveTasks();
  };

  li.appendChild(delBtn);
  taskList.appendChild(li);
}

function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll('li').forEach(li => {
    tasks.push({
      text: li.firstChild.textContent,
      done: li.classList.contains('done')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => addTask(task.text, task.done));
}

searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    const tasks = taskList.querySelectorAll('li');

    tasks.forEach(li => {
        const text = li.firstChild.textContent.toLowerCase();
        li.style.display = text.includes(filter) ? 'flex' : 'none'
    });
});