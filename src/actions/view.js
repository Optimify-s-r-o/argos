const ACTION_SWITCH_VIEW = 'SWITCH_VIEW';

function setView(view) {
    return {
        type: ACTION_SWITCH_VIEW,
        view: view
    }
}

export {ACTION_SWITCH_VIEW, setView};