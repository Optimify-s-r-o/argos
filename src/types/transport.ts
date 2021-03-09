import { SortOptions } from '../components/table';

export type TransportSort = Array<TransportSortProps>;

interface TransportSortProps {
  column: 'name'; // TODO
  direction: SortOptions;
}
