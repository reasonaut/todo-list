import { PubSub } from "./pubSub";
import { projectManager } from "./projectManager";
import { pageBuild } from "./index.js";

const toDoManager = (function() {
    PubSub.subscribe('addToDo', addToDo);
    PubSub.subscribe('checkboxStateChange', updateToDoCheckedState);
    PubSub.subscribe('toDoRowDblClick', editToDo);
    
    function newToDo(data) {
        let toDo = {};
        toDo.description = data.description;
        toDo.priority = data.priority;
        toDo.dueDate = data.dueDate;
        toDo.isComplete = data.isComplete;
        return toDo;
    }
    function addToDo(eventData) {
        const formData = pageBuild.getToDoFormData();
        projectManager.currentProject = projectManager.getCurrentProject();
        if (!projectManager.currentProject)
            return;
        if (formData.description === '' || formData.priority === '' || formData.dueDate === '')
            return;
        const toDo = newToDo(formData);
        // associate with project
        projectManager.projects[projectManager.currentProject.name].toDos.push(toDo);
        const toDoIndex = projectManager.projects[projectManager.currentProject.name].toDos.length - 1;
        // add to view
        pageBuild.addToDoToTable(toDo, toDoIndex);
        // save state
        projectManager.saveAppState(projectManager.projects);
    }
    function updateToDoCheckedState(eventData) {
        const currentProject = projectManager.getCurrentProject();
        const toDoIndex = parseInt(eventData.target.parentElement.parentElement.getAttribute('data-index'));
        if (eventData.target.checked) {
            projectManager.projects[currentProject.name].toDos[toDoIndex].isComplete = true;
        } else {
            projectManager.projects[currentProject.name].toDos[toDoIndex].isComplete = false;
        }
        // save state
        projectManager.saveAppState(projectManager.projects);
    }
    function editToDo(eventData) {
        const index = parseInt(eventData.currentTarget.getAttribute('data-index'));
        const currentEdit = document.getElementById('saveDeleteInputRow');
        if (!currentEdit) pageBuild.changeToDoRowEditor(index);
    }
    function updateToDo(toDo, index) {
        projectManager.projects[projectManager.getCurrentProject().name].toDos.splice(index, 1, toDo);
        projectManager.saveAppState(projectManager.projects);
    }
    function removeToDo(index) {
        projectManager.projects[projectManager.getCurrentProject().name].toDos.splice(index, 1);
        projectManager.saveAppState(projectManager.projects);
    }

    return { newToDo, updateToDo, removeToDo };
}());

export { toDoManager };