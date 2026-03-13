interface TableProps<T extends object> {
  columns: string[];
  data: T[];
  renderRow: (row: T) => React.ReactNode;
}

export default TableProps;