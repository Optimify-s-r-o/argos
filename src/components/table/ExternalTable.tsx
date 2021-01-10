import Pagination from './Pagination';
import React from 'react';
import styled from 'styled-components';
import { ScrollableTable, SortOptions, SortType } from '.';
//import { useTranslation } from 'react-i18next';

interface PageProps {
  page: number;
  pageSize: number;
  sort: any;
}

interface OwnProps {
  headers: Array<string>;
  data: Array<any>;
  renderers: Array<(value: any, key?: number, parent?: any) => any>;
  sortable?: Array<boolean>;
  defaultPageSize?: number;
  columnNames: string[];
  onPageRequired: (requiredPage: PageProps) => void;
  pageSize: number;
  firstRecordOnPage: number;
  lastRecordOnPage: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  isLoading?: boolean;
}

const ExternalTable = (props: OwnProps) => {
  const {
    headers,
    data,
    renderers,
    sortable,
    defaultPageSize,
    columnNames,
    onPageRequired,
    pageSize,
    firstRecordOnPage,
    lastRecordOnPage,
    currentPage,
    totalPages,
    totalRecords,
    isLoading,
  } = props;

  const [selectedPageSize, setSelectedPageSize] = React.useState(
    defaultPageSize ? defaultPageSize : 25
  );
  const [sortString, setSortString] = React.useState<string | null>();
  const [sort, setSort] = React.useState<SortOptions[]>();
  const [sortOrder, setSortOrder] = React.useState<number[]>();
  //const { t } = useTranslation();

  const onSort = (sortOptions: SortOptions[], sortOrder: number[]) => {
    onSortHelper(columnNames, sortOptions, sortOrder, (sortString) => {
      setSortString(sortString);
      setSort(sortOptions);
      setSortOrder(sortOrder);
      onPageRequired({
        page: 0,
        pageSize: selectedPageSize,
        sort: sortString,
      });
    });
  };

  const handleSelectedPageSize = (newSize: number) => {
    selectedPageSize &&
      onPageRequired({
        page: 0,
        pageSize: newSize,
        sort: sortString,
      });
  };

  return (
    <>
      <HorizontalLine />
      <LoadedWrapper isLoading={isLoading}>
        <Pagination
          sort={sortString}
          pageSize={selectedPageSize}
          currentPageSize={pageSize}
          firstRecordOnPage={firstRecordOnPage}
          lastRecordOnPage={lastRecordOnPage}
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageRequired={onPageRequired}
          onSizeChanged={setSelectedPageSize}
          handleSelectedPageSize={handleSelectedPageSize}
        />
        <ScrollableTable
          headers={headers}
          data={data}
          renderers={renderers}
          sortable={sortable}
          sortType={SortType.External}
          onSort={onSort}
          initialSort={sort}
          initialSortOrder={sortOrder}
        />
        <HorizontalLine />
        <Pagination
          sort={sortString}
          pageSize={selectedPageSize}
          currentPageSize={pageSize}
          firstRecordOnPage={firstRecordOnPage}
          lastRecordOnPage={lastRecordOnPage}
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageRequired={onPageRequired}
          onSizeChanged={setSelectedPageSize}
          handleSelectedPageSize={handleSelectedPageSize}
        />
      </LoadedWrapper>
      <LoadingWrapper isLoading={isLoading}>TODO</LoadingWrapper>
    </>
  );
};

const onSortHelper = (
  checked: string[],
  sortOptions: SortOptions[],
  sortOrder: number[],
  callback: (sortString: string | null) => void
) => {
  let sortString: string | null = '';
  sortOrder.forEach((key: number) => {
    const value = sortOptions[key];
    if (value === SortOptions.Asc || value === SortOptions.Desc)
      sortString +=
        checked[key] + '+' + (value === SortOptions.Asc ? 'asc' : 'desc') + ',';
  });
  if (sortString.length > 0)
    sortString = sortString.substr(0, sortString.length - 1);
  else sortString = null;
  callback(sortString);
};

export default ExternalTable;

const LoadedWrapper = styled.div`
  display: ${(props) => (props.isLoading ? 'none' : 'block')};
`;

const LoadingWrapper = styled.div`
  display: ${(props) => (props.isLoading ? 'block' : 'none')};
`;

const HorizontalLine = styled.div`
  height: 1px;
  background-color: ${(props) => props.theme.colors.sectionsDivider};
`;
