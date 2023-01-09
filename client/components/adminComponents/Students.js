import React, { useMemo, useState } from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import { GlobalFilter } from "@components/GlobalFilter";
import UseFetch from "@hooks/useFetch";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { batches, degrees, sections } from "@utils/constants";
import StudentModel from "@components/adminComponents/StudentModel";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [openStudentModel, setOpenStudentModel] = useState(false);
  const [editStudentModel, setEditStudentModel] = useState(false);
  const [editData, setEditData] = useState({});
  const [batch, setBatch] = useState();
  const [degree, setDegree] = useState();
  const [section, setSection] = useState();

  const handleStudentModel = () => {
    setOpenStudentModel(!openStudentModel);
  };

  const handleEditStudentModel = () => {
    setEditStudentModel(!editStudentModel);
  };

  const fetchStudents = async () => {
    const body = {
      batch: batch,
      degree: degree,
      section: section,
    };

    const response = await UseFetch("POST", "/a/students/get", body).then(
      function ({ status, data }) {
        if (status === 401) return "not 200 status";
        return data;
      }
    );

    if (!response[0]) {
      const students = [];
      setStudents(students);
    }

    if (response) {
      const students = response;
      setStudents(students);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleDeleteStudent = async (regNo) => {
    const body = { regNo: regNo };
    const response = await UseFetch(
      "POST",
      "/a/student/delete",
      body
    ).then(function ({ status, data }) {
      if (status === 401) {
        router.push("/");
        return "not 200 status";
      }
      if (status === 200) {
        fetchStudents();
      }
      return data;
    });
  };

  const studentsData = useMemo(() => [...students], [students]);
  const studentsColumns = useMemo(
    () => [
      {
        Header: "Register Number",
        accessor: "regNo",
      },
      {
        Header: "Student Name",
        accessor: "name",
      },
      {
        Header: "Date of Birth",
        accessor: "dob",
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
    [students]
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
                regNo: row.values.regNo,
                name: row.values.name,
                dob: row.values.dob,
                degree: row.values.degree,
                batch: row.values.batch,
                section: row.values.section,
              });
              handleEditStudentModel();
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
              handleDeleteStudent(row.values.regNo);
            }}
            className="text-dark-purple w-full text-center cursor-pointer"
          />
        ),
      },
    ]);
  };

  const tableInstance = useTable(
    {
      columns: studentsColumns,
      data: studentsData,
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

  const isEven = (idx) => idx % 2 === 0;

  return (
    <div className="flex flex-col items-center w-full pt-8">
      <h1
        className="text-3xl flex justify-start w-10/12 mb-5 font-semibold
      text-dark-purple
      "
      >
        Students
      </h1>

      {openStudentModel ? (
        <StudentModel
          isEdit={false}
          // details={details}
          fetchStudents={fetchStudents}
          callback={handleStudentModel}
        />
      ) : (
        ""
      )}

      {editStudentModel ? (
        <StudentModel
          isEdit={true}
          // details={details}
          fetchStudents={fetchStudents}
          editData={editData}
          callback={handleEditStudentModel}
        />
      ) : (
        ""
      )}

      <form
        onSubmit={handleSubmit}
        className=" w-9/12 flex flex-row justify-between  "
      >
        {/* Batch */}
        <div className="flex items-center mb-4 md:mb-0">
          <label
            className="block uppercase tracking-wide
        text-gray-700 text-xs font-bold mb-2 mr-2"
            htmlFor="grid-degree"
          >
            Batch
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full
          bg-gray-200 border border-gray-200
          text-gray-700 py-3 px-4 pr-8 rounded 
          leading-tight focus:outline-none focus:bg-white
            focus:border-gray-500"
              id="grid-degree"
              name="degree"
              value={batch}
              onClick={(e) => {
                setBatch(e.target.value);
              }}
              // ref={batchRef}
            >
              <option>Select</option>
              {batches.map((batch, idx) => (
                <option key={idx}>{batch}</option>
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

        {/* Degree */}
        <div className="flex items-center mb-4 md:mb-0">
          <label
            className="block uppercase tracking-wide
        text-gray-700 text-xs font-bold mb-2 mr-2"
            htmlFor="grid-degree"
          >
            Degree
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full
          bg-gray-200 border border-gray-200
          text-gray-700 py-3 px-4 pr-8 rounded 
          leading-tight focus:outline-none focus:bg-white
            focus:border-gray-500"
              id="grid-degree"
              name="degree"
              value={degree}
              onClick={(e) => {
                setDegree(e.target.value);
              }}
            >
              <option>Select</option>
              {degrees.map((degree, idx) => (
                <option key={idx}>{degree}</option>
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

        {/* Section */}
        <div className="flex items-center mb-4 md:mb-0">
          <label
            className="block uppercase tracking-wide
        text-gray-700 text-xs font-bold mb-2 mr-2"
            htmlFor="grid-degree"
          >
            Section
          </label>
          <div className="relative">
            <select
              className="block appearance-none w-full
          bg-gray-200 border border-gray-200
          text-gray-700 py-3 px-4 pr-8 rounded 
          leading-tight focus:outline-none focus:bg-white
            focus:border-gray-500"
              id="grid-degree"
              name="degree"
              value={section}
              onClick={(e) => {
                setSection(e.target.value);
              }}
            >
              <option>Select</option>
              {sections.map((section, idx) => (
                <option key={idx}>{section}</option>
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

        <button
          type="submit"
          className="bg-dark-purple bg-opacity-30 
        py-2 px-4 text-white shadow-md my-1 rounded-l"
        >
          Submit
        </button>
      </form>

      {/* students */}
      <div className=" w-9/12 flex flex-row justify-between items-center">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={state.globalFilter}
        />
        {/* add students */}
        <div className=" rounded-lg mt-5">
          <button
            onClick={() => {
              handleStudentModel();
            }}
            className="bg-dark-purple bg-opacity-30 
        py-2 px-4 text-white shadow-md"
          >
            Add Student
          </button>
        </div>
      </div>
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

export default Students;
