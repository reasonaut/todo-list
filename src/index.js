import './style.css';
import { PubSub } from './pubSub';
import { projectManager } from './projectManager';


const pageBuild = (function(){
    const body = document.getElementById('content');
    // create page banner
    const banner = document.createElement('div');
    banner.id = 'banner';
    banner.innerText = 'Project ToDos';
    body.appendChild(banner);
    // create main content div
    const mainPage = document.createElement('div');
    mainPage.id = 'mainPage';
    body.appendChild(mainPage);
    // create project list
    const projectList = document.createElement('div');
    projectList.id = 'projectList';
    mainPage.appendChild(projectList);
    projectList.appendChild(document.createElement('ul'));
    document.querySelector('#projectList ul').appendChild(document.createElement('li'));
    const projectListHeader = document.createElement('h2')
    projectListHeader.innerText = 'Project List';
    document.querySelector('#projectList li').appendChild(projectListHeader);
    const addNewProjectButton = document.createElement('button');
    addNewProjectButton.innerText = 'New Project';
    addNewProjectButton.addEventListener('click', function(eventData) {
        PubSub.publish('addProject', eventData);
    });
    projectListHeader.appendChild(addNewProjectButton);

    // create todo table
    const toDoList = document.createElement('div');
    toDoList.id = 'toDoList';
    mainPage.appendChild(toDoList);
    toDoList.appendChild(document.createElement('table'));
    const todoListHeader = document.createElement('tr');
    document.querySelector('#toDoList table').appendChild(todoListHeader);
    const todoNameColumn = document.createElement('th');
    todoNameColumn.id = 'toDoColumn';
    todoNameColumn.innerText = 'ToDo';
    const todoPriorityColumn = document.createElement('th');
    todoPriorityColumn.innerText = 'Priority';
    const todoDueDateColumn = document.createElement('th');
    todoDueDateColumn.innerText = 'Due Date';
    todoListHeader.appendChild(todoNameColumn);
    todoListHeader.appendChild(todoPriorityColumn);
    todoListHeader.appendChild(todoDueDateColumn);
    

    function addProject(projectName) {
        const newProjectLi = document.createElement('li');
        const newProjectButton = document.createElement('button');
        newProjectButton.innerText = projectName;
        newProjectButton.addEventListener('click', function(eventData) {
            PubSub.publish('projectSelect', eventData);
        })
        document.querySelector('#projectList ul').appendChild(newProjectLi);
        newProjectLi.appendChild(newProjectButton);
    }
    function displayProjectToDos(todos) {
        
    }
    
    return { addProject };
}());
export { pageBuild };
