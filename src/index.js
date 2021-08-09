import './style.css';
import { PubSub } from './pubSub';
import { projectManager } from './projectManager';
import { toDoManager } from './toDoManager';


const pageBuild = (function(){
    const body = document.getElementById('content');
    // create page banner
    const banner = document.createElement('div');
    banner.id = 'banner';
    body.appendChild(banner);
    const selectedProject = document.createElement('h2');
    banner.appendChild(selectedProject);
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
    // create table headers
    const toDoListHeader = document.createElement('tr');
    document.querySelector('#toDoList table').appendChild(toDoListHeader);
    const toDoNameColumn = document.createElement('th');
    toDoNameColumn.id = 'toDoColumn';
    toDoNameColumn.innerText = 'ToDo';
    const toDoPriorityColumn = document.createElement('th');
    toDoPriorityColumn.innerText = 'Priority';
    const toDoDueDateColumn = document.createElement('th');
    toDoDueDateColumn.innerText = 'Due Date';
    toDoListHeader.appendChild(toDoNameColumn);
    toDoListHeader.appendChild(toDoPriorityColumn);
    toDoListHeader.appendChild(toDoDueDateColumn);
    // create toDo input fields
    const toDoListInput = document.createElement('tr');
    document.querySelector('#toDoList table').appendChild(toDoListInput);
    // toDo name
    const toDoNameInput = document.createElement('td');
    toDoNameInput.id = 'toDoNameInput';
    toDoNameInput.appendChild(document.createElement('input'));
    toDoListInput.appendChild(toDoNameInput);
    document.querySelector('#toDoNameInput input').setAttribute('size', '45');
    // toDo priority
    const toDoPriorityInput = document.createElement('td');
    toDoPriorityInput.id = 'toDoPriorityInput';
    const prioritySelector = document.createElement('select')
    prioritySelector.name = 'priority-selector';
    const priorityPromptOption = document.createElement('option')
    priorityPromptOption.value = '';
    priorityPromptOption.innerText = '--select a priority--';
    const highPriorityOption = document.createElement('option');
    highPriorityOption.value = 'high'
    highPriorityOption.innerText = 'high';
    const mediumPriorityOption = document.createElement('option');
    mediumPriorityOption.value = 'medium'
    mediumPriorityOption.innerText = 'medium';
    const lowPriorityOption = document.createElement('option');
    lowPriorityOption.value = 'low';
    lowPriorityOption.innerText = 'low';
    toDoListInput.appendChild(toDoPriorityInput);
    toDoPriorityInput.appendChild(prioritySelector);
    prioritySelector.appendChild(priorityPromptOption);
    prioritySelector.appendChild(highPriorityOption);
    prioritySelector.appendChild(mediumPriorityOption);
    prioritySelector.appendChild(lowPriorityOption);
    // toDo due date
    const toDoDueDateInput = document.createElement('td');
    toDoDueDateInput.id = 'toDoDueDateInput';
    const toDoDatePicker = document.createElement('input');
    toDoDatePicker.type = 'date';
    toDoDatePicker.name = 'to-do-date-picker';
    toDoDueDateInput.appendChild(toDoDatePicker);
    toDoListInput.appendChild(toDoDueDateInput);


    // add toDo button
    const addToDoButton = document.createElement('button');
    addToDoButton.innerText = 'Add ToDo';
    toDoList.appendChild(addToDoButton);
    addToDoButton.addEventListener('click', function(eventData){
        PubSub.publish('addToDo', eventData);        
    });
    function getToDoFormData() {
        const description = document.querySelector('#toDoNameInput input').value;
        const priority = document.querySelector('#toDoPriorityInput select').value;
        const dueDate = document.querySelector('#toDoDueDateInput input').value;
        return { description, priority, dueDate };
    }
    

    function addProject(projectName) {
        const newProjectLi = document.createElement('li');
        const newProjectButton = document.createElement('button');
        newProjectButton.innerText = projectName;
        newProjectButton.addEventListener('click', function(eventData) {
            PubSub.publish('projectSelect', eventData);
        })
        document.querySelector('#projectList ul').appendChild(newProjectLi);
        newProjectLi.appendChild(newProjectButton);
        projectManager.currentProject = projectName;
        // list new project as selected project in banner
        selectedProject.innerText = projectName;
        // clear previous projects todos
        // document.querySelector('tr .toDoItem').remove();

    }
    function displayProjectToDos(todos) {
        
    }
    
    return { addProject, getToDoFormData };
}());
export { pageBuild };
