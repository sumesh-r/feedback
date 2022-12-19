import React, { useState } from "react";
import UseFetch from "@hooks/useFetch";
import { batches, degrees, sections, semesters } from "@utils/constants";
import Loading from "@components/Loading";

const AdvisorModel = ({
  editData,
  details,
  isEdit,
  fetchAdvisors,
  callback,
}) => {
  const [data, setData] = useState({
    userName: isEdit ? editData.userName : "",
    degree: isEdit ? editData.degree : "",
    section: isEdit ? editData.section : "",
    batch: isEdit ? editData.batch : "",
    password: isEdit ? "" : "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const addAdvisor = async (data) => {
    setLoading(true);

    const body = {
      userName: data.userName,
      degree: data.degree,
      section: data.section,
      batch: Number(data.batch),
      password: data.password,
    };

    let response = { eMessage: "no value received", path: "addstudent" };

    response = await UseFetch("POST", "/staff/a/advisor", body).then(
      async function ({ status, data }) {
        if (status != 200) {
          setError(data.eMessage);
          return data;
        }
        if (status === 200) {
          callback();
          return { Message: "student added", path: "addstudent" };
        }
        if (status === 409) {
          return { eMessage: data.eMessage, path: "addstudent" };
        }
      }
    );

    setLoading(false);
    return response;
  };

  const updateAdvisor = async (data) => {
    setLoading(true);

    const body = {
      userName: data.userName,
      degree: data.degree,
      batch: data.batch,
      section: data.section,
    };

    let response = { eMessage: "no value received", path: "updatestudent" };

    response = await UseFetch("POST", "/staff/a/advisor/update", body).then(
      async function ({ status, data }) {
        if (status != 200) {
          setError(data.eMessage);
          return data;
        }
        if (status === 200) {
          callback();
          return { Message: "student updated", path: "updatestudent" };
        }
        if (status === 409) {
          return { eMessage: data.eMessage, path: "updatestudent" };
        }
      }
    );

    setLoading(false);
    return response;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !data.userName ||
      (!isEdit && !data.password) ||
      data.degree == "" ||
      data.degree == "Select" ||
      data.section == "" ||
      data.section == "Select" ||
      data.batch == "" ||
      data.batch == "Select"
    ) {
      setError("all fields should be filled");
      return;
    }
    if (!isEdit && (data.password.length >= 15 || data.password.length < 5)) {
      setError("password must be between 5 to 15 characters");
      return;
    }
    if (isEdit) {
      await updateAdvisor(data);
    } else {
      await addAdvisor(data);
    }
    fetchAdvisors();
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
                    <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <div className="flex items-center justify-between">
                        <h3
                          className="text-lg font-medium leading-6 text-dark-purple"
                          id="modal-title"
                        >
                          {isEdit ? "Edit Student" : " Add Student"}
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
                            {/*userName */}
                            <div className="w-full px-3 mb-6 md:mb-0">
                              <label
                                className="block uppercase tracking-wide text-gray-700
                               text-xs font-bold mb-2"
                                htmlFor="grid-userName"
                              >
                                userName
                              </label>
                              {/* border-red-500 */}
                              <input
                                className="appearance-none block w-full bg-gray-200
                               text-gray-700 border  rounded
                                py-3 px-4 mb-3 leading-tight focus:outline-none
                                 focus:bg-white"
                                id="grid-userName"
                                value={data.userName}
                                onClick={(e) => {
                                  setError("");
                                }}
                                onChange={handleChange}
                                name="userName"
                                type="text"
                                placeholder="abc"
                                readOnly={isEdit ? true : false}
                              />
                            </div>

                            {/* Batch */}
                            <div className="w-full px-3 mb-6 md:mb-0">
                              <label
                                className="block uppercase tracking-wide
                               text-gray-700 text-xs font-bold mb-2"
                                htmlFor="grid-Batch"
                              >
                                Batch
                              </label>
                              <div className="relative">
                                <select
                                  className="block appearance-none w-full
                                 bg-gray-200 border border-gray-200
                                  text-gray-700 py-3 px-4 rounded 
                                  leading-tight focus:outline-none focus:bg-white
                                   focus:border-gray-500"
                                  id="grid-batch"
                                  value={data.batch}
                                  onChange={handleChange}
                                  onClick={() => {
                                    setError("");
                                  }}
                                  name="batch"
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
                          </div>

                          <div className="flex flex-row -mx-3 mb-6">
                            {/* degree */}
                            <div className="w-full px-3 mb-6 md:mb-0">
                              <label
                                className="block uppercase tracking-wide
                               text-gray-700 text-xs font-bold mb-2"
                                htmlFor="grid-degree"
                              >
                                Degree
                              </label>
                              <div className="relative">
                                <select
                                  className="block appearance-none w-full
                                 bg-gray-200 border border-gray-200
                                  text-gray-700 py-3 px-4 rounded 
                                  leading-tight focus:outline-none focus:bg-white
                                   focus:border-gray-500"
                                  id="grid-degree"
                                  value={data.degree}
                                  onChange={handleChange}
                                  onClick={() => {
                                    setError("");
                                  }}
                                  name="degree"
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
                            <div className="w-full px-3 mb-6 md:mb-0">
                              <label
                                className="block uppercase tracking-wide
                               text-gray-700 text-xs font-bold mb-2"
                                htmlFor="grid-section"
                              >
                                Section
                              </label>
                              <div className="relative">
                                <select
                                  className="block appearance-none w-full
                                 bg-gray-200 border border-gray-200
                                  text-gray-700 py-3 px-4 rounded 
                                  leading-tight focus:outline-none focus:bg-white
                                   focus:border-gray-500"
                                  id="grid-section"
                                  value={data.section}
                                  onChange={handleChange}
                                  onClick={() => {
                                    setError("");
                                  }}
                                  name="section"
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
                          </div>

                          {/* Password */}
                          {!isEdit ? (
                            <div className="w-full mt-4 mb-3 md:mb-0">
                              <label
                                className="block uppercase tracking-wide text-gray-700
                               text-xs font-bold mb-2"
                                htmlFor="grid-password"
                              >
                                Password
                              </label>
                              {/* border-red-500 */}
                              <input
                                className="appearance-none block w-full bg-gray-200
                               text-gray-700 border  rounded
                                py-3 px-4 mb-2 leading-tight focus:outline-none
                                 focus:bg-white"
                                id="grid-password"
                                type="password"
                                onClick={(e) => {
                                  setError("");
                                }}
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                placeholder="Password"
                              />
                              {/* <p class="text-red-500 text-xs italic">
                              Please fill out this field.
                            </p> */}
                            </div>
                          ) : (
                            ""
                          )}
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
                              {isEdit ? "Update" : "Add"}
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

module.exports = AdvisorModel;
