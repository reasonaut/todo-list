import { PubSub } from "./pubSub";
import { pageBuild } from "./index";

const projectManager = (function() {
    let projects = {};
    let currentProject = {};
    PubSub.subscribe('addProject', addProject);
    PubSub.subscribe('projectSelect', projectSelect);
    PubSub.subscribe('saveAppState', saveAppState);

    // check for locally stored state
    const storedProjects = JSON.parse(localStorage.getItem('projectData'));
    if (storedProjects) projects = storedProjects;

    function getCurrentProject() {
        return currentProject;
    }
    
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
        currentProject = projectName;
        projects[projectName] = newProject(projectName);
        pageBuild.addProject(projectName);
        saveAppState(projects);
    }
    function projectSelect(eventData) {
        currentProject = eventData.target.innerText;
        currentProject = projects[currentProject];
        pageBuild.displayProjectToDos(currentProject);
    }
    function saveAppState(projectsState) {
        projects = projectsState;
        localStorage.setItem('projectData', JSON.stringify(projectsState));
    }
    return { projects, currentProject, getCurrentProject, newProject, saveAppState }
})();

export { projectManager };