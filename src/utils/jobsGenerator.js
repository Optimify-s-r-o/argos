const jobsInfo = [
    {
        jobId: 'O123',
        place: 'Praha',
        type: 'VŠE',
        deadline: '2019-06-26'
    },
    {
        jobId: 'R456',
        place: 'Černobyl',
        type: 'Sarkofág',
        deadline: '1987-04-26'
    },
    {
        jobId: 'O456',
        place: 'Plzeň',
        type: 'RD',
        deadline: '2019-06-26'
    },
    {
        jobId: 'R123',
        place: 'Olomouc',
        type: 'RD Novák',
        deadline: '1987-04-26'
    },
    {
        jobId: 'O789',
        place: 'Brno',
        type: 'RD',
        deadline: '2019-06-26'
    },
    {
        jobId: 'R987',
        place: 'Ostrava',
        type: 'Vila',
        deadline: '1987-04-26'
    }
];

const phases = ['saw', 'press', 'transport', 'assembly'];

function random(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function jobsGenerator(days)
{
    let jobsCount = random(1, jobsInfo.length);
    let jobsList = [...jobsInfo];

    let returnObject = {};

    for (let i = 0; i < jobsCount; i++) {
        let randomJob = jobsList.splice(random(0, jobsList.length), 1)[0];

        let phasesObj = {};
        let dayOffset = random(0,14);
        phases.forEach(phase => {
            phasesObj[phase] = [];
            dayOffset += random(0, 2);
            for (let i = 0; i < random(1, 4); i++) {
                phasesObj[phase].push(days[dayOffset]);
                dayOffset++;
            }
        });

        randomJob = Object.assign({}, randomJob, {
            phases: phasesObj
        });
        returnObject[randomJob.jobId] = randomJob;
    }

    console.log(returnObject);
    return returnObject;
}

export default jobsGenerator;