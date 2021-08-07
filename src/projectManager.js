import { PubSub } from "./pubSub";
import { pageBuild } from "./index";

const projectManager = (function() {
    let projects = {};
    PubSub.subscribe('addProject', addProject);
    PubSub.subscribe('projectSelect', projectSelect)

    function newProject(projectName) {
        let project = {};
        project.todos = [];
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
    return { projects, addProject, newProject }
})();

export { projectManager };