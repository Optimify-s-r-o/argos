import React from 'react'
import CurrentWeek from './WeekSelector/CurrentWeek';
import Selector from './WeekSelector/Selector';
import Legend from './WeekSelector/Legend';

class WeekSelector extends React.Component {
    render () {
        return <div id="WeekSelector" className="Row">
            <CurrentWeek/>
            <Selector/>
            <Legend/>
        </div>
    }
}

export default WeekSelector;