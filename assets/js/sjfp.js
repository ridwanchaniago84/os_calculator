function sjfPreemptive(processes) {
    const n = processes.length;
    const remainingTime = [...processes.map((process) => process.time)];
    const completed = Array(n).fill(false);
    let currentTime = 0;
    let completedCount = 0;
    let waitingTimes = []
    const ganttChart = [];
    let previousData = {
        index: -1,
        id: 0
    };

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

        remainingTime[shortestJob]--;
        currentTime++;

        if (remainingTime[shortestJob] === 0) {
            completed[shortestJob] = true;
            completedCount++;

            processes[shortestJob].endTime = currentTime;
            processes[shortestJob].waitingTime =
                processes[shortestJob].endTime - processes[shortestJob].arrivalTime - processes[shortestJob].time;

            waitingTimes.push({
                processIndex: processes[shortestJob].processIndex,
                wait: processes[shortestJob].waitingTime
            });
        }

        if (previousData.index !== -1 && processes[shortestJob].processIndex == previousData.id) {
            ganttChart[previousData.index].endTime = currentTime;
        } else {
            ganttChart.push({
                processId: processes[shortestJob].processIndex,
                startTime: currentTime - 1,
                endTime: currentTime,
            });

            previousData = {
                index: ganttChart.length - 1,
                id: processes[shortestJob].processIndex
            };
        }
    }

    return { ganttChart, waitingTimes };
}
