import moment from 'moment';
import getEaster from './days-easter';

// TODO: localize national holidays
const czechHolidays = [
    '01-01',
    '05-01',
    '05-08',
    '07-05',
    '07-06',
    '09-28',
    '10-28',
    '11-17',
    '12-24',
    '12-25',
    '12-26',
];

function prepareDays(weekDelta = 0, weeks = 4) {
    let days = [];

    let firstDay = moment().isoWeekday(1).startOf('isoWeek').add(weekDelta, 'weeks');

    for (let i = 0; i < weeks * 7; i++) {
        let day = firstDay.clone().add(i, 'days');
        days.push(day.toDate());
    }

    return days;
}

function isHoliday(date) {
    let formattedDate =
        (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        + '-'
        + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());

    if (czechHolidays.indexOf(formattedDate) !== -1)
        return true;

    if (getEaster(date.getFullYear()).indexOf(formattedDate) !== -1)
        return true;

    return false;
}

function isNonWorkingDay(date) {
    return date.getDay() === 6 || date.getDay() === 0 || isHoliday(date);
}

export { prepareDays, isNonWorkingDay };