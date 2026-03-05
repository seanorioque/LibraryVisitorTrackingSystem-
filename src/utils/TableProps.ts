import Table from "../components/Table";

interface TableProps<T> {
  columns: string[];
  data: T[];
  renderRow: (row: T) => React.ReactNode;
}

export default TableProps