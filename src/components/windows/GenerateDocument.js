import React from 'react';
import '../../styles/main.css';
import '../../styles/forms.css';
import TitleBar from '../TitleBar';
import FormRow from '../FormRow';
import { withTranslation } from 'react-i18next';
import Select from '../forms/Select';
import DateRangePicker from '../forms/DateRangePicker';

const title = 'documentForms:generate.titleBar';

const GenerateDocumentPath = '/generate-document';

const GenerateDocumentSettings = {
    title: title
};

class GenerateDocument extends React.Component {
    constructor(props) {
        super(props);

        let defaultEndDate = new Date();
        defaultEndDate.setDate(defaultEndDate.getDate() + 6)

        this.state = {
            template: null,
            dates: [new Date(), defaultEndDate],
            isCalendarDatesOpen: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSelectChange(option) {
        this.setState({template: option});
    }

    handleGenerateDocument() {
        // TODO
    }

    render() {
        const { t } = this.props;
        return [
            <TitleBar key="titleBar" title={t(title)} icon={false}/>,
            <div key="content" className="row">
                <div className="column">
                    <div className="form-card">
                        <FormRow title={t('documentForms:generate.template')}>
                            <Select
                                value={this.state.template}
                                onChange={this.handleSelectChange}
                                options={[
                                    {label: t('documentForms:template.transportOverview'), value: 'transportOverview'},
                                    {label: t('documentForms:template.productionOverview'), value: 'productionOverview'},
                                    {label: t('documentForms:template.trussOverview'), value: 'trussOverview'},
                                ]}
                            />
                        </FormRow>

                        <FormRow title={t('documentForms:generate.dates')}>
                            <DateRangePicker name="dates" value={this.state.dates} onChange={this.handleChange}/>
                        </FormRow>

                        <FormRow border={false}>
                            <button className="btn btn-text" onClick={() => this.handleGenerateDocument()}>{t('documentForms:generate.generate')}</button>
                        </FormRow>
                    </div>
                </div>
            </div>
        ];
    }
}

GenerateDocument = withTranslation()(GenerateDocument);

export {GenerateDocument, GenerateDocumentPath, GenerateDocumentSettings};
