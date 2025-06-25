import React, { useState } from 'react';

const CRUDTable = ({ data, columns, actions }) => {
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    
    // For sorting objects, you might need more complex logic based on the column's 'render' or a specific sortable key within the object.
    // For now, simple direct comparison might work for primitives.
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    // Basic sorting for primitive values
    if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center">
                  {column.label}
                  {column.sortable && sortColumn === column.key && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-gray-50">{columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render // If a render function is provided for the column
                    ? column.render(item) // Use it to render the cell content
                    : column.key === 'status' ? ( // Otherwise, if it's the status column, apply specific styling
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item[column.key] === 'available' ? 'bg-green-100 text-green-800' :
                          item[column.key] === 'occupied' ? 'bg-red-100 text-red-800' :
                          ['maintenance', 'out_of_order'].includes(item[column.key]) ? 'bg-yellow-100 text-yellow-800' :
                          item[column.key] === 'cleaning' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item[column.key]}
                        </span>
                    ) : (
                      item[column.key] // If no render function and not status, render directly
                    )
                  }
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  {actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      onClick={() => action.onClick(item)}
                      className={`p-1 rounded hover:bg-gray-100 ${action.className}`}
                      title={action.label}
                    >
                      <action.icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CRUDTable;