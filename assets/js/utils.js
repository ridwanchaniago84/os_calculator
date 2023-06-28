const processObj = [{
    processIndex: 1,
    time: 0,
    prioritySch: 0
}];

let firstInput = true;
let sideBarActive = false;
let currentSection = 'fcfs';

const input = (index) => {
    return `
        <div>
            <div class="col s12">
                <h6>Proses ${index}</h6>
            </div>
            <div class="input-field col s6">
                <input id="tunggu-${index}" class="tunggu-input" type="number" class="validate">
                <label for="tunggu-${index}">Burst Time</label>
            </div>
            <div class="input-field col s6">
                <input id="priority-${index}" type="number" class="priority-input" class="validate">
                <label for="priority-${index}">Priority</label>
            </div>
            <div class="col s12">
                <hr />
            </div>
        </div>
    `
};

const averageTimeRender = (formula, result) => {
    return `
        <i style="display: block;">Rata-Rata waktu tunggu:</i>
        <span><i>${formula} = <b><u>${result} milidetik</u></b></i></span>
    `;
}

const renderFormula = (times) => {
    let formula = '<span><i>(';
    let resultFormula = 0;

    times.forEach((time, index) => {
        formula += `${index === 0 ? '' : ' + '}${time}`
        resultFormula += time;
    });

    formula += `)/${times.length}`
    const averageTime = resultFormula / times.length;

    $('#average').html(averageTimeRender(formula, averageTime.toFixed(2)));

    if (firstInput) $('#result').slideDown();
}

const writeRuler = (ruler, currentTime) => {
    ruler += `
        <div class='cm'>
            <div class="time">${currentTime}</div>
        </div>
    `;

    $('.ruler').html(ruler);
}

const firstCome = () => {
    let ruler = '';
    let currentTime = 0;
    let times = [];

    processObj.forEach((process) => {
        if (process.time == 0) return;

        ruler += rulerSection({
            indexProcess: process.processIndex,
            time: currentTime,
            second: process.time - 1
        });

        times.push(currentTime);
        currentTime += process.time
    });

    writeRuler(ruler, currentTime);
    renderFormula(times);
}

const prioritySch = () => {
    let ruler = '';
    let currentTime = 0;
    let times = [];
    let sortedData = [];

    for (let i = 0; i < processObj.length; i++) {
        sortedData.push(processObj[i]);
    }

    sortedData = sortedData.sort((a, b) => a.prioritySch - b.prioritySch);

    sortedData.forEach((process) => {
        if (process.time == 0) return;

        ruler += rulerSection({
            indexProcess: process.processIndex,
            time: currentTime,
            second: process.time - 1
        });

        times.push(currentTime);
        currentTime += process.time
    });

    writeRuler(ruler, currentTime, times);
    renderFormula(times);
}

const robbinCalc = () => {
    let ruler = '';
    let currentTime = 0;
    let processBurst = [];

    for (let i = 0; i < processObj.length; i++) {
        processBurst.push(processObj[i].time);
    }

    const results = roundRobinScheduling(processBurst, parseInt($('.quantum-input').val()));

    results.chart.forEach((result) => {
        ruler += rulerSection({
            indexProcess: result.process,
            time: result.startTime,
            second: result.endTime - result.startTime - 1
        });

        currentTime = result.endTime
    });

    writeRuler(ruler, currentTime);
    renderFormula(results.formula);
}

const renderRuler = () => {
    switch (currentSection) {
        case 'fcfs':
            firstCome();
            break;
        case 'priority':
            prioritySch();
            break;
        case 'robin':
            robbinCalc();
            break;
    }
}

const inputListener = () => {
    $('.tunggu-input').on('input', function () {
        $('.tunggu-input').each((index, element) => {
            processObj[index].time = $(element).val() == '' ? 0 : parseInt($(element).val());
        });

        renderRuler();
    });

    $('.priority-input').on('input', function () {
        $('.priority-input').each((index, element) => {
            processObj[index].prioritySch = $(element).val() == '' ? 0 : parseInt($(element).val());
        });

        if (currentSection != 'priority') return;
        renderRuler();
    });

    $('.quantum-input').on('input', function () {
        if (currentSection != 'robin') return;
        renderRuler();
    });
}

const rulerSection = (args) => {
    return `
    <div class='cm'>
        <div class="process">P${args.indexProcess}</div>
        <div class="time">${args.time}</div>
        ${Array.from({ length: args.second }, () => `<div class='mm'></div>`).join('')}
    </div>
    `;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

const getSectionName = (section) => {
    let sectionName = "";

    switch (section) {
        case 'fcfs':
            sectionName = 'First-Come First-Served Scheduling';
            break;
        case 'sjf-n':
            sectionName = 'Shortest Job First Scheduler (Non preemptive)';
            break;
        case 'sjf':
            sectionName = 'Shortest Job First Scheduler (Preemptive)';
            break;
        case 'priority':
            sectionName = 'Priority Scheduling';
            break;
        case 'robin':
            sectionName = 'Round-Robin Scheduling';
            break;
    }

    return sectionName;
}

const changeSection = async (section) => {
    if (section === currentSection) return;
    const sectionName = getSectionName(section);

    $('#method-name>div').css({ "transform": "translateX(50%)", 'opacity': '0' });
    await sleep(500);

    $('#method-name').html(`<div style="opacity: 0">${sectionName}</div>`)
    await sleep(100);
    $('#method-name>div').css({ 'opacity': '1' });
    currentSection = section;

    $('#result').slideUp()

    await sleep(500);
    renderRuler();
    $('#result').slideDown()
}

$(document).ready(function () {
    // $('.sidenav').sidenav();
    $('.sidenav-trigger').click(() => {
        if (sideBarActive) {
            $('.sidenav').css({ "transform": "" });
            $('.wide-container').removeClass('active')
            sideBarActive = false;

            return;
        }

        $('.sidenav').css({ "transform": "translateX(0%)" });
        $('.wide-container').addClass('active')
        sideBarActive = true;
    });

    $('#add-input').click(async () => {
        const totalProcess = $('#input-container').children().length;
        const currentProcess = totalProcess + 1;

        $('#input-container').append(input(currentProcess))
        $('input').off('input');
        inputListener();

        processObj.push({});
        processObj[totalProcess].processIndex = currentProcess;
    });

    $('#remove-input').click(() => {
        const totalProcess = $('#input-container').children().length;

        if (totalProcess === 1) return;

        $('#input-container').children().last().remove();

        processObj.pop();
        renderRuler();
    });

    inputListener()
});
