import React, { useEffect, useMemo, useState } from "react";
import ReactTable from "@components/ReactTable";
import UseFetch from "@hooks/useFetch";

// staff/dashboard
export const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [liveFeedback, setLiveFeedback] = useState({});

  const fetchStudents = async () => {
    const response = await UseFetch(
      "GET",
      "/advisor/feedback/dashboard/get"
    ).then(function ({ status, data }) {
      if (status === 401) return "not 200 status";
      return data;
    });

    if (response) {
      const students = response.notSubmittedStudents;
      const feedback = response.feedback;

      setStudents(students);
      setLiveFeedback(feedback);
    }
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
    ],
    [students]
  );

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="flex flex-col items-center w-full pt-8">
      <h1
        className="text-3xl flex justify-start w-10/12 mb-5 font-semibold
      text-dark-purple
      "
      >
        Dashboard
      </h1>
      {/* basic details of Students */}
      <div
        className=" text-xl md:text-2xl font-bold text-dark-purple flex
       w-9/12 mb-5 justify-start"
      >
        Live Feedback
      </div>

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
              value={liveFeedback.batch}
              readOnly
            />
          </div>

          <div className="flex items-center mb-4 md:mb-0">
            <label htmlFor="semester" className="mr-3">
              semester:
            </label>
            <textarea
              className="outline-none py-1 px-2 rounded bg-white
                cursor-not-allowed resize-none"
              rows={1}
              name="semester"
              id="semester"
              value={liveFeedback.semester}
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
              value={`${liveFeedback.degree} - ${liveFeedback.section}`}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* feedbacks */}
      <div
        className="text-xl md:text-2xl font-bold text-dark-purple flex
       w-9/12 mt-5 justify-start"
      >
        Students not Submitted
      </div>
      <div className="flex w-9/12 flex-col justify-center">
        <ReactTable columns={studentsColumns} data={studentsData} />
      </div>
    </div>
  );
};

export default Dashboard;
