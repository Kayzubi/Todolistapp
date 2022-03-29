const filter = document.getElementById('filter-input');
const listNameForm = document.querySelector('#list-name');
const listNameBtn = document.querySelector('.taskname-btn');
const listTitleInput = document.getElementById('list-title');
const taskList = document.querySelector('.task-list');
const completedList = document.querySelector('.completed-list');
const listTitle = document.querySelector('.Task-title');
const form = document.querySelector('#add-tasks');
const taskInput = document.querySelector('.task-input');
const clearBtn = document.querySelector('.clear-board');
const taskNumber = document.querySelector('.task-number');
const completedNumber = document.querySelector('.completed-number');




loadEventListeners();

function loadEventListeners() {
  // Load local storage
  document.addEventListener ('DOMContentLoaded', loadLocalStorage);

  // Add to do List Name
  listNameForm.addEventListener('submit', nameList);
  listNameBtn.addEventListener('click', nameList);

  //Add task to list
  form.addEventListener('submit', addTask);

  //filter task 
  filter.addEventListener('keyup', filterTasks);

  // complete or delete task
  taskList.addEventListener('click', taskRemove);

  // Clear tassk board
  clearBtn.addEventListener('click', clearTaskBoard);
}


// Load local storage on start-up
function loadLocalStorage(){
  let listName;
// Load list name
  if (localStorage.getItem('name') === null) {
    listName = '';
  } else {
    listName = localStorage.getItem('name');
  }
  listTitle.textContent = listName;

  // Load undone tasks
  let task; 

  if (localStorage.getItem('tasks') === null) {
    tasks =[];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach(function(task){
       // create a list element
       const li = document.createElement('li');
       li.className = 'task-item list-item';
       li.appendChild(document.createTextNode(task));
  
       // add links to list item
       const delLink = document.createElement('a');
       const completedLink = document.createElement('a');
  
       delLink.className ='delete-item';
       delLink.innerHTML = '<i class="far fa-times-circle"></i>';
       completedLink.className = 'complete-item';
       completedLink.innerHTML = '<i class="far fa-check-circle"></i>';
  
       li.append(completedLink, delLink);
       
       taskList.appendChild(li);
  })

  // load completed tasks
  let compTasks;

  if (localStorage.getItem('completed')=== null) {
    compTasks =[];
  } else {
    compTasks = JSON.parse(localStorage.getItem('completed'));
  }
  compTasks.forEach(function(current){

      const compLi = document.createElement('li');
      compLi.className = 'completed-item list-item';
      
      compLi.appendChild(document.createTextNode(current));

      completedList.appendChild(compLi);

  })

  countTaskNumber();
}

//NAme todo List
function nameList() {
  let listName;

  if (listTitleInput.value === ''){
    document.querySelector('.modal-error').style.display = 'block';
  } else {
    listTitle.textContent = listTitleInput.value;
    listName = listTitleInput.value;

    localStorage.setItem('name', listName);
    listTitleInput.value = '';
    document.querySelector('.btn-close').click();
    
  }

}


// Add task to list
function addTask(e) {

  if (listTitle.textContent === '') {
    // Add a list Title
    document.querySelector('.name-btn').click();
  } else {

    if(taskInput.value === '') {
      alert ('Enter a task');
    } else {
       // create a list element
     const li = document.createElement('li');
     li.className = 'task-item list-item';
     li.appendChild(document.createTextNode(taskInput.value));

     // add links to list item
     const delLink = document.createElement('a');
     const completedLink = document.createElement('a');

     delLink.className ='delete-item';
     delLink.innerHTML = '<i class="far fa-times-circle"></i>';
     completedLink.className = 'complete-item';
     completedLink.innerHTML = '<i class="far fa-check-circle"></i>';

     li.append(completedLink, delLink);
     
     taskList.appendChild(li);

     saveToLocalStorage(taskInput.value);

     taskInput.value = '';
    } 
  }

  e.preventDefault();
}

//Count task number
function countTaskNumber () {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  taskNumber.innerHTML = "(" + tasks.length + ")";

  let compTasks;

  if (localStorage.getItem('completed')=== null) {
    compTasks =[];
  } else {
    compTasks = JSON.parse(localStorage.getItem('completed'));
  }

  completedNumber.innerHTML =  "(" + compTasks.length + ")";


 
}

// save undone tasks to Local storage
function saveToLocalStorage(task){
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.push(task);

  localStorage.setItem('tasks', JSON.stringify(tasks));

  countTaskNumber();
 }

 // Filter tasks
function filterTasks() {
  const text = filter.value.toLowerCase();

  document.querySelectorAll('.list-item').forEach(function(cur) {
    const item = cur.textContent.toLowerCase();

    if(item.indexOf(text) !== -1) {
      cur.style.display = 'block';
    } else {
      cur.style.display = 'none';
    }
  })
}

// move Task to completed or delete task
function taskRemove(e) {
  
  if (e.target.parentElement.classList.contains('complete-item')) {
    const completedTask = e.target.parentElement.parentElement.textContent;

    const compLi = document.createElement('li');
    compLi.className = 'completed-item list-item';
    
    compLi.appendChild(document.createTextNode(completedTask));

    completedList.appendChild(compLi);

    storeCompleted(completedTask);
    

    e.target.parentElement.parentElement.remove();
    removeFromLS(e.target.parentElement.parentElement);
    countTaskNumber();
  } else if (e.target.parentElement.classList.contains('delete-item')) {

    if(confirm('Are you sure?')){
      e.target.parentElement.parentElement.remove();

      removeFromLS(e.target.parentElement.parentElement);
    }
   
    
  }

}


// store completed task to Local storage
function storeCompleted(completed) {
  let compTasks;

  if (localStorage.getItem('completed')=== null) {
    compTasks =[];
  } else {
    compTasks = JSON.parse(localStorage.getItem('completed'));
  }
  compTasks.push(completed);
  localStorage.setItem('completed', JSON.stringify(compTasks));
  countTaskNumber();

}


// delete task from local storage
function removeFromLS(deleted){
  let tasks;

  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach(function(current, index){

    if(deleted.textContent === current){
      tasks.splice(index, 1);
    }

  })

  localStorage.setItem('tasks',JSON.stringify(tasks));
  countTaskNumber();
}



// Clear Task board 
function clearTaskBoard() {

  if(confirm('Are you sure?')){
    listTitle.textContent = '';

    while (taskList.firstChild){
      taskList.firstChild.remove();
    }
  
    while (completedList.firstChild){
      completedList.firstChild.remove();
    }
  
    localStorage.clear();
    taskNumber.innerHTML = '(0)';
    completedNumber.innerHTML = '(0)';

  }


}