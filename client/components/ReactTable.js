import React from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import { GlobalFilter } from "@components/GlobalFilter";

const ReactTable = ({ columns, data, noSearch, needBorder }) => {
  const isEven = (idx) => idx % 2 === 0;

  const tableInstance = useTable(
    {
      columns: columns,
      data: data,
    },
    useGlobalFilter,
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    state,
  } = tableInstance;

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        {!noSearch && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            setGlobalFilter={setGlobalFilter}
            globalFilter={state.globalFilter}
          />
        )}
      </div>
      {/* table */}
      <div className="w-full overflow-auto flex justify-start">
        <table
          className={`divide-y mt-10 w-3/4 divide-gray-200`}
          {...getTableProps()}
        >
          <thead
            className={`bg-gray-50 ${needBorder ? "border border-black" : ""}`}
          >
            {headerGroups.map((headerGroup, idx) => (
              <tr
                className={`${needBorder ? "border border-black" : ""}`}
                key={idx}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className={`px-8 py-3 text-center text-xs font-medium
                text-gray-500 uppercase ${
                  needBorder ? "border border-black" : ""
                }`}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            className={`bg-white divide-y divide-gray-200`}
            {...getTableBodyProps()}
          >
            {rows.map((row, idx) => {
              prepareRow(row);

              return (
                <tr
                  key={idx}
                  {...row.getRowProps()}
                  className={`${
                    isEven(idx)
                      ? "bg-dark-purple bg-opacity-30"
                      : "bg-light-white bg-opacity-30"
                  }
                  
                  `}
                >
                  {row.cells.map((cell, id) => (
                    <td
                      key={id}
                      className={`px-6 py-4 text-center ${
                        needBorder ? "border border-black" : ""
                      }`}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ReactTable;
