import ExternalTable from '../../../table/ExternalTable';
import jobsGet from '../../../../api/jobs/get';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getLocalizedDate } from '../../../../utils/days';
import { SettingsType } from '../../../../types/settings';
import { useTranslation } from 'react-i18next';

interface JobsProps {
	token: string;
	settings: SettingsType;
}

const mapStateToProps = (state) => {
	return {
		token: state.token,
		settings: state.settings,
	};
};

const JobsComponent = (props: JobsProps) => {
	const { t, i18n } = useTranslation();
	const [data, setData] = useState({
		page: 0,
		limit: 0,
		total: 0,
		objects: [],
	});

	useEffect(() => {
		jobsGet(
			props.token,
			(res) => {
				setData(res.body);
			},
			1,
			25
		);
	}, [props.token]);

	return (
		<>
			<ExternalTable
				headers={[
					t("jobForms:common.jobIdentification"),
					t("jobForms:common.location"),
					t("jobForms:common.description"),
					t("jobForms:common.contractDateFrom"),
					t("jobForms:common.contractDateTo"),
					t("jobForms:common.deadline"),
				]}
				data={data.objects.map((job: any) => [
					// TODO type
					job.name,
					job.city,
					job.type,
					getLocalizedDate(
						new Date(Date.parse(job.contractStart)),
						i18n.language
					),
					getLocalizedDate(
						new Date(Date.parse(job.contractEnd)),
						i18n.language
					),
					getLocalizedDate(new Date(Date.parse(job.deadline)), i18n.language),
					job,
				])}
				renderers={[
					(value) => value,
					(value) => value,
					(value) => value,
					(value) => value,
					(value) => value,
					(value) => value,
				]}
				columnNames={[
					"name",
					"location",
					"description",
					"from",
					"to",
					"deadline",
				]}
				sortable={[true, true, false, true, true, true]}
				onPageRequired={() => null}
				pageSize={25}
				firstRecordOnPage={data.page * data.limit + 1}
				lastRecordOnPage={data.page * data.limit + data.objects.length}
				totalRecords={data.total}
				currentPage={data.page + 1}
				totalPages={Math.ceil(data.total / data.limit)}
			/>
		</>
	);
};

const Jobs = connect(mapStateToProps)(JobsComponent);

export default Jobs;
