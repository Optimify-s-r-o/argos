import React from 'react';
import {connect} from "react-redux";
import {setCurrentNav} from '../../actions/nav';
import {setWeeks, setCalendarView} from '../../actions/calendar';
import {setCapacitiesView} from '../../actions/capacities';
import weeks from '../../icons/weeks.png';
import view from '../../icons/view.png';
import generateDocument from '../../icons/generate_special.png';
import settings from '../../icons/settings-icon.png';
import inventure from '../../icons/inventure.png';
import months from '../../icons/months.png';
import deadlineEarliest from '../../icons/deadline_earliest.png';
import deadlineLatest from '../../icons/deadline_latest.png';
import capacitiesAbsolute from '../../icons/capacities_absolute.png';
import capacitiesPercentual from '../../icons/capacities_percentual.png';
import classicDays from '../../icons/style_dates.png';
import classicCapacities from '../../icons/style_capacities.png';
import compact from '../../icons/style_compact.png';

const mapStateToProps = state => {
    return {
        currentNav: state.settings.currentNav,
        view: state.settings.view,
        calendarView: state.settings.calendarView,
        capacitiesView: state.settings.capacitiesView,
        weeks: state.settings.weeks
    }
};

function mapDispatchToProps(dispatch) {
    return {
        setCurrentNav: (nav) => dispatch(setCurrentNav(nav)),
        setWeeks: (weeks) => dispatch(setWeeks(weeks)),
        setCalendarView: (view) => dispatch(setCalendarView(view)),
        setCapacitiesView: (view) => dispatch(setCapacitiesView(view))
    }
}

class NavComponent extends React.Component {
    render() {
        return <nav>
            <div id="Tabs">
                <button id="HomeTab" onClick={() => this.props.setCurrentNav('home')} className={this.props.currentNav === "home" ? "active" : ""}>Domů</button>
                <button id="MaterialTab" onClick={() => this.props.setCurrentNav('material')} className={this.props.currentNav === "material" ? "active" : ""}>Materiál</button>
                <button id="CalendarViewTab" onClick={() => this.props.setCurrentNav('calendarView')} className={this.props.currentNav === "calendarView" ? "active special" : "special"}>Zobrazení kalendáře</button>
                <button id="JobsViewTab" onClick={() => this.props.setCurrentNav('jobsView')} className={this.props.currentNav === "jobsView" ? "active special" : "special"}>Zakázky</button>
            </div>
            <div id="Content">
                <div id="HomeContent" className={this.props.currentNav === "home" ? "active" : ""}>
                    <div className="section">
                        <div className="section-header">Zobrazení</div>

                        <button className={this.props.view === 'calendar' ? 'active large-icon' : 'large-icon'}>
                            <img src={weeks} alt="Kalendář"/>
                            <span>Kalendář</span>
                        </button>

                        <button className={this.props.view === 'jobs' ? 'active large-icon' : 'large-icon'}>
                            <img src={view} alt="Zakázky"/>
                            <span>Zakázky</span>
                        </button>
                    </div>
                    <div className="section">
                        <div className="section-header">Formuláře</div>

                        <button className="large-icon">
                            <img src={generateDocument} alt="Generovat dokument"/>
                            <span>Generovat<br/> dokument</span>
                        </button>
                    </div>
                    <div className="section">
                        <div className="section-header"></div>

                        <button className="large-icon">
                            <img src={settings} alt="Nastavení"/>
                            <span>Nastavení</span>
                        </button>
                    </div>
                </div>

                <div id="MaterialContent" className={this.props.currentNav === "material" ? "active" : ""}>
                    <div className="section">
                        <div className="section-header"></div>

                        <button className="large-icon">
                            <img src={inventure} alt="Inventura"/>
                            <span>Inventura</span>
                        </button>
                    </div>
                </div>

                <div id="CalendarViewContent" className={this.props.currentNav === "calendarView" ? "active" : ""}>
                    <div className="section">
                        <div className="section-header">Období</div>

                        <button className={this.props.weeks === 4 ? 'active large-icon' : 'large-icon'} onClick={() => this.props.setWeeks(4)}>
                            <img src={months} alt="Měsíční"/>
                            <span>Měsíční</span>
                        </button>

                        <button className={this.props.weeks === 1 ? 'active large-icon' : 'large-icon'} onClick={() => this.props.setWeeks(1)}>
                            <img src={weeks} alt="Týdenní"/>
                            <span>Týdenní</span>
                        </button>
                    </div>

                    <div className="section">
                        <div className="section-header">Řazení</div>

                        <button className="large-icon">
                            <img src={deadlineEarliest} alt="Měsíční"/>
                            <span>Dříve<br/> končící</span>
                        </button>

                        <button className="large-icon">
                            <img src={deadlineLatest} alt="Týdenní"/>
                            <span>Později<br/> končící</span>
                        </button>
                    </div>

                    <div className="section">
                        <div className="section-header">Kapacity</div>

                        <button className={this.props.capacitiesView === 'percentage' ? 'active large-icon' : 'large-icon'} onClick={() => this.props.setCapacitiesView('percentage')}>
                            <img src={capacitiesPercentual} alt="Procentuální"/>
                            <span>Procentuální</span>
                        </button>

                        <button className={this.props.capacitiesView === 'absolute' ? 'active large-icon' : 'large-icon'} onClick={() => this.props.setCapacitiesView('absolute')}>
                            <img src={capacitiesAbsolute} alt="Absolutní"/>
                            <span>Absolutní</span>
                        </button>
                    </div>

                    <div className="section">
                        <div className="section-header">Styl fází</div>

                        <button className={this.props.calendarView === 'classicDays' ? 'active large-icon' : 'large-icon'} onClick={() => this.props.setCalendarView('classicDays')}>
                            <img src={classicDays} alt="Dny"/>
                            <span>Dny</span>
                        </button>

                        <button className={this.props.calendarView === 'classicCapacities' ? 'active large-icon' : 'large-icon'} onClick={() => this.props.setCalendarView('classicCapacities')}>
                            <img src={classicCapacities} alt="Kapacity"/>
                            <span>Kapacity</span>
                        </button>

                        <button className={this.props.calendarView === 'compact' ? 'active large-icon' : 'large-icon'} onClick={() => this.props.setCalendarView('compact')}>
                            <img src={compact} alt="Kompaktní"/>
                            <span>Kompaktní</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    }
}

const Nav = connect(mapStateToProps, mapDispatchToProps)(NavComponent);

export default Nav;