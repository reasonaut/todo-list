import { PubSub } from "./pubSub";
import { projectManager } from "./projectManager";
import { pageBuild } from "./index.js";

const toDoManager = (function() {
    PubSub.subscribe('addToDo', addToDo);
    PubSub.subscribe('checkboxStateChange', updateToDoCheckedState) 
    function newToDo(data) {
        // if (!projectManager.currentProject) return;
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
        console.log(projectManager.projects);
        // save state
        projectManager.saveAppState(projectManager.projects);
    }

    return { newToDo };
}());