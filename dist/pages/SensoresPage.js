import { FC, useEffect, useState } from 'react';
import { models } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';
export const SensoresPage = ({ widthClose }) => {
    return (<div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="card">
        <h2 className="card-title">Dashboard</h2>
        <div className="card-content">

        <PowerBIEmbed embedConfig={{
            type: 'report', // Supported types: report, dashboard, tile, visual, qna, paginated report and create
            id: '37eb4f69-8a87-4b75-a1a5-e6aa1fa2134d',
            embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=37eb4f69-8a87-4b75-a1a5-e6aa1fa2134d&groupId=7c708aba-16e9-42ed-82aa-2557d3d47e69&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUNFTlRSQUwtVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7InVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d',
            accessToken: 'H4sIAAAAAAAEAB2Ut66EVgAF_-W1WCIuwZILlpzzJXRklpyWZPnf_ex-qtE58_ePnd79lBY_f_7gU7J8FOGBvJhatz2b4JPT8IlxJR5hGq8x7SYGLOHbWtjtz5jFPgZgUkQsFzU248ZP2QjX_luvgQVJXly5_YnydaF9JyUz8DrsJolQwrDvyoW0y36OUA0npspLxmlbFprkdk2e-DYUUbX26upphO6iUdeAZ7OwlgPWgolcirFgeHcXgMXQWwv0WFTtejUzck32Rc_dGkZGAwqgLCDCFWZT5FqKI0e9kExVSfIJRJ98wuZspV0-rUHw6_fNLVE3OHjS0J-xKo5Lh2-Zgb-i41uRLcLH2lNNcnFCci_0HBZLyZxDza5JTMXYsXu2EhOZGHJtL_hp3UfIxz3C07tg_y65CASGvpwgx_0xtA2tB9eHCZPoO4N6ewlfGAvltrgkRfC4WrMdIr93xZ4WsTBvAivYNioGbIahmTPaB3_FnhCApBrWoA1tnmx269vOZRxy46yZBgPzB1ESXJi4h3l2ZnmFoKYrOiGWVdMfDfZHOyNbMGReWWDJHt40dLdvvdtEXd2HTnDXzCId2vRBxOlUEsJJ8R6NsEQ4qCIeGkJ5pjZ9bG3nZ2gM5i2RDpIjdFQeo7JugaQGOR0UInEs6kytQkilx3Jc8QQveqF51TAgGN0nulGbKIa3jTSoFt87jvaGKul9eLJQfDIPhv3Nl13yYPp1BMmemaMZLt8gz2bQFypnst5YoRXWBa3soQ4P93dmRXpk1U-aaMb-sbBZAfFg4B2s-cIHLzhBe0VraD2GBK1NHoFowwEVERa0LeKudXc4S4v5YmlEBgJXl1_2C4_FE1bo9DBrbfAXgHLoFSp84DeCybr2VqPpJl8bjL_e86BCh-yB-eePH269533Syvv3TmzwNpRbZKkRj2meOmiwv2HOEmUWa0wm5sY13qObNh3NFKidQ4eH9hUVmGOLcGbeKWGAvDW2bxHQLDHCqWiDlrbciXLDzucChsCfpHUo2SZPUwYooBH9nXNKqF6vzVLe5c0CRzUnqqYcZRKX-cDiqJTrmzlx7HXAqBZfgb6qDBt5iG5Xwy2cz5lDsdK12lBAJEo5pzqwAXTGj3YPu4mkSc9TblR8JqIpkOFkMJjUI5Kr0JIAcGDrRnQfyz681q5NhKGyWiJk9Iyk6mG_5_6Dl4J5DMXX4CfYqvsJixwKbcNezWUmNW8jTGuxcAOffA0OOW63lQt61C-7fb74HYa1UTbYv_76T_M9N-WqgF_L6_BuwEjJqzRkqOnf1MJN2_k_5X3qMd2_a_mLdVVah0f-2jFhf3S_uJmbfcYP0zuVoNljkU_RZ7m02glLC2YzUn-CbMBLkAoaA2YzipDd6d_kshtbgiCbNfyWjV3FnEzEVzUWV3cYG8kw7nb4p-8vBqLUnVq6yQXyY3evezHW4vt2Np9NyejecZLomog8tdbWi6vJT0KdXANUVGunFUx-pdLoya_4gBNDxTwPEz8rhwKcqTE46xjD8aj0qPKAGiOJ1dPoj8TzzcWsuXHh5CYEXh7FIAJgjCeplBKxkcnfaj6fN_Kbkt-Vu9RjJV-m1J0aT2rblXIR7mPkCzc9JYld4cy5wiZjPQBJyNW2Mm4tPxInXQ-FZXzzOb5vu3g5v5r_-RfPg7jSQgYAAA==.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUNFTlRSQUwtVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJleHAiOjE3Mjc3MzY1MzgsImFsbG93QWNjZXNzT3ZlclB1YmxpY0ludGVybmV0Ijp0cnVlfQ==',
            tokenType: models.TokenType.Embed, // Use models.TokenType.Aad for SaaS embed
            settings: {
                panes: {
                    filters: {
                        expanded: false,
                        visible: false
                    }
                },
                background: models.BackgroundType.Transparent,
            }
        }} eventHandlers={new Map([
            ['loaded', function () { console.log('Report loaded'); }],
            ['rendered', function () { console.log('Report rendered'); }],
            ['error', function (event) { console.log(event.detail); }],
            ['visualClicked', () => console.log('visual clicked')],
            ['pageChanged', (event) => console.log(event)],
        ])} cssClassName={"reportClass"} getEmbeddedComponent={(embeddedReport) => {
            window.report = embeddedReport;
        }}/>
        </div>
      </div>
    </div>);
};
