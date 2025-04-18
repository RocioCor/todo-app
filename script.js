const addBtn = document.getElementById('addTaskBtn');
const input = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');

document.addEventListener('DOMContentLoaded', loadTasks);

addBtn.addEventListener('click', () => {
  const taskText = input.value.trim();
  const priority = prioritySelect.value;

  if (taskText === "") return;

  addTask(taskText, false, priority);
  input.value = "";
  prioritySelect.value = 'low';
  saveTasks();
});

function addTask(text, done = false, priority = 'low') {
  const li = document.createElement('li');
  if (done) li.classList.add('done');
  li.classList.add(`priority-${priority}`); // ← clase para darle color según prioridad

  const spanText = document.createElement('span');
  spanText.textContent = text;
  li.appendChild(spanText);

  const delBtn = document.createElement('button');
  delBtn.textContent = '❌';
  delBtn.onclick = (e) => {
    e.stopPropagation();
    li.remove();
    saveTasks();
  };

  li.ondblclick = () => {
    const inputEdit = document.createElement('input');
    inputEdit.type = 'text';
    inputEdit.value = spanText.textContent;
    inputEdit.classList.add('editInput');

    li.replaceChild(inputEdit, spanText);
    inputEdit.focus();

    const saveEdit = () => {
      const newText = inputEdit.value.trim();
      if (newText !== "") {
        spanText.textContent = newText;
        li.replaceChild(spanText, inputEdit);
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
    const span = li.querySelector('span');
    const priority = li.classList.contains('priority-high') ? 'high' :
                     li.classList.contains('priority-medium') ? 'medium' : 'low';

    tasks.push({
      text: span.textContent,
      done: li.classList.contains('done'),
      priority: priority
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => addTask(task.text, task.done, task.priority));
}

searchInput.addEventListener('input', () => {
  const filter = searchInput.value.toLowerCase();
  const tasks = taskList.querySelectorAll('li');

  tasks.forEach(li => {
    const text = li.querySelector('span').textContent.toLowerCase();
    li.style.display = text.includes(filter) ? 'flex' : 'none';
  });
});
