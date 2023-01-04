import React, { useEffect, useMemo, useState } from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import { GlobalFilter } from "@components/GlobalFilter";
import UseFetch from "@hooks/useFetch";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { useRouter } from "next/router";
import FeedbackModel from "@adminComponents/FeedbackModel";

const Reports = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [openAddFeedbackModal, setOpenAddFeedbackModal] = useState(false);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFeedbackModal = () => {
    setOpenAddFeedbackModal(!openAddFeedbackModal);
  };

  const fetchFeedbacks = async () => {
    const response = await UseFetch("GET", "/a/feedbacks/get").then(
      function ({ status, data }) {
        if (status === 401) return "not 200 status";
        data.map((feedback) => {
          if (feedback.isLive) {
            feedback.isLive = "Active";
          } else {
            feedback.isLive = "InActive";
          }
        });
        return data;
      }
    );

    if (response) {
      const feedbacks = response;
      setFeedbacks(feedbacks);
    }
  };

  const feedbacksData = useMemo(() => [...feedbacks], [feedbacks]);
  const feedbacksColumns = useMemo(
    () =>
      feedbacks[0]
        ? Object.keys(feedbacks[0]).map((key) => {
            if (key === "isLive")
              return {
                Header: key,
                accessor: key,
                Cell: ({ value }) => (
                  <span
                    className={`${
                      value === "Active"
                        ? "rounded p-0.5 bg-green-100 text-green-800"
                        : "rounded p-0.5 bg-red-100 text-red-800"
                    }`}
                  >
                    {value}
                  </span>
                ),
              };
            return { Header: key, accessor: key };
          })
        : [],
    [feedbacks]
  );

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Edit",
        Header: "Edit",
        Cell: ({ row }) => (
          <HiPencilAlt
            className="text-dark-purple w-full text-center cursor-pointer"
            onClick={() => {
              router.push(
                `/dashboard/admin/feedback?s=${row.values.semester}&f=${row.values.feedbackNo}&b=${row.values.batch}&d=${row.values.degree}&sc=${row.values.section}`
              );
            }}
          />
        ),
      },
      {
        id: "Delete",
        Header: "Delete",
        Cell: ({ row }) => (
          <HiTrash
            className="text-dark-purple w-full text-center cursor-pointer"
            onClick={() => {
              deleteFeedback(row.values);
            }}
          />
        ),
      },
    ]);
  };

  const tableInstance = useTable(
    {
      columns: feedbacksColumns,
      data: feedbacksData,
    },
    useGlobalFilter,
    tableHooks,
    useSortBy
  );

  const deleteFeedback = async (data) => {
    let body = {
      batch: data.batch,
      degree: data.degree,
      section: data.section,
      semester: data.semester,
      feedbackNo: data.feedbackNo,
    };
    const response = await UseFetch("POST", "/a/feedback/delete", body);
    fetchFeedbacks();
  };

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
    fetchFeedbacks();
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

      {openAddFeedbackModal ? (
        <FeedbackModel
          callback={handleFeedbackModal}
          fetchFeedbacks={fetchFeedbacks}
          isEdit={false}
        />
      ) : (
        ""
      )}

      {/* feedbacks */}
      <div className=" w-9/12 flex flex-row h-5 justify-between items-center">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={state.globalFilter}
        />
        <div className=" rounded-lg mt-5">
          <button
            onClick={() => {
              setOpenAddFeedbackModal(true);
            }}
            className="bg-dark-purple bg-opacity-30 
        py-2 px-4 rounded text-white shadow-md"
          >
            Add Feedback
          </button>
        </div>
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
