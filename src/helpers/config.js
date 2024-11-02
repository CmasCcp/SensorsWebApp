export const data_website = {
    // url_api:"http://localhost:4000/api/",
    url_api:"https://southamerica-west1-fic-aysen-412113.cloudfunctions.net",
}

// URL used for initiating authorization request
export const authorityUrl = "https://login.microsoftonline.com/common/";

// End point URL for Power BI API
export const powerBiApiUrl = "https://api.powerbi.com/";

// Scope for securing access token
export const scopeBase = ["https://analysis.windows.net/powerbi/api/Report.Read.All"];

// Client Id (Application Id) of the AAD app.
export const clientId = "8e94a7e7-a878-4e6d-9021-8231737ebec5";

// Id of the workspace where the report is hosted
export const workspaceId = "60113aa1-7998-4872-a955-fe6db64d7cf1";

// Id of the report to be embedded
export const reportId = "122ebf34-8415-4cb4-9289-da29293c90dc";

export const embedUrl = "https://app.powerbi.com/reportEmbed?reportId=122ebf34-8415-4cb4-9289-da29293c90dc&groupId=60113aa1-7998-4872-a955-fe6db64d7cf1&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUNFTlRSQUwtVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7InVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d";