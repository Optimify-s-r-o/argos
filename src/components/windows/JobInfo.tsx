import FormRow from '../forms/FormRow';
import TitleBar from '../TitleBar';
import { FormCard, FormCardHeader, FormColumn } from '../../styles/forms';
import { Row } from '../../styles/global';
import '../../styles/forms.css';
import '../../styles/main.css';

const title = "Informace o zakázce";

const JobInfoPath = (id) => {
	return "/job-info/" + id;
};

const JobInfoSettings = {
	title: title,
};

const JobInfo = () => {
	return (
		<>
			<TitleBar title={title} icon={false} />
			<Row>
				<FormColumn>
					<FormCard>
						<FormCardHeader>Základní informace</FormCardHeader>

						<FormRow title="Identifikace zakázky" selectable={true}>
							O123
						</FormRow>
						<FormRow title="Zákazník">
							<input type="text" value="Novák" />
						</FormRow>
						<FormRow title="Zahájení zakázky">
							<input type="date" value="2019-08-01" />
						</FormRow>
						<FormRow title="Deadline">
							<input type="date" value="2019-08-30" />
						</FormRow>
						<FormRow title="Přijato zákazníkem">
							<input type="checkbox" />
						</FormRow>
						<FormRow border={false}>
							<button className="btn btn-text">Uložit změny</button>
						</FormRow>

						<div className="form-card-header">Detailní informace</div>
						<FormRow title="Lokalita" selectable={true}>
							Praha
						</FormRow>
						<FormRow title="Popis" selectable={true}>
							RD Novák
						</FormRow>
						<FormRow title="Sněhová oblast" selectable={true}></FormRow>
						<FormRow title="Zatížení" selectable={true}></FormRow>
						<FormRow title="Typy vazníků" selectable={true}></FormRow>
					</FormCard>
				</FormColumn>
			</Row>
		</>
	);
};

export { JobInfo, JobInfoPath, JobInfoSettings };
