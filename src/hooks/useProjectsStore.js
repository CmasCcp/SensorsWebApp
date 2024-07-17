import { useDispatch, useSelector } from "react-redux"
import { getProjectsCategories, 
    setActiveProject, setIsLoading } from "../store/projects/projectsSlice";


export const useProjectsStore = () => {
    const dispatch = useDispatch();
    const { projectList,isLoading, projectListDataless, activeProject, categories } = useSelector(state => state.projects);


    const startGetProjectsCategories = () => {
        const projectsCategories = dispatch(getProjectsCategories());
        console.log(projectsCategories);
        return projectsCategories;
    }

    const startGetProjectsByCategory = (category) => {
        const projectsByCategory = projectListDataless
            ?.map(project=> ({...project, category: project.category || ""}))
            .filter(project => (project.category === category));
        console.log(projectsByCategory);
        return projectsByCategory;
    }

    const startSetActiveProjectFilteredData = (filteredData)=>{
        dispatch(setActiveProject(filteredData));
    };

    const startSetIsLoading=(payload)=>{
        console.log(payload);
        dispatch(setIsLoading(payload))
    }


    return {
        // properties
        projectList,
        categories,
        activeProject,
        isLoading,

        //methods
        startGetProjectsByCategory,
        startGetProjectsCategories,
        startSetActiveProjectFilteredData,
        startSetIsLoading
    }
}