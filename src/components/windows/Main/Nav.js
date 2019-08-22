import React from 'react';
import {connect} from 'react-redux';
import {setCurrentNav} from '../../../actions/nav';
import {setWeeks, setCalendarView} from '../../../actions/calendar';
import {setCapacitiesView} from '../../../actions/capacities';
import OpenWindow from '../../OpenWindow';
import weeks from '../../../icons/weeks.png';
import view from '../../../icons/view.png';
import generateDocument from '../../../icons/generate_special.png';
import settings from '../../../icons/settings-icon.png';
import inventory from '../../../icons/inventure.png';
import months from '../../../icons/months.png';
import deadlineEarliest from '../../../icons/deadline_earliest.png';
import deadlineLatest from '../../../icons/deadline_latest.png';
import capacitiesAbsolute from '../../../icons/capacities_absolute.png';
import capacitiesPercentual from '../../../icons/capacities_percentual.png';
import classicDays from '../../../icons/style_dates.png';
import classicCapacities from '../../../icons/style_capacities.png';
import compact from '../../../icons/style_compact.png';
import {JobInfoSettings} from "../JobInfo";
import {withTranslation} from 'react-i18next';

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
        const { t } = this.props;
        return <nav>
            <div id="Tabs">
                <button
                    id="HomeTab"
                    onClick={() => this.props.setCurrentNav('home')}
                    className={this.props.currentNav === "home" ? "active" : ""}>
                    {t('nav:tabs.home')}
                </button>
                <button
                    id="MaterialTab"
                    onClick={() => this.props.setCurrentNav('material')}
                    className={this.props.currentNav === "material" ? "active" : ""}>
                    {t('nav:tabs.material')}
                </button>
                <button
                    id="CalendarViewTab"
                    onClick={() => this.props.setCurrentNav('calendarView')}
                    className={this.props.currentNav === "calendarView" ? "active special" : "special"}>
                    {t('nav:tabs.calendarView')}
                </button>
                <button
                    id="JobsViewTab"
                    onClick={() => this.props.setCurrentNav('jobsView')}
                    className={this.props.currentNav === "jobsView" ? "active special" : "special"}>
                    {t('nav:tabs.jobsView')}
                </button>
            </div>
            <div id="Content">
                <div id="HomeContent" className={this.props.currentNav === "home" ? "active" : ""}>
                    <div className="section">
                        <div className="section-header">{t('nav:home.view.header')}</div>

                        <button className={this.props.view === 'calendar' ? 'active large-icon' : 'large-icon'}>
                            <img src={weeks} alt={t('nav:home.view.calendar')}/>
                            <span>{t('nav:home.view.calendar')}</span>
                        </button>

                        <button className={this.props.view === 'jobs' ? 'active large-icon' : 'large-icon'}>
                            <img src={view} alt={t('nav:home.view.jobs')}/>
                            <span>{t('nav:home.view.jobs')}</span>
                        </button>

                        <OpenWindow path="/job-info" settings={JobInfoSettings}>
                            <button className="large-icon">
                                <img/>
                                <span>test</span>
                            </button>
                        </OpenWindow>
                    </div>
                    <div className="section">
                        <div className="section-header">{t('nav:home.forms.header')}</div>

                        <button className="large-icon">
                            <img src={generateDocument} alt={t('nav:home.forms.generateDocument')}/>
                            <span>{t('nav:home.forms.generateDocument')}</span>
                        </button>
                    </div>
                    <div className="section">
                        <div className="section-header">{t('nav:home.settings.header')}</div>

                        <button className="large-icon">
                            <img src={settings} alt={t('nav:home.settings.settings')}/>
                            <span>{t('nav:home.settings.settings')}</span>
                        </button>
                    </div>
                </div>

                <div id="MaterialContent" className={this.props.currentNav === "material" ? "active" : ""}>
                    <div className="section">
                        <div className="section-header">{t('nav:material.inventory.header')}</div>

                        <button className="large-icon">
                            <img src={inventory} alt={t('nav:material.inventory.inventory')}/>
                            <span>{t('nav:material.inventory.inventory')}</span>
                        </button>
                    </div>
                </div>

                <div id="CalendarViewContent" className={this.props.currentNav === "calendarView" ? "active" : ""}>
                    <div className="section">
                        <div className="section-header">{t('nav:calendarView.period.header')}</div>

                        <button className={this.props.weeks === 4 ? 'active large-icon' : 'large-icon'} onClick={() => this.props.setWeeks(4)}>
                            <img src={months} alt={t('nav:calendarView.period.months')}/>
                            <span>{t('nav:calendarView.period.months')}</span>
                        </button>

                        <button className={this.props.weeks === 1 ? 'active large-icon' : 'large-icon'} onClick={() => this.props.setWeeks(1)}>
                            <img src={weeks} alt={t('nav:calendarView.period.weeks')}/>
                            <span>{t('nav:calendarView.period.weeks')}</span>
                        </button>
                    </div>

                    <div className="section">
                        <div className="section-header">{t('nav:calendarView.sort.header')}</div>

                        <button className="large-icon">
                            <img src={deadlineEarliest} alt={t('nav:calendarView.sort.deadlineEarliest')}/>
                            <span>{t('nav:calendarView.sort.deadlineEarliest')}</span>
                        </button>

                        <button className="large-icon">
                            <img src={deadlineLatest} alt={t('nav:calendarView.sort.deadlineLatest')}/>
                            <span>{t('nav:calendarView.sort.deadlineLatest')}</span>
                        </button>
                    </div>

                    <div className="section">
                        <div className="section-header">{t('nav:calendarView.capacitiesView.header')}</div>

                        <button className={this.props.capacitiesView === 'percentage' ? 'active large-icon' : 'large-icon'} onClick={() => this.props.setCapacitiesView('percentage')}>
                            <img src={capacitiesPercentual} alt={t('nav:calendarView.capacitiesView.percentual')}/>
                            <span>{t('nav:calendarView.capacitiesView.percentual')}</span>
                        </button>

                        <button className={this.props.capacitiesView === 'absolute' ? 'active large-icon' : 'large-icon'} onClick={() => this.props.setCapacitiesView('absolute')}>
                            <img src={capacitiesAbsolute} alt={t('nav:calendarView.capacitiesView.absolute')}/>
                            <span>{t('nav:calendarView.capacitiesView.absolute')}</span>
                        </button>
                    </div>

                    <div className="section">
                        <div className="section-header">{t('nav:calendarView.phaseView.header')}</div>

                        <button className={this.props.calendarView === 'classicDays' ? 'active large-icon' : 'large-icon'} onClick={() => this.props.setCalendarView('classicDays')}>
                            <img src={classicDays} alt={t('nav:calendarView.phaseView.classicDays')}/>
                            <span>{t('nav:calendarView.phaseView.classicDays')}</span>
                        </button>

                        <button className={this.props.calendarView === 'classicCapacities' ? 'active large-icon' : 'large-icon'} onClick={() => this.props.setCalendarView('classicCapacities')}>
                            <img src={classicCapacities} alt={t('nav:calendarView.phaseView.classicCapacities')}/>
                            <span>{t('nav:calendarView.phaseView.classicCapacities')}</span>
                        </button>

                        <button className={this.props.calendarView === 'compact' ? 'active large-icon' : 'large-icon'} onClick={() => this.props.setCalendarView('compact')}>
                            <img src={compact} alt={t('nav:calendarView.phaseView.compact')}/>
                            <span>{t('nav:calendarView.phaseView.compact')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    }
}

let Nav = connect(mapStateToProps, mapDispatchToProps)(NavComponent);
Nav = withTranslation()(Nav);

export default Nav;