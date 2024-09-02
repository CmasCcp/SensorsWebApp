import { createSlice } from '@reduxjs/toolkit';
import { startGetProjectListDataless, startSetActiveProject } from './thunks';

export const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        // projectList:[
        //     {
        //         id: 1,
        //         img: "https://www.portalagrochile.cl/wp-content/uploads/2022/07/tecnicas-de-riego-de-precision.jpg",
        //         name:"Fic de riego",
        //         category: "FIC",
        //         data:[
        //             {
        //                 id:1,
        //                 datetime: new Date().getTime(),
        //                 flow: "cien",
        //                 flow_acum:150,
        //                 pressure: 100,
        //                 pressure_avg: 100,
        //             },
        //             {
        //                 id:2,
        //                 datetime: new Date().getTime(),
        //                 flow: 100,
        //                 flow_acum:100,
        //                 pressure: 100,
        //                 pressure_avg: 100,
        //             },
        //             {
        //                 id:3,
        //                 datetime: new Date().getTime(),
        //                 flow: 100,
        //                 flow_acum:100,
        //                 pressure: 100,
        //                 pressure_avg: 100,
        //             },
        //             {
        //                 id:4,
        //                 datetime: new Date().getTime(),
        //                 flow: 100,
        //                 flow_acum:100,
        //                 pressure: 100,
        //                 pressure_avg: 100,
        //             },
        //             {
        //                 id:5,
        //                 datetime: new Date().getTime(),
        //                 flow: 100,
        //                 flow_acum:100,
        //                 pressure: 100,
        //                 pressure_avg: 100,
        //             },
        //             {
        //                 id:6,
        //                 datetime: new Date().getTime(),
        //                 flow: 100,
        //                 flow_acum:100,
        //                 pressure: 100,
        //                 pressure_avg: 100,
        //             },
        //             {
        //                 id:7,
        //                 datetime: new Date().getTime(),
        //                 flow: 100,
        //                 flow_acum:100,
        //                 pressure: 100,
        //                 pressure_avg: 100,
        //             },
        //         ]

        //     },
        //     {
        //         id: 2,
        //         img: "https://upload.wikimedia.org/wikipedia/commons/8/83/Salto_del_Laja_2019_%282%29.jpg",
        //         name:"Fic de riego El Salto",
        //         category: "FIC",
        //         data:[
        //             {
        //                 id:1,
        //                 datetime: new Date().getTime(),
        //                 flow: 100,
        //                 flow_acum:100,
        //                 pressure: 100,
        //                 pressure_avg: 100,
        //             },
        //             {
        //                 id:2,
        //                 datetime: new Date().getTime(),
        //                 flow: 100,
        //                 flow_acum:100,
        //                 pressure: 100,
        //                 pressure_avg: 100,
        //             },
        //         ]

        //     },
        // ],
        projectList:[],
        isLoading: false,
        error: null,
        activeProject: null,
        investigationGroups:[{
                id: 1,
                img: "https://picsum.photos/200/300",
                name: "ENVIRO HEALTH",
                description: ""
            },
            {
                id: 2,
                img: "https://picsum.photos/200/320",
                name: "MODULAR DIAGNOSITICS",
                description: ""
            },
            {
                id: 3,
                img: "https://picsum.photos/200/305",
                name: "EXTREME ENVIRONMENTS",
                description: ""
            },
            {
                id: 4,
                img: "https://picsum.photos/200/304",
                name: "EXTENDED REALITIES",
                description: ""
            },
            {
                id: 5,
                img: "https://picsum.photos/200/301",
                name: "NEW MATERIALS",
                description: ""
            },
        ],
        projectListDataless: [{
            id: 1,
            img: "https://www.portalagrochile.cl/wp-content/uploads/2022/07/tecnicas-de-riego-de-precision.jpg",
            name:"Fic de riego",
            category: "FIC",
            data:[
                {
                    id:1,
                    datetime: new Date().getTime(),
                    flow: "cien",
                    flow_acum:150,
                    pressure: 100,
                    pressure_avg: 100,
                },
                {
                    id:2,
                    datetime: new Date().getTime(),
                    flow: 100,
                    flow_acum:100,
                    pressure: 100,
                    pressure_avg: 100,
                },
                {
                    id:3,
                    datetime: new Date().getTime(),
                    flow: 100,
                    flow_acum:100,
                    pressure: 100,
                    pressure_avg: 100,
                },
                {
                    id:4,
                    datetime: new Date().getTime(),
                    flow: 100,
                    flow_acum:100,
                    pressure: 100,
                    pressure_avg: 100,
                },
                {
                    id:5,
                    datetime: new Date().getTime(),
                    flow: 100,
                    flow_acum:100,
                    pressure: 100,
                    pressure_avg: 100,
                },
                {
                    id:6,
                    datetime: new Date().getTime(),
                    flow: 100,
                    flow_acum:100,
                    pressure: 100,
                    pressure_avg: 100,
                },
                {
                    id:7,
                    datetime: new Date().getTime(),
                    flow: 100,
                    flow_acum:100,
                    pressure: 100,
                    pressure_avg: 100,
                },
            ]

        },
            {
                id: 2,
                img: "https://upload.wikimedia.org/wikipedia/commons/8/83/Salto_del_Laja_2019_%282%29.jpg",
                name:"Fic de riego El Salto",
                category: "FIC",
                data:[
                    {
                        id:1,
                        datetime: new Date().getTime(),
                        flow: 100,
                        flow_acum:100,
                        pressure: 100,
                        pressure_avg: 100,
                    },
                    {
                        id:2,
                        datetime: new Date().getTime(),
                        flow: 100,
                        flow_acum:100,
                        pressure: 100,
                        pressure_avg: 100,
                    },
                ]

            },],
        categories: []
    },
    reducers: {
        setProjectList: (state, { payload }) => {
            console.log(payload);
            state.projectList = payload;
        },
        getProjectsCategories: (state) => {
            const newSections = state.projectListDataless
                .map(project => project?.category || "")
                .reduce((acc, item) => {
                    if (!acc.includes(item)) {
                        acc.push(item);
                    }
                    return acc;
                }, []);
            console.log("newSections", newSections);
            state.categories = newSections;
        },
        setActiveProject: (state, { payload }) => {
            state.isLoading = true;
            const activeProject = state.projectListDataless.filter(project => project.name == payload);
            state.activeProject = activeProject;
            state.isLoading = false;
        },
        setIsLoading:(state, {payload})=>{
            state.isLoading = payload;

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(startGetProjectListDataless.pending, (state) => {
                console.log("startGet aja, pending");
                state.isLoading = true;
                state.error = null;
            })
            .addCase(startGetProjectListDataless.fulfilled, (state, action) => {
                console.log("startGet aja, fulfill");
                state.isLoading = false;
                console.log(action.payload);
                state.projectListDataless = action.payload;
            })
            .addCase(startGetProjectListDataless.rejected, (state, action) => {
                console.log("startGet aja, rejected");
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(startSetActiveProject.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(startSetActiveProject.fulfilled, (state, action) => {
                state.isLoading = false;
                console.log(action.payload);
                state.activeProject = action.payload[0];
            })
            .addCase(startSetActiveProject.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
    }
});


// Action creators are generated for each case reducer function
export const {
    setProjectList,
    getProjectsCategories,
    setActiveProject,
    setIsLoading
} = projectSlice.actions;