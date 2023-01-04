import React, { useEffect, useMemo, useState } from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import { GlobalFilter } from "@components/GlobalFilter";
import UseFetch from "@hooks/useFetch";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import AdvisorModel from "@adminComponents/AdvisorModel"


const Advisors = () => {
  const [advisors, setAdvisors] = useState([]);
  const [openAdvisorModel, setOpenAdvisorModel] = useState(false);
  const [editAdvisorModel, setEditAdvisorModel] = useState(false);
  const [editData, setEditData] = useState({});

  const handleAdvisorModel = () => {
    setOpenAdvisorModel(!openAdvisorModel)
  }
  const handleEditAdvisorModel = () => {
    setEditAdvisorModel(!editAdvisorModel)
  }

  const handleDeleteAdvisor = async (userName) => {
    const body = { userName: userName };
    const response = await UseFetch(
      "POST",
      "/a/advisor/delete",
      body
    ).then(function ({ status, data }) {
      if (status === 401) {
        router.push("/");
        return "not 200 status";
      }
      if (status === 200) {
        fetchAdvisors();
      }
      return data;
    });
  }

  const fetchAdvisors = async () => {
    const response = await UseFetch("GET", "/a/advisors/get").then(function ({
      status,
      data,
    }) {
      if (status ===401) {
          router.push("/")
          return ""
      }
      return data;
    });

    if (response) {
      const advisors = response;
      setAdvisors(advisors);
    }
  };

  const advisorsData = useMemo(() => [...advisors], [advisors]);
  const advisorsColumns = useMemo(
    () => [
      {
        Header: "User Name",
        accessor: "userName",
      },
      {
        Header: "Batch",
        accessor: "batch",
      },
      {
        Header: "Degree",
        accessor: "degree",
      },
      {
        Header: "Section",
        accessor: "section",
      },
    ],
    [advisors]
  );

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "edit",
        Header: "Edit",
        Cell: ({ row }) => (
          <HiPencilAlt
            onClick={() => {
              setEditData({
                userName: row.values.userName,
                degree: row.values.degree,
                batch: row.values.batch,
                section: row.values.section,
              });
              handleEditAdvisorModel();
            }}
            className="text-dark-purple w-full text-center cursor-pointer"
          />
        ),
      },
      {
        id: "delete",
        Header: "Delete",
        Cell: ({ row }) => (
          <HiTrash
            onClick={() => {
              handleDeleteAdvisor(row.values.userName);
            }}
            className="text-dark-purple w-full text-center cursor-pointer"
          />
        ),
      },
    ]);
  };

  const tableInstance = useTable(
    {
      columns: advisorsColumns,
      data: advisorsData,
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
    fetchAdvisors();
  }, []);

  const isEven = (idx) => idx % 2 === 0;

  return (
    <div className="flex flex-col items-center w-full pt-8">
      <h1
        className="text-3xl flex justify-start w-10/12 mb-5 font-semibold
      text-dark-purple
      "
      >
        Advisors
      </h1>

      {openAdvisorModel ? (
        <AdvisorModel
          isEdit={false}
          fetchAdvisors={fetchAdvisors}
          callback={handleAdvisorModel}
        />
      ) : (
        ""
      )}

      {editAdvisorModel ? (
        <AdvisorModel
          isEdit={true}
          fetchAdvisors={fetchAdvisors}
          editData={editData}
          callback={handleEditAdvisorModel}
        />
      ) : (
        ""
      )}

      {/* feedbacks */}
      <div className=" w-9/12 flex flex-row justify-between items-center">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={state.globalFilter}
        />
        {/* add advisors */}
        <div className=" rounded-lg mt-5">
          <button
            onClick={() => {
              handleAdvisorModel();
            }}
            className="bg-dark-purple bg-opacity-30 
        py-2 px-4 text-white shadow-md"
          >
            Add Advisors
          </button>
        </div>
      </div>
      {/* table */}
      <div className="w-full flex justify-center">
        <table
          className="divide-y mt-7 m-10 w-3/4 divide-gray-200"
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

export default Advisors;
