// components/common/Table.tsx
// import React from 'react';

interface Column<T> {
  key: keyof T | string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  dataSource: T[];
  loading?: boolean;
  rowKey: keyof T | ((record: T) => string);
  onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  selectedRowKeys?: string[];
  onSelectChange?: (selectedRowKeys: string[]) => void;
  className?: string;
}

export function Table<T>({
  columns,
  dataSource,
  loading = false,
  rowKey,
  onRow,
  pagination,
  selectedRowKeys = [],
  onSelectChange,
  className = '',
}: TableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return String(record[rowKey]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (onSelectChange) {
      if (checked) {
        const allKeys = dataSource.map((record, index) => getRowKey(record, index));
        onSelectChange(allKeys);
      } else {
        onSelectChange([]);
      }
    }
  };

  const handleSelectRow = (checked: boolean, record: T, index: number) => {
    if (onSelectChange) {
      const key = getRowKey(record, index);
      if (checked) {
        onSelectChange([...selectedRowKeys, key]);
      } else {
        onSelectChange(selectedRowKeys.filter(k => k !== key));
      }
    }
  };

  const isAllSelected = selectedRowKeys.length === dataSource.length && dataSource.length > 0;
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < dataSource.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#219ebc]"></div>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {onSelectChange && (
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-[#219ebc] focus:ring-[#219ebc]"
                  style={{ transform: isIndeterminate ? 'scale(1.1)' : 'scale(1)' }}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={String(column.key) + index}
                className={`px-4 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {dataSource.map((record, index) => {
            const key = getRowKey(record, index);
            const isSelected = selectedRowKeys.includes(key);
            const rowProps = onRow?.(record, index) || {};

            return (
              <tr
                key={key}
                className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                {...rowProps}
              >
                {onSelectChange && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectRow(e.target.checked, record, index)}
                      className="rounded border-gray-300 text-[#219ebc] focus:ring-[#219ebc]"
                    />
                  </td>
                )}
                {columns.map((column, colIndex) => {
                  const value = column.dataIndex ? record[column.dataIndex] : record;
                  const cellContent = column.render 
                    ? column.render(value, record, index)
                    : String(value || '');

                  return (
                    <td
                      key={String(column.key) + colIndex}
                      className={`px-4 py-3 text-${column.align || 'left'} text-sm text-gray-900`}
                    >
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-700">
            Showing {Math.min((pagination.current - 1) * pagination.pageSize + 1, pagination.total)} to{' '}
            {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
              disabled={pagination.current === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {pagination.current} of {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}




