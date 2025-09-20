'use client';

import React, { useState } from 'react';
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

// Mock data fetching function
const fetchUsers = async (): Promise<any[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User' },
  ];
};

// Column definitions for TanStack Table
const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
];

const TanstackExample = () => {
  // TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // TanStack Table
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>TanStack Table and Query Example</h1>
      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    style={{ 
                      border: '1px solid #ddd', 
                      padding: '8px', 
                      textAlign: 'left',
                      backgroundColor: '#f2f2f2'
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    style={{ 
                      border: '1px solid #ddd', 
                      padding: '8px' 
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            style={{ marginRight: '5px' }}
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
          <span style={{ marginLeft: '10px' }}>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TanstackExample;