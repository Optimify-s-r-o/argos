import ExternalTable from '../../../table/ExternalTable';
import getTransports from '../../../../api/transports/get';
import { connect } from 'react-redux';
import { SettingsType } from '../../../../types/settings';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TransportProps {
	token: string;
	settings: SettingsType;
}

const mapStateToProps = (state) => {
	return {
		token: state.token,
		settings: state.settings,
	};
};

const TransportsComponent = (props: TransportProps) => {
	const { t } = useTranslation();
	const [data, setData] = useState({
		page: 0,
		limit: 0,
		total: 0,
		objects: [],
	});

	useEffect(() => {
		getTransports(
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
				headers={[t("name")]}
				data={data.objects.map((transport: any) => [
					// TODO type
					transport.name,
					transport,
				])}
				renderers={[(value) => value]}
				columnNames={["name"]}
				sortable={[true]}
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

const Transports = connect(mapStateToProps)(TransportsComponent);

export default Transports;
