import { PubSub } from "./pubSub";
import { projectManager } from "./projectManager";
import { pageBuild } from "./index.js";

const toDoManager = (function() {
    PubSub.subscribe('addToDo', addToDo);    
    function newToDo(data) {
        // if (!projectManager.currentProject) return;
        let toDo = {};
        toDo.description = data.description;
        toDo.priority = data.priority;
        toDo.dueDate = data.dueDate;
        return toDo;
    }
    function addToDo(eventData) {
        const formData = pageBuild.getToDoFormData();
        if (projectManager.currentProject === '')
            return;
        if (formData.description === '' || formData.priority === '' || formData.dueDate === '')
            return;
        const toDo = newToDo(formData);
        // associate with project
        const projectToDos = projectManager.projects[projectManager.currentProject].toDos
        projectManager.projects[projectManager.currentProject].toDos.push(toDo);
        let testObj = projectManager.projects;
        
        const stop = 3;
    }

    return { newToDo };
}());