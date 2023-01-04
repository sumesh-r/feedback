import React, { useState } from "react";
import UseFetch from "@hooks/useFetch";
import { batches, degrees, sections, semesters } from "@utils/constants";
import Loading from "@components/Loading";

const FeedbackModel = ({ editData, isEdit, callback, fetchFeedbacks }) => {
  const [data, setData] = useState({
    semester: "",
    degree: "",
    batch: "",
    section: "",
    // feedbackNo: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const addFeedback = async (data) => {
    let body = {
      batch: data.batch,
      degree: data.degree,
      section: data.section,
      semester: data.semester,
    };
    const response = await UseFetch("POST", "/a/feedback/add", body).then(
      async function ({ status, data }) {
        if (status === 401) {
          router.push("/");
          return "not 200 status";
        } else if (status === 409) {
          return { eMessage: data.eMessage, path: "addfeedback" };
        } else if (status === 200) {
          callback();
          return { Message: "feedback added", path: "addfeedback" };
        } else if (status != 200) {
          setError(data.eMessage);
          return data;
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
      data.batch === "Select" ||
      data.batch === "" ||
      data.degree === "Select" ||
      data.degree === "" ||
      data.semester === "Select" ||
      data.semester === "" ||
      data.section === "Select" ||
      data.section === ""
      // || data.feedbackNo === ""
    ) {
      setError("all fields should be filled");
      return;
    }
    // if (
    // *    !/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(data.feedbackNo)
    // ) {
    //   setError("feedbackNo should be in roman");
    //   return;
    // }

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
                          <div className="-mx-3 flex pt-2">
                            {/* Batch */}
                            <div className="w-full px-3 mb-6 md:mb-3">
                              <label
                                className="block uppercase tracking-wide
                               text-gray-700 text-xs font-bold mb-2"
                                htmlFor="grid-batch"
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
                                  id="grid-batch"
                                  value={data.batch}
                                  onChange={handleChange}
                                  onClick={() => {
                                    setError("");
                                  }}
                                  name="batch"
                                >
                                  <option>Select</option>
                                  {batches.map((batches, idx) => (
                                    <option key={idx}>{batches}</option>
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
                            <div className="w-full px-3 mb-6 md:mb-3">
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
                                  text-gray-700 py-3 px-4 pr-8 rounded 
                                  leading-tight focus:outline-none focus:bg-white
                                   focus:border-gray-500"
                                  id="grid-degree"
                                  value={data.degree}
                                  onChange={handleChange}
                                  onClick={(e) => {
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
                          </div>

                          <div className="-mx-3 flex pt-2">
                            {/* Section */}
                            <div className="w-full px-3 mb-6 md:mb-3">
                              <label
                                className="block uppercase tracking-wide
                               text-gray-700 text-xs font-bold mb-2"
                                htmlFor="grid-section"
                              >
                                section
                              </label>
                              <div className="relative">
                                <select
                                  className="block appearance-none w-full
                                 bg-gray-200 border border-gray-200
                                  text-gray-700 py-3 px-4 pr-8 rounded 
                                  leading-tight focus:outline-none focus:bg-white
                                   focus:border-gray-500"
                                  id="grid-Batch"
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

                            {/* Semester */}
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

                          {/* <div className="-mx-3 flex pt-2">
                            <div className="w-1/2 px-3 mb-6 md:mb-3">
                              <label
                                className="block uppercase tracking-wide
                               text-gray-700 text-xs font-bold mb-2"
                                htmlFor="grid-feedbackNo"
                              >
                                feedbackNo
                              </label>
                              <div className="relative">
                                <input
                                  className="block appearance-none w-full
                                 bg-gray-200 border border-gray-200
                                  text-gray-700 py-3 px-4 pr-8 rounded 
                                  leading-tight focus:outline-none focus:bg-white
                                   focus:border-gray-500"
                                  id="grid-feedbackNo"
                                  type="text"
                                  value={data.feedbackNo}
                                  onChange={handleChange}
                                  onClick={() => {
                                    setError("");
                                  }}
                                  name="feedbackNo"
                                />
                              </div>
                            </div>
                          </div> */}

                          {/* add */}
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

module.exports = FeedbackModel;
