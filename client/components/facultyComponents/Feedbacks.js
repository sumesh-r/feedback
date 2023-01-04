import React, { useEffect, useMemo, useState } from "react";
import { useSortBy, useTable } from "react-table";
import UseFetch from "@hooks/useFetch";
import Loading from "@components/Loading";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { useRouter } from "next/router";
import { semesters } from "@utils/constants";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [openAddFeedbackModal, setOpenAddFeedbackModal] = useState(false);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isEven = (idx) => idx % 2 === 0;

  const fetchFeedbacks = async () => {
    setLoading(true);
    const response = await UseFetch("GET", "/advisor/feedbacks/get").then(
      function ({ status, data }) {
        if (status === 401) {
          router.push("/");
          return "not 200 status";
        }
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
      const details = {
        batch: feedbacks[0].batch,
        degree: feedbacks[0].degree,
        section: feedbacks[0].section,
      };
      setFeedbacks(feedbacks);
      setDetails(details);
    }
    setLoading(false);
  };

  const feedbacksData = useMemo(() => [...feedbacks], [feedbacks]);
  const feedbacksColumns = useMemo(
    () =>
      feedbacks[0]
        ? Object.keys(feedbacks[0])
            .filter((key) => key !== "createdAt")
            .filter((key) => key !== "batch")
            .filter((key) => key !== "degree")
            .filter((key) => key !== "section")
            .map((key) => {
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
                `/dashboard/advisor/feedback?s=${row.values.semester}&f=${row.values.feedbackNo}`
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

  const feedbacksTableInstance = useTable(
    {
      columns: feedbacksColumns,
      data: feedbacksData,
    },
    tableHooks,
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    feedbacksTableInstance;

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const deleteFeedback = async (data) => {
    let body = {
      batch: data.batch,
      degree: data.degree,
      section: data.section,
      semester: data.semester,
      feedbackNo: data.feedbackNo,
    };
    const response = await UseFetch("POST", "/advisor/feedback/delete", body);
    fetchFeedbacks();
  };

  const AddFeedbackModel = () => {
    const [data, setData] = useState({
      semester: "",
    });

    const [error, setError] = useState("");

    const handleChange = ({ currentTarget: input }) => {
      setData({ ...data, [input.name]: input.value });
    };

    const addFeedback = async (data) => {
      let body = {
        batch: details.batch,
        degree: details.degree,
        section: details.section,
        semester: data.semester,
      };
      const response = await UseFetch(
        "POST",
        "/advisor/feedback/add",
        body
      ).then(async function ({ status, data }) {
        if (status === 401) {
          router.push("/");
          return "not 200 status";
        } else if (status === 409) {
          return { eMessage: data.eMessage, path: "addfeedback" };
        } else if (status === 200) {
          setOpenAddFeedbackModal(false);
          return { Message: "feedback added", path: "addfeedback" };
        } else if (status != 200) {
          setError(data.eMessage);
          return data;
        }
      });
      setLoading(false);
      return response;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      if (data.semester === "Select" || data.semester === "") {
        setError("all fields should be filled");
        return;
      }

      await addFeedback(data);

      fetchFeedbacks();
    };

    return (
      <>
        {loading ? (
          <Loading light={true} />
        ) : (
          <div
            className="relative z-10"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            {/* background */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div
                className="flex min-h-full items-end justify-center p-4 text-center
           sm:items-center sm:p-0"
              >
                <div
                  className="relative transform overflow-hidden rounded-lg
             bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full 
             sm:max-w-sm flex justify-center"
                >
                  <div className="bg-white w-full px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <div className="flex items-center justify-between">
                          <h3
                            className="text-lg font-medium leading-6 text-dark-purple"
                            id="modal-title"
                          >
                            Add Feedback
                          </h3>
                          <span
                            className="text-2xl text-dark-purple cursor-pointer
                             mr-1"
                            onClick={(e) => {
                              setOpenAddFeedbackModal(false);
                            }}
                          >
                            x
                          </span>
                        </div>
                        {/* form */}
                        <div className="mt-2">
                          {error && (
                            <div className="mb-2 text-red-500">{error}</div>
                          )}
                          <form
                            onSubmit={handleSubmit}
                            className="w-full max-w-lg"
                          >
                            <div className="-mx-3">
                              {/* Batch */}
                              <div className="w-full px-3 mb-6 md:mb-3">
                                <label
                                  className="block uppercase tracking-wide
                               text-gray-700 text-xs font-bold mb-2"
                                  htmlFor="grid-Semester"
                                >
                                  Semester
                                </label>
                                <div className="relative">
                                  <select
                                    className="block appearance-none w-full
                                 bg-gray-200 border border-gray-200
                                  text-gray-700 py-3 px-4 pr-8 rounded 
                                  leading-tight focus:outline-none focus:bg-white
                                   focus:border-gray-500"
                                    id="grid-Batch"
                                    value={data.semester}
                                    onChange={handleChange}
                                    onClick={(e) => {
                                      setError("");
                                    }}
                                    name="semester"
                                  >
                                    <option>Select</option>
                                    {semesters.map((semester, idx) => (
                                      <option key={idx}>{semester}</option>
                                    ))}
                                  </select>
                                  <div
                                    className="pointer-events-none absolute inset-y-0
                               right-0 flex items-center px-2 text-gray-700"
                                  >
                                    <svg
                                      className="fill-current h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-gray-50 py-3 sm:flex sm:flex-row-reverse sm:-mx-6 sm:px-6">
                              <button
                                type="submit"
                                className="mt-3 inline-flex w-full justify-center rounded-md border
                 border-gray-300 bg-dark-purple opacity-70 text-white 
                 px-6 py-2 text-base font-medium shadow-sm
                  hover:bg-gray-600 focus:outline-none focus:ring-2
                   focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3
                    sm:w-auto sm:text-sm"
                              >
                                Add
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col items-center w-full pt-8">
      {openAddFeedbackModal ? <AddFeedbackModel /> : ""}
      <h1
        className="text-3xl flex justify-start w-10/12 mb-5 font-semibold
      text-dark-purple
      "
      >
        Feedbacks
      </h1>
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* basic details of feedbacks */}
          <div className="w-full flex justify-center">
            <div
              className="flex flex-col md:flex-row items-center
         w-9/12 justify-between"
            >
              <div className="flex items-center mb-4 md:mb-0">
                <label htmlFor="batch" className="mr-3">
                  Batch:
                </label>
                <textarea
                  className="outline-none py-1 px-2 rounded bg-white
                cursor-not-allowed resize-none"
                  rows={1}
                  name="batch"
                  id="batch"
                  value={details.batch}
                  readOnly
                />
              </div>

              <div className="flex items-center">
                <label htmlFor="Dept_&_sec" className="mr-3">
                  Class:{" "}
                </label>
                <textarea
                  className="outline-none py-1 px-2 rounded bg-white
                cursor-not-allowed resize-none"
                  rows={1}
                  name="Dept_&_sec"
                  id="Dept_&_sec"
                  value={`${details.degree} - ${details.section}`}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* feedbacks */}
          <div
            className={`flex
             items-center flex-col w-full `}
          >
            <div className=" w-9/12 flex flex-row justify-end items-center">
              <div className=" rounded-lg mt-10">
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
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          {column.render("Header")}
                          {column.isSorted
                            ? column.isSortedDesc
                              ? "▼"
                              : "▲"
                            : ""}
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
        </>
      )}
    </div>
  );
};

export default Feedbacks;
