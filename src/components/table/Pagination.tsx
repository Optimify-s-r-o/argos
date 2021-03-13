import Select from '../forms/Select';
import styled from 'styled-components';
import Submit from '../forms/Submit';
//import { useTranslation } from 'react-i18next';

interface OwnProps {
	pageSize?: number;
	currentPageSize: number;
	firstRecordOnPage: number;
	lastRecordOnPage: number;
	currentPage: number;
	totalPages: number;
	totalRecords: number;
	sort?: string | null;
	onPageRequired: (page: any) => void;
	onSizeChanged: (newSize: number) => void;
	handleSelectedPageSize: (newSize: number) => void;
}

const Pagination = (props: OwnProps) => {
	const {
		pageSize,
		firstRecordOnPage,
		lastRecordOnPage,
		currentPage,
		totalPages,
		totalRecords,
		onPageRequired,
		sort,
		onSizeChanged,
		handleSelectedPageSize,
	} = props;

	//const { t } = useTranslation();

	const handlePageSize = (value: any, actionMeta: any) => {
		onSizeChanged(value.value);
		handleSelectedPageSize(value.value);
	};

	return (
		<PaginationWrapper>
			<div>
				Zobrazeny záznamy {firstRecordOnPage} až {lastRecordOnPage} z{" "}
				{totalRecords}. Strana {currentPage} z {totalPages}.
			</div>

			<div>
				{currentPage > 2 ? (
					<Submit
						onClick={() => {
							onPageRequired({
								PageSize: pageSize,
								Page: 0,
								Sort: sort,
							});
						}}
					>
						1
					</Submit>
				) : (
					""
				)}

				{currentPage > 3 ? <Submit disabled>...</Submit> : ""}

				{currentPage !== 1 ? (
					<Submit
						onClick={() => {
							onPageRequired({
								PageSize: pageSize,
								Page: currentPage - 2,
								Sort: sort,
							});
						}}
					>
						{currentPage - 1}
					</Submit>
				) : (
					""
				)}

				<Submit>{currentPage}</Submit>

				{currentPage !== totalPages ? (
					<Submit
						onClick={() => {
							onPageRequired({
								PageSize: pageSize,
								Page: currentPage,
								Sort: sort,
							});
						}}
					>
						{currentPage + 1}
					</Submit>
				) : (
					""
				)}

				{currentPage + 2 < totalPages ? <Submit disabled>...</Submit> : ""}

				{currentPage + 1 < totalPages ? (
					<Submit
						onClick={() => {
							onPageRequired({
								PageSize: pageSize,
								Page: totalPages - 1,
								Sort: sort,
							});
						}}
					>
						{totalPages}
					</Submit>
				) : (
					""
				)}
			</div>
			<div>
				Záznamů k zobrazení:
				<Select
					value={{ value: pageSize, label: pageSize }}
					options={[
						{ value: 5, label: "5" },
						{ value: 10, label: "10" },
						{ value: 25, label: "25" },
						{ value: 50, label: "50" },
					]}
					onChange={handlePageSize}
					align={"center"}
				/>
			</div>
		</PaginationWrapper>
	);
};

export default Pagination;

const PaginationWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;

	padding: 0 16px;

	font-size: 0.75em;

	> div {
		flex: 1 0 33%;

		&:nth-child(2) {
			text-align: center;
		}

		&:last-child {
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;

			> div {
				width: 120px;

				margin-left: 8px;
			}
		}
	}
`;
