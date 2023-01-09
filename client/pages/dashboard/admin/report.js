import React, { useEffect, useMemo, useState } from "react";
import UseFetch from "@hooks/useFetch";
import { useRouter } from "next/router";
import ReactTable from "@components/ReactTable";
import { remarkHeaders } from "@utils/constants";

const Report = () => {
  const [subjects, setSubjects] = useState([]);
  const [details, setDetails] = useState({});
  const router = useRouter();
  let urlParams, queryString, semester, feedbackNo, batch, degree, section;

  useEffect(() => {
    // Client-side-only code
    queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);
    semester = urlParams.get("s");
    feedbackNo = urlParams.get("f");
    batch = urlParams.get("b");
    degree = urlParams.get("d");
    section = urlParams.get("sc");

    if (!semester || !feedbackNo || !batch || !degree || !section) {
      router.push("/dashboard");
      return;
    }
  }, []);

  const fetchReport = async () => {
    const body = {
      batch: batch,
      degree: degree,
      section: section,
      semester: semester,
      feedbackNo: feedbackNo,
    };
    const response = await UseFetch("POST", "/a/report/get", body).then(
      async function ({ status, data }) {
        if (status === 401 || status === 409 || status === 404) {
          router.push("/dashboard");
          return;
        }
        if (!data.subjects) {
          data.subjects = [];
        }
        return data;
      }
    );

    if (response) {
      const subjects = response.subjects;
      const details = response;
      setSubjects(subjects);
      setDetails(details);
    }
  };
  const subjectsData = useMemo(() => [...subjects], [subjects]);

  const subjectsColumns = React.useMemo(
    () => [
      {
        Header: "SUBJECTCODE",
        accessor: "subjectCode",
      },
      {
        Header: "SUBJECTNAME",
        accessor: "subjectName",
      },
      {
        Header: "FACULTY",
        accessor: "faculty",
      },
      {
        Header: "FACULTYPOSITION",
        accessor: "facultyPosition",
      },
      {
        Header: "FACULTYDEPARTMENT",
        accessor: "facultyDepartment",
      },
      {
        Header: "Teaching and Learning process",
        columns: remarkHeaders.map((header, idx) => ({
          Header: JSON.stringify(idx + 1),
          accessor: header,
        })),
      },
      {
        Header: "AVERAGETOTAL",
        accessor: "averageTotal",
      },
      {
        Header: "FOURSCALERATING",
        accessor: "fourScaleRating",
      },
      {
        Header: "TOTALSTRENGTH",
        accessor: "totalStrength",
      },
      {
        Header: "TOTALRESPONSE",
        accessor: "totalResponse",
      },
    ],
    [subjects]
  );

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div className="flex flex-col items-center w-full pt-8">
      <div className="flex flex-row justify-between items-center mb-5 w-9/12">
        <button
          onClick={() => {
            router.push("/dashboard");
          }}
          className="text-1xl bg-dark-purple bg-opacity-70 font-semibold
        px-4 py-2 rounded-sm text-white"
        >
          Back
        </button>

        <h1 className="text-3xl font-semibold text-dark-purple">Report</h1>
      </div>

      {/* basic details of feedback */}
      <div className="w-full flex justify-center">
        <div
          className="flex flex-col md:flex-row items-center
         w-9/12 justify-between"
        >
          <div className="">
            <div className="flex items-center mb-4">
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
                className="outline-none py-1 px-2 mb-5 md:mb-0 rounded bg-white
              cursor-not-allowed resize-none"
                rows={1}
                name="Dept_&_sec"
                id="Dept_&_sec"
                value={`${details.degree} - ${details.section}`}
                readOnly
              />
            </div>
          </div>

          <div className="">
            <div className="flex items-center mb-4">
              <label htmlFor="semester" className="mr-3">
                Semester:
              </label>
              <textarea
                className="outline-none py-1 px-2 rounded bg-white
                cursor-not-allowed resize-none"
                rows={1}
                name="semester"
                id="semester"
                value={details.semester}
                readOnly
              />
            </div>

            <div className="flex items-center mb-4 md:mb-0">
              <label htmlFor="feedbackNo" className="mr-3">
                Feedback Number:
              </label>
              <textarea
                className="outline-none py-1 px-2 rounded bg-white
                cursor-not-allowed resize-none"
                rows={1}
                name="feedbackNo"
                id="feedbackNo"
                value={details.feedbackNo}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {subjectsData[0] ? (
        <div className="w-9/12 mb-2">
          <ReactTable
            noSearch={true}
            columns={subjectsColumns}
            data={subjectsData}
            needBorder={true}
          />
        </div>
      ) : (
        <div className="m-40"> no subjects</div>
      )}
      <div className="w-9/12 flex flex-col mb-10 justify-start">
        {remarkHeaders.map((header, idx) => (
          <div key={idx} className="">
            {idx + 1} - {header}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Report;
