function sjfNonPreemptive(processes) {
    const n = processes.length;
    const remainingTime = [...processes.map((process) => process.time)];
    const completed = Array(n).fill(false);
    let previousTime = 0;
    let currentTime = 0;
    let completedCount = 0;
    let waitingTimes = []
    const ganttChart = [];
    let thisFirstLoop = true;

    while (completedCount < n) {
        let shortestJob = -1;
        let shortestBurstTime = Infinity;

        for (let i = 0; i < n; i++) {
            if (!completed[i] && processes[i].arrivalTime <= currentTime && remainingTime[i] < shortestBurstTime) {
                shortestJob = i;
                shortestBurstTime = remainingTime[i];
            }
        }

        if (shortestJob === -1) {
            currentTime++;
            continue;
        }

        previousTime = currentTime;
        if (thisFirstLoop) {
            previousTime = processes[shortestJob].arrivalTime;
            thisFirstLoop = false
        }
        
        currentTime += processes[shortestJob].time;

        completed[shortestJob] = true;
        completedCount++;

        processes[shortestJob].endTime = currentTime;
        processes[shortestJob].waitingTime =
            processes[shortestJob].endTime - processes[shortestJob].arrivalTime - processes[shortestJob].time;

        waitingTimes.push({
            processIndex: processes[shortestJob].processIndex,
            wait: processes[shortestJob].waitingTime
        });

        ganttChart.push({
            processId: processes[shortestJob].processIndex,
            startTime: previousTime,
            endTime: currentTime,
        });
    }

    return { ganttChart, waitingTimes };
}
