import DateRangePicker from '../forms/DateRangePicker';
import FormRow from '../forms/FormRow';
import Select from '../forms/Select';
import TitleBar from '../TitleBar';
import { FormCard, FormColumn } from '../../styles/forms';
import { Row } from '../../styles/global';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/forms.css';
import '../../styles/main.css';

const title = "documentForms:generate.titleBar";

const GenerateDocumentPath = "/generate-document";

const GenerateDocumentSettings = {
	title: title,
};

const GenerateDocument = () => {
	let defaultEndDate = new Date();
	defaultEndDate.setDate(defaultEndDate.getDate() + 6);

	const [template, setTemplate] = useState(null);
	const [dates, setDates] = useState([new Date(), defaultEndDate]);
	const { t } = useTranslation();

	const handleDatesChange = (event) => {
		const value = event.target.value;

		setDates(value);
	};

	const handleSelectChange = (option) => {
		setTemplate(option);
	};

	const handleGenerateDocument = () => {
		// TODO
	};

	return (
		<>
			<TitleBar title={t(title)} icon={false} />
			<Row>
				<FormColumn>
					<FormCard>
						<FormRow title={t("documentForms:generate.template")}>
							<Select
								value={template}
								onChange={handleSelectChange}
								options={[
									{
										label: t("documentForms:template.transportOverview"),
										value: "transportOverview",
									},
									{
										label: t("documentForms:template.productionOverview"),
										value: "productionOverview",
									},
									{
										label: t("documentForms:template.trussOverview"),
										value: "trussOverview",
									},
								]}
							/>
						</FormRow>

						<FormRow title={t("documentForms:generate.dates")}>
							<DateRangePicker
								name="dates"
								value={dates}
								onChange={handleDatesChange}
							/>
						</FormRow>

						<FormRow border={false}>
							<button
								className="btn btn-text"
								onClick={() => handleGenerateDocument()}
							>
								{t("documentForms:generate.generate")}
							</button>
						</FormRow>
					</FormCard>
				</FormColumn>
			</Row>
		</>
	);
};

export { GenerateDocument, GenerateDocumentPath, GenerateDocumentSettings };
