const addBtn = document.getElementById('addTaskBtn');
const input = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterPriority');

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateCounters();
  });
addBtn.addEventListener('click', () => {
  const dueDate = document.getElementById('dueDate').value;
  const taskText = input.value.trim();
  const priority = prioritySelect.value;
  
  if (taskText === "") return;
  const createdAt = new Date();
  addTask(taskText, false, priority, createdAt, dueDate)
  input.value = "";
  prioritySelect.value = 'low';
  saveTasks();
  updateCounters();
});

function addTask(text, done = false, priority = 'low', createdAt = new Date(), dueDate = null) {
  const li = document.createElement('li');
  li.dataset.createdAt = createdAt;
  li.dataset.dueDate = dueDate;
  if (done) li.classList.add('done');
  li.classList.add(`priority-${priority}`);

  const spanText = document.createElement('span');
  spanText.textContent = text;
  li.appendChild(spanText);
  //mostrar fecha y hora de creacion
  const dateP = document.createElement('p');
  const fecha = new Date(createdAt);
  dateP.textContent = `Creado: ${fecha.toLocaleDateString()}-${fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  dateP.classList.add('fechaTarea');
  li.appendChild(dateP);

  //mostrar feca y hora de vencimiento
  if (dueDate) {
    const due = new Date(dueDate);
    const dueP = document.createElement('p');
    dueP.textContent = `Vence: ${due.toLocaleDateString()} - ${due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    dueP.classList.add('fechaVencimiento');
    //muestra si ya vencio la tarea
    if (new Date() > due && !done) {
      dueP.style.color = 'red';
      dueP.style.fontWeight = 'bold';
    }
    li.appendChild(dueP);
  }

  const delBtn = document.createElement('button');
  delBtn.textContent = '❌';
  delBtn.onclick = (e) => {
    e.stopPropagation();
    li.remove();
    saveTasks();
    updateCounters();
    li.appendChild(delBtn);
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
        updateCounters();
      } else {
        li.remove();
        saveTasks();
        updateCounters();
      }
    };

    inputEdit.addEventListener('blur', saveEdit);
    inputEdit.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') inputEdit.blur();
    });
  };

  //para marcar realizada la tarea
  li.onclick = () => {
    li.classList.toggle('done');
    saveTasks();
    updateCounters();
  };

  li.appendChild(delBtn);
  taskList.appendChild(li);
  updateCounters();
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
      priority: priority,
      createdAt: li.dataset.createdAt,// se guarda como tributo.
      dueDate: li.dataset.dueDate || null
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    addTask(task.text, task.done, task.priority, task.createdAt, task.dueDate);
  });
}


searchInput.addEventListener('input', () => {
  const filter = searchInput.value.toLowerCase();
  const tasks = taskList.querySelectorAll('li');

  tasks.forEach(li => {
    const text = li.querySelector('span').textContent.toLowerCase();
    li.style.display = text.includes(filter) ? 'flex' : 'none';
  });
});

filterSelect.addEventListener('change', () => {
  const selected = filterSelect.value;
  const tasks = taskList.querySelectorAll('li');

  tasks.forEach(li => {
    const hasClass = li.classList.contains(`priority-${selected}`);
    li.style.display = (selected === 'all' || hasClass) ? 'flex' : 'none';
  });
});

// ✅ Nueva función: actualizar contadores
function updateCounters() {
  const tasks = taskList.querySelectorAll('li');
  const total = tasks.length;
  const done = [...tasks].filter(li => li.classList.contains('done')).length;
  const pending = total - done;

  document.getElementById('totalCount').textContent = total;
  document.getElementById('doneCount').textContent = done;
  document.getElementById('pendingCount').textContent = pending;
}
