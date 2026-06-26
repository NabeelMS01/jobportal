import React from 'react';

export const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
    <table className="min-w-full divide-y divide-gray-200">
      {children}
    </table>
  </div>
);

export const Thead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50">
    <tr>{children}</tr>
  </thead>
);

export const Tbody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="bg-white divide-y divide-gray-200">
    {children}
  </tbody>
);

export const Tr = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <tr className={`hover:bg-gray-50 ${className}`}>
    {children}
  </tr>
);

export const Th = ({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' | 'center' }) => (
  <th className={`px-6 py-3 text-${align} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
    {children}
  </th>
);

export const Td = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`}>
    {children}
  </td>
);

export const TableLoading = ({ colSpan }: { colSpan: number }) => (
  <tr>
    <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-gray-500">
      Loading...
    </td>
  </tr>
);

export const TableEmpty = ({ colSpan, message = "No data found." }: { colSpan: number; message?: string }) => (
  <tr>
    <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-gray-500">
      {message}
    </td>
  </tr>
);
