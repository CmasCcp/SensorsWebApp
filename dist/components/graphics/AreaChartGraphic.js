import React, { useEffect, useState } from 'react';
export const AreaChartGraphic = ({ apiUrl }) => {
    const [data, setData] = useState([]);
    const [dataLabels, setDataLabels] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        const ctx = document.getElementById('myAreaChart');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                        label: 'My First Dataset',
                        data: [12, 19, 3, 5, 2, 3],
                        fill: true,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.5
                    }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, []);
    return (<canvas id="myAreaChart" width="100%" height="40"></canvas>);
};
