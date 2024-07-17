import { configureStore } from "@reduxjs/toolkit"
import { projectSlice } from "./projects/projectsSlice"


export const store = configureStore({
    reducer:{
        projects: projectSlice.reducer,
    }
})