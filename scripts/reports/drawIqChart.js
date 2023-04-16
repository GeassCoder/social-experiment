export default function drawIqChart (iqGroups) {
    const xValues = iqGroups.map(one => one.label);
    const yValues = iqGroups.map(one => one.count);

    new Chart(
        document.getElementById('iq-distribution'),
        {
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'IQ Distribution'
                    }
                }
            },
            data: {
                labels: xValues,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Count',
                        data: yValues
                    },
                    {
                        type: 'line',
                        data: yValues
                    }
                ]
            },
        }
    );

    // test
    // let total = 0;
    // for (let i = 0; i < iqGroups.length; i++) {
    //     total += iqGroups[i].count;
    // }
    
    // console.log(1111, total);
}