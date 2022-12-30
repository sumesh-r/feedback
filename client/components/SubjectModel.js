import React, { useState } from "react";
import Loading from "@components/Loading";
import { departments, facultyPositions } from "@utils/constants";

const SubjectModel = ({
  callback, // to close the model
  handleChangeSubject,
  subjects,
  electiveSubjects,
  isElective,
  subjectCode,
  regNo,
  subjectName,
  faculty,
  facultyDepartment,
  facultyPosition,
}) => {
  if (!electiveSubjects) {
    electiveSubjects = [];
  }
  const [data, setData] = useState(
    isElective
      ? {
          regNo: regNo ? regNo : "",
          subjectCode: subjectCode ? subjectCode : "",
          subjectName: subjectName ? subjectName : "",
          faculty: faculty ? faculty : "",
          facultyPosition: facultyPosition ? facultyPosition : "",
          facultyDepartment: facultyDepartment ? facultyDepartment : "",
        }
      : {
          subjectCode: subjectCode ? subjectCode : "",
          subjectName: subjectName ? subjectName : "",
          faculty: faculty ? faculty : "",
          facultyPosition: facultyPosition ? facultyPosition : "",
          facultyDepartment: facultyDepartment ? facultyDepartment : "",
        }
  );
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (isElective && !data.regNo) {
      setError("all fields should be filled");
      return;
    }
    if (
      !data.subjectCode ||
      !data.subjectName ||
      !data.faculty ||
      data.facultyPosition === "" ||
      data.facultyPosition === "Select" ||
      data.facultyDepartment === "" ||
      data.facultyDepartment === "Select"
    ) {
      setError("all fields should be filled");
      return;
    }
    if (data.subjectCode.length < 8) {
      setError("Subject Code should have 8 characters");
      return;
    }
    if (data.subjectName.length < 8) {
      setError("Subject Name should have 5 characters");
      return;
    }

    const newSubject = isElective
      ? {
          subjectCode: data.subjectCode.toUpperCase(),
          regNo: Number(data.regNo),
          subjectName: data.subjectName,
          faculty: data.faculty,
          facultyPosition: data.facultyPosition,
          facultyDepartment: data.facultyDepartment,
        }
      : {
          subjectCode: data.subjectCode.toUpperCase(),
          subjectName: data.subjectName,
          faculty: data.faculty,
          facultyPosition: data.facultyPosition,
          facultyDepartment: data.facultyDepartment,
        };

    const alreadyExists = false;

    const existingSubjects = [...subjects, ...electiveSubjects];

    existingSubjects.map((subject) => {
      if (subject.subjectCode === newSubject.subjectCode) {
        alreadyExists = true;
        return;
      }
    });
    if (alreadyExists) {
      setError("Already Exists");
      return;
    }
    await handleChangeSubject(newSubject);
    callback();
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
             sm:max-w-lg"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <div className="flex items-center justify-between">
                        <h3
                          className="text-lg font-medium leading-6 text-dark-purple"
                          id="modal-title"
                        >
                          {isElective ? "Add Elective Subject" : "Add Subject"}
                        </h3>
                        <span
                          className="text-2xl text-dark-purple cursor-pointer
                             mr-1"
                          onClick={() => {
                            callback();
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
                          <div className="flex flex-row -mx-3 mb-3">
                            {/* Register Number */}
                            {isElective ? (
                              <div className="w-full px-3 mb-6 md:mb-0">
                                <label
                                  className="block uppercase tracking-wide text-gray-700
                               text-xs font-bold mb-2"
                                  htmlFor="grid-regno"
                                >
                                  Register Number
                                </label>
                                <input
                                  className="appearance-none block w-full bg-gray-200
                               text-gray-700 border  rounded
                                py-3 px-4 mb-3 leading-tight focus:outline-none
                                 focus:bg-white"
                                  id="grid-regno"
                                  value={data.regNo}
                                  onClick={(e) => {
                                    setError("");
                                  }}
                                  onChange={handleChange}
                                  name="regNo"
                                  type="text"
                                  placeholder="20101044"
                                />
                              </div>
                            ) : (
                              ""
                            )}

                            {/* Subject Code */}
                            <div className="w-full px-3 mb-6 md:mb-0">
                              <label
                                className="block uppercase tracking-wide text-gray-700
                               text-xs font-bold mb-2"
                                htmlFor="grid-subject-code"
                              >
                                subject code
                              </label>
                              <input
                                className="appearance-none block w-full bg-gray-200
                               text-gray-700 border  rounded
                                py-3 px-4 mb-3 leading-tight focus:outline-none
                                 focus:bg-white"
                                id="grid-subject-code"
                                value={data.subjectCode}
                                onClick={(e) => {
                                  setError("");
                                }}
                                onChange={handleChange}
                                name="subjectCode"
                                type="text"
                                placeholder="19AA1234"
                              />
                            </div>

                            {/* Subject Name */}
                            <div className="w-full px-3 mb-6 md:mb-0">
                              <label
                                className="block uppercase tracking-wide text-gray-700
                               text-xs font-bold mb-2"
                                htmlFor="grid-subject-name"
                              >
                                subject Name
                              </label>
                              <input
                                className="appearance-none block w-full bg-gray-200
                               text-gray-700 border rounded
                                py-3 px-4 mb-3 leading-tight focus:outline-none
                                 focus:bg-white"
                                id="grid-subject-name"
                                value={data.subjectName}
                                onChange={handleChange}
                                onClick={(e) => {
                                  setError(null);
                                }}
                                name="subjectName"
                                type="text"
                                placeholder="Programming"
                              />
                              {/* <p className="text-red-500 text-xs italic">
                              Please fill out this field.
                            </p> */}
                            </div>
                          </div>

                          <div className="flex flex-row -mx-3 mb-3">
                            {/* Faculty Name */}
                            <div className="w-full px-3 md:mb-0">
                              <label
                                className="block uppercase tracking-wide text-gray-700
                               text-xs font-bold mb-2"
                                htmlFor="grid-faculty-name"
                              >
                                faculty Name
                              </label>
                              <input
                                className="appearance-none block w-full bg-gray-200
                               text-gray-700 border rounded
                                py-3 px-4 mb-3 leading-tight focus:outline-none
                                 focus:bg-white"
                                id="grid-faculty-name"
                                value={data.faculty}
                                onChange={handleChange}
                                onClick={(e) => {
                                  setError(null);
                                }}
                                name="faculty"
                                type="text"
                                placeholder="Jack"
                              />
                            </div>

                            {/* Faculty Position */}
                            <div className="w-full px-3 md:mb-0">
                              <label
                                className="block uppercase tracking-wide
                               text-gray-700 text-xs font-bold mb-2"
                                htmlFor="grid-faculty-position"
                              >
                                faculty Position
                              </label>
                              <div className="relative">
                                <select
                                  className="block appearance-none w-full
                                 bg-gray-200 border border-gray-200
                                  text-gray-700 py-3 px-4 pr-8 rounded 
                                  leading-tight focus:outline-none focus:bg-white
                                   focus:border-gray-500"
                                  id="grid-faculty-position"
                                  value={data.facultyPosition}
                                  onClick={(e) => {
                                    setError(null);
                                  }}
                                  onChange={handleChange}
                                  name="facultyPosition"
                                >
                                  <option>Select</option>
                                  {facultyPositions.map(
                                    (facultyPosition, idx) => (
                                      <option key={idx}>
                                        {facultyPosition}
                                      </option>
                                    )
                                  )}
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

                          <div className="flex flex-row mb-3 -mx-3">
                            {/* Faculty Department */}
                            <div className="w-full px-3  md:mb-0">
                              <label
                                className="block uppercase tracking-wide
                               text-gray-700 text-xs font-bold mb-2"
                                htmlFor="grid-faculty-department"
                              >
                                Faculty Department
                              </label>
                              <div className="relative">
                                <select
                                  className="block appearance-none w-full
                                 bg-gray-200 border border-gray-200
                                  text-gray-700 py-3 px-4 pr-8 rounded 
                                  leading-tight focus:outline-none focus:bg-white
                                   focus:border-gray-500"
                                  id="grid-faculty-department"
                                  value={data.facultyDepartment}
                                  onChange={handleChange}
                                  onClick={() => {
                                    setError(null);
                                  }}
                                  name="facultyDepartment"
                                >
                                  <option>Select</option>
                                  {departments.map((department, idx) => (
                                    <option key={idx}>{department}</option>
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
                              Okay
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

module.exports = SubjectModel;
