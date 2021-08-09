import { PubSub } from "./pubSub";
import { pageBuild } from "./index";

const projectManager = (function() {
    let projects = {};
    let currentProject = '';
    PubSub.subscribe('addProject', addProject);
    PubSub.subscribe('projectSelect', projectSelect)

    function newProject(projectName) {
        let project = {};
        project.toDos = [];
        project.name = projectName;
        return project;
    }
    


    function addProject() {
        const projectName = prompt('Project name?');
        if (projects[projectName] || projectName === '') {
            alert('cannot have duplicate or empty project name');
            return;
        }
        projects[projectName] = newProject(projectName);
        pageBuild.addProject(projectName);
    }
    function projectSelect(projectName) {
        
    }
    function addToDoToProject(toDo) {
        projects[currentProject].todos.push(toDo);        
    }
    return { projects, currentProject, addProject, newProject }
})();

export { projectManager };