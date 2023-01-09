import React, { useEffect, useMemo, useState } from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import { GlobalFilter } from "@components/GlobalFilter";
import UseFetch from "@hooks/useFetch";
import { AiOutlineFullscreen } from "react-icons/ai";
import { useRouter } from "next/router";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const router = useRouter();

  const fetchReports = async () => {
    const response = await UseFetch("GET", "/a/reports/get").then(function ({
      status,
      data,
    }) {
      if (status === 401) return router.push("/");

      return data;
    });

    if (response) {
      const reports = response;
      setReports(reports);
    }
  };

  const reportsData = useMemo(() => [...reports], [reports]);
  const reportsColumns = useMemo(
    () =>
      reports[0]
        ? Object.keys(reports[0]).map((key) => {
            return { Header: key, accessor: key };
          })
        : [],
    [reports]
  );

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Open",
        Header: "Open",
        Cell: ({ row }) => (
          <AiOutlineFullscreen
            className="text-dark-purple w-full text-center cursor-pointer"
            onClick={() => {
              router.push(
                `/dashboard/admin/report?s=${row.values.semester}&f=${row.values.feedbackNo}&b=${row.values.batch}&d=${row.values.degree}&sc=${row.values.section}`
              );
            }}
          />
        ),
      },
    ]);
  };

  const tableInstance = useTable(
    {
      columns: reportsColumns,
      data: reportsData,
    },
    useGlobalFilter,
    tableHooks,
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

  useEffect(() => {
    fetchReports();
  }, []);

  const isEven = (idx) => idx % 2 === 0;

  return (
    <div className="flex flex-col items-center w-full pt-8">
      <h1
        className="text-3xl flex justify-start w-10/12 mb-5 font-semibold
      text-dark-purple
      "
      >
        Reports
      </h1>

      {/* feedbacks */}
      <div className=" w-9/12 flex flex-row h-5 justify-between items-center">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={state.globalFilter}
        />
      </div>
      {/* table */}
      <div className="w-full flex justify-center">
        <table
          className="divide-y m-10 w-3/4 divide-gray-200"
          {...getTableProps()}
        >
          <thead className="bg-gray-50">
            {headerGroups.map((headerGroup, idx) => (
              <tr key={idx} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className="px-8 py-3 text-center text-xs font-medium
                text-gray-500 uppercase"
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
            className="bg-white divide-y divide-gray-200"
            {...getTableBodyProps()}
          >
            {rows.map((row, idx) => {
              prepareRow(row);

              return (
                <tr
                  key={idx}
                  {...row.getRowProps()}
                  className={
                    isEven(idx)
                      ? "bg-dark-purple bg-opacity-30"
                      : "bg-light-white bg-opacity-30"
                  }
                >
                  {row.cells.map((cell, id) => (
                    <td
                      key={id}
                      className={`px-6 py-4 text-center`}
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
    </div>
  );
};

export default Reports;
