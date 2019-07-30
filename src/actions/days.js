const ACTION_DAYS_SWITCH = 'DAYS_SWITCH';

function switchForward() {
    return {
        type: ACTION_DAYS_SWITCH,
        switch: 'forward'
    }
}

function switchBackward() {
    return {
        type: ACTION_DAYS_SWITCH,
        switch: 'backward'
    }
}

function switchToday() {
    return {
        type: ACTION_DAYS_SWITCH,
        switch: 'today'
    }
}

export {ACTION_DAYS_SWITCH, switchForward, switchBackward, switchToday};