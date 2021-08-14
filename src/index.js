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
    const isCompleteColumn = document.createElement('th');
    isCompleteColumn.innerText = 'Status';
    const toDoDescriptionColumn = document.createElement('th');
    toDoDescriptionColumn.id = 'toDoColumn';
    toDoDescriptionColumn.innerText = 'ToDo';
    const toDoPriorityColumn = document.createElement('th');
    toDoPriorityColumn.innerText = 'Priority';
    const toDoDueDateColumn = document.createElement('th');
    toDoDueDateColumn.innerText = 'Due Date';
    toDoListHeader.appendChild(isCompleteColumn);
    toDoListHeader.appendChild(toDoDescriptionColumn);
    toDoListHeader.appendChild(toDoPriorityColumn);
    toDoListHeader.appendChild(toDoDueDateColumn);
    // create toDo input fields
    const toDoListInput = document.createElement('tr');
    document.querySelector('#toDoList table').appendChild(toDoListInput);
    // toDo status
    const toDostatusInput = document.createElement('td');
    toDostatusInput.id = 'toDoStatusInput';
    const toDoStatusInputCheckbox = document.createElement('input');
    toDoStatusInputCheckbox.type = 'checkbox';
    toDostatusInput.appendChild(toDoStatusInputCheckbox);
    toDoListInput.appendChild(toDostatusInput);
    // toDo description
    const toDoDescriptionInput = document.createElement('td');
    toDoDescriptionInput.id = 'toDoNameInput';
    const toDoDescriptionInputTextField = document.createElement('input');
    toDoDescriptionInputTextField.type = 'text';
    toDoDescriptionInput.appendChild(toDoDescriptionInputTextField);
    toDoListInput.appendChild(toDoDescriptionInput);
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
    const addToDoRow = document.createElement('tr');
    addToDoButton.id = 'addToDoButton';
    addToDoButton.innerText = 'Add ToDo';
    addToDoRow.appendChild(addToDoButton);
    document.querySelector('#toDoList table').appendChild(addToDoRow);
    addToDoButton.addEventListener('click', function(eventData){
        PubSub.publish('addToDo', eventData);        
    });
    // check local storage for saved state and read in data
    const storedProjects = JSON.parse(localStorage.getItem('projectData'));
    if (storedProjects) {
        projectManager.projects = storedProjects;
        // populate project listing
        for (let project in projectManager.projects) {
            if (!projectManager.projects.hasOwnProperty(project)) continue;
            addProject(project);
        }
    }

    function getToDoFormData() {
        const isComplete = document.querySelector('#toDoStatusInput input').checked;
        const description = document.querySelector('#toDoNameInput input').value;
        const priority = document.querySelector('#toDoPriorityInput select').value;
        const dueDate = document.querySelector('#toDoDueDateInput input').value;
        return { isComplete, description, priority, dueDate };
    }
    function clearToDoFormData() {
        document.querySelector('#toDoNameInput input').value = '';
        document.querySelector('#toDoPriorityInput select').value = '';
        document.querySelector('#toDoDueDateInput input').value = '';
    }
    

    function addProject(project) {
        const newProjectLi = document.createElement('li');
        const newProjectButton = document.createElement('button');
        newProjectButton.innerText = project;
        newProjectButton.addEventListener('click', function(eventData) {
            PubSub.publish('projectSelect', eventData);
        })
        document.querySelector('#projectList ul').appendChild(newProjectLi);
        newProjectLi.appendChild(newProjectButton);
        projectManager.currentProject = project;
        // list new project as selected project in banner
        selectedProject.innerText = project;
        // clear previous projects toDos
        clearToDos();
    }
    function clearToDos() {
        if (document.querySelectorAll('.toDoItem'))
            document.querySelectorAll('.toDoItem').forEach(toDo => {
                toDo.remove();
            });
    }
    function displayProjectToDos(currentProject) {
        clearToDos();
        selectedProject.innerText = currentProject.name;
        let i = 0;
        currentProject.toDos.forEach(toDo => {
            addToDoToTable(toDo, i);
            i++;
        });        
    }
    function addToDoToTable(toDo, toDoindex) {
        const newRow = document.createElement('tr');
        newRow.classList.add('toDoItem');
        newRow.setAttribute('data-index', toDoindex);
        newRow.addEventListener('dblclick', function(eventData) {
            PubSub.publish('toDoRowDblClick', eventData);
        });
        const status = document.createElement('td');
        const statusInput = document.createElement('input');
        statusInput.type = 'checkbox';
        statusInput.addEventListener('change', (eventData) => {
            PubSub.publish('checkboxStateChange', eventData);
        })
        status.appendChild(statusInput);
        const description = document.createElement('td');
        const priority = document.createElement('td');
        const dueDate = document.createElement('td');
        

        statusInput.checked = toDo.isComplete ? true : false;
        description.innerText = toDo.description;
        priority.innerText = toDo.priority;
        dueDate.innerText = toDo.dueDate;
        newRow.appendChild(status);
        newRow.appendChild(description);
        newRow.appendChild(priority);
        newRow.appendChild(dueDate);
        document.querySelector('#toDoList table').appendChild(newRow);
        // clear toDo form
        clearToDoFormData();
    }
    function changeToDoRowEditor(toDoIndex){
        const toDoRow = document.querySelector(`[data-index='${toDoIndex}'`);
        toDoRow.style.backgroundColor = 'white';
        // clone data inputs and make row data data editable
        const toDoStatusEdit = toDostatusInput.cloneNode(true);
        toDoStatusEdit.id = 'toDoStatusEdit';
        toDoStatusEdit.querySelector('input[type="checkbox"]').checked = toDoRow.querySelector('input[type="checkbox"]').checked;
        const toDoDescriptionEdit = toDoDescriptionInput.cloneNode(true);
        toDoDescriptionEdit.id = 'toDoDescriptionEdit';
        toDoDescriptionEdit.querySelector('input[type="text"]').value = toDoRow.querySelector('td:nth-child(2)').innerText;
        const toDoPriorityEdit = toDoPriorityInput.cloneNode(true);
        toDoPriorityEdit.id = 'toDoPriorityEdit';
        toDoPriorityEdit.querySelector('select').value = toDoRow.querySelector('td:nth-child(3)').innerText;
        const toDoDueDateEdit = toDoDueDateInput.cloneNode(true);
        toDoDueDateEdit.id = 'toDoDueDateEdit';
        toDoDueDateEdit.querySelector('input[type="date"]').value = toDoRow.querySelector('td:nth-child(4)').innerText;
        const editableToDoRow = document.createElement('tr');
        editableToDoRow.appendChild(toDoStatusEdit);
        editableToDoRow.appendChild(toDoDescriptionEdit);
        editableToDoRow.appendChild(toDoPriorityEdit);
        editableToDoRow.appendChild(toDoDueDateEdit);
        // insert row for save/delete controls
        const saveDeleteInputRow = document.createElement('tr');
        saveDeleteInputRow.id = 'saveDeleteInputRow';
        const saveToDoButton = document.createElement('button');
        saveToDoButton.innerText = 'Save';
        const saveTd = document.createElement('td');
        saveTd.appendChild(saveToDoButton);
        const deleteToDoButton = document.createElement('button');
        deleteToDoButton.innerText = 'Delete';
        const delTd = document.createElement('td');
        delTd.appendChild(deleteToDoButton);
        saveDeleteInputRow.appendChild(saveTd);
        saveDeleteInputRow.appendChild(delTd);
        toDoRow.insertAdjacentElement('afterend', saveDeleteInputRow);
        saveToDoButton.addEventListener('click', () => {
            const updatedToDoRow = document.createElement('tr');
            updatedToDoRow.classList.add('toDoItem');
            updatedToDoRow.setAttribute('data-index', toDoIndex);
            updatedToDoRow.addEventListener('dblclick', function(eventData) {
                PubSub.publish('toDoRowDblClick', eventData);
            });
            const updatedStatus =  toDoStatusEdit.cloneNode(true);
            const updatedDescription = document.createElement('td');
            updatedDescription.innerText = editableToDoRow.querySelector('td:nth-child(2) input').value;
            const updatedPriority = document.createElement('td');
            updatedPriority.innerText = editableToDoRow.querySelector('td:nth-child(3) select').value;
            const updatedDueDate = document.createElement('td');
            updatedDueDate.innerText = editableToDoRow.querySelector('td:nth-child(4) input').value;
            updatedToDoRow.appendChild(updatedStatus);
            updatedToDoRow.appendChild(updatedDescription);
            updatedToDoRow.appendChild(updatedPriority);
            updatedToDoRow.appendChild(updatedDueDate);
            let revisedToDo = {};
            revisedToDo.isComplete = updatedStatus.querySelector('input').checked;
            revisedToDo.description = updatedDescription.value;
            revisedToDo.priority = updatedPriority.value;
            revisedToDo.dueDate = updatedDueDate.value;
            toDoManager.updateToDo(revisedToDo, toDoIndex);
            document.querySelector('#toDoList table').replaceChild(updatedToDoRow, editableToDoRow);
            saveDeleteInputRow.remove();
        });
        deleteToDoButton.addEventListener('click', () => {
            
        });
        // replace data row with editable row
        document.querySelector('#toDoList table').replaceChild(editableToDoRow, toDoRow);        
    }
    
    return { addProject, displayProjectToDos, getToDoFormData, addToDoToTable, changeToDoRowEditor };
}());
export { pageBuild };
