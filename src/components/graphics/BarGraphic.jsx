import React, { useEffect } from 'react'

export const BarGraphic = () => {
    useEffect(() => {
        
        
        const ctx2 = document.getElementById('myBarChart');
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: 'My First Dataset',
                    data: [12, 19, 3, 5, 2, 3],
                    fill: true,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
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


  return (
    <canvas id="myBarChart" width="100%" height="40"></canvas>
  )
}

