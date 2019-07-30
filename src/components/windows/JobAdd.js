import React from 'react';
import '../../styles/main.css';
import '../../styles/forms.css';
import TitleBar from '../TitleBar';
import FormRow from "../FormRow";

const title = 'Informace o zakázce';

const JobInfoPath = (id) => { return '/job-info/' + id; };

const JobInfoSettings = {
    title: title
};

function JobInfo() {
    return [
        <TitleBar key="titleBar" title={title} icon={false}/>,
        <div key="content" className="row">
            <div className="column">
                <div className="form-card">
                    <div className="form-card-header">
                        <div>Základní informace</div>
                    </div>
                    <FormRow title="Identifikace zakázky" selectable={true}>O123</FormRow>
                    <FormRow title="Zákazník"><input type="text" value="Novák"/></FormRow>
                    <FormRow title="Zahájení zakázky"><input type="date" value="2019-08-01"/></FormRow>
                    <FormRow title="Deadline"><input type="date" value="2019-08-30"/></FormRow>
                    <FormRow title="Přijato zákazníkem"><input type="checkbox"/></FormRow>
                    <FormRow border={false}><button className="btn btn-text">Uložit změny</button></FormRow>


                    <div className="form-card-header">
                        Detailní informace
                    </div>
                    <FormRow title="Lokalita" selectable={true}>Praha</FormRow>
                    <FormRow title="Popis" selectable={true}>RD Novák</FormRow>
                    <FormRow title="Sněhová oblast" selectable={true}></FormRow>
                    <FormRow title="Zatížení" selectable={true}></FormRow>
                    <FormRow title="Typy vazníků" selectable={true}></FormRow>
                </div>
            </div>
        </div>
    ];
}

export {JobInfo, JobInfoPath, JobInfoSettings};
