import { createAsyncThunk } from "@reduxjs/toolkit";
import { data_website } from "../../helpers/config";
const url_base = data_website.url_api;
export const startGetProjectListDataless = createAsyncThunk('projects/startGetProjectsListDataless', async () => {
    const response = await fetch(`${url_base}/projects/dataless`);
    const data = await response.json();
    return data;
});
export const startSetActiveProject = createAsyncThunk('projects/startSetActiveProject', async (table_name) => {
    const response = await fetch(`${url_base}/projects/${table_name}`);
    const data = await response.json();
    return data;
});
