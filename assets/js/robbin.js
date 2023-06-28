function roundRobinScheduling(processes, timeQuantum) {
    const n = processes.length;
    let remainingTime = [...processes];
    let currentTime = 0;
    let waitingTime = new Array(n).fill(0);
    let turnAroundTime = new Array(n).fill(0);
    let ganttChart = [];

    while (true) {
        let allDone = true;

        for (let i = 0; i < n; i++) {
            if (remainingTime[i] > 0) {
                allDone = false;

                let startTime = currentTime;
                let processTime = Math.min(remainingTime[i], timeQuantum);
                currentTime += processTime;
                remainingTime[i] -= processTime;
                let endTime = currentTime;

                ganttChart.push({
                    process: i + 1,
                    startTime,
                    endTime
                });

                if (remainingTime[i] === 0) {
                    turnAroundTime[i] = endTime;
                }
            }
        }

        if (allDone) {
            break;
        }
    }

    for (let i = 0; i < n; i++) {
        turnAroundTime[i] -= waitingTime[i];
        waitingTime[i] = turnAroundTime[i] - processes[i];
    }

    return {
        chart: ganttChart,
        formula: waitingTime
    };
}
