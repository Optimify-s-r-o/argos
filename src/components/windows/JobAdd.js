import React from 'react';
import '../../styles/main.css';
import '../../styles/forms.css';
import TitleBar from '../TitleBar';
import FormRow from "../FormRow";

const title = 'Přidat zakázku';

const JobAddPath = '/job-add';

const JobAddSettings = {
    title: title
};

class JobAdd extends React.Component {
    render() {
        return [
            <TitleBar key="titleBar" title={title} icon={false}/>,
            <div key="content" className="row">
                <div className="column">
                    <div className="form-card">
                        <div className="form-card-header">
                            <div>Základní informace</div>
                        </div>
                        <FormRow title="Identifikace zakázky"><input type="text" value=""/></FormRow>
                        <FormRow title="Zákazník"><input type="text" value=""/></FormRow>
                        <FormRow title="Zahájení zakázky"><input type="date" value=""/></FormRow>
                        <FormRow title="Deadline"><input type="date" value=""/></FormRow>
                        <FormRow title="Přijato zákazníkem"><input type="checkbox"/></FormRow>
                        <FormRow border={false}>
                            <button className="btn btn-text" onClick={() => this.handleAddJob()}>Přidat zakázku</button>
                        </FormRow>


                        <div className="form-card-header">
                            Detailní informace
                        </div>
                        <FormRow title="Lokalita" selectable={true}></FormRow>
                        <FormRow title="Popis" selectable={true}></FormRow>
                        <FormRow title="Sněhová oblast" selectable={true}></FormRow>
                        <FormRow title="Zatížení" selectable={true}></FormRow>
                        <FormRow title="Typy vazníků" selectable={true}></FormRow>
                    </div>
                </div>
            </div>
        ];
    }

    handleAddJob() {
        // TODO
    }
}

export {JobAdd, JobAddPath, JobAddSettings};
