import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@context/AuthContext";

const StudentDashboard = () => {
  const IS_DEVELOPMENT = process.env.NEXT_PUBLIC_IS_DEVELOPMENT;
  const { studentLogout } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({
    batch: "",
    section: "",
    degree: "",
    semester: "",
  });
  const url = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchSubjects = async () => {
    const response = await fetch(url + "/student/feedback", {
      method: "GET",
      credentials: "include",
    })
      .then(async function (res) {
        const value = {
          status: res.status,
          data: await res.json(),
        };
        return value;
      })
      .then(function ({ status, data }) {
        if (status != 200) return "not 200 status";
        return data.feedback;
      });

    if (response) {
      const subjects = response.subjects;
      subjects.map((subject) => {
        (subject["subjectKnowledge"] = -1),
          (subject["clearExplanation"] = -1),
          (subject["usageOfTeachingTools"] = -1),
          (subject["extraInput"] = -1),
          (subject["teacherStudentRelationship"] = -1);
      });

      setSubjects(subjects);
      setFeedback(response);
    }
  };

  const subjectsColumns = useMemo(
    () => [
      {
        heading: "faculty",
        value: "faculty",
      },
      {
        heading: "Name of the Subjects",
        value: "subjectName",
      },
      {
        heading: "Subject Knowledge",
        value: "subjectKnowledge",
      },
      {
        heading: "Clear Explanation",
        value: "clearExplanation",
      },
      {
        heading: "Usage of Teaching Tools",
        value: "usageOfTeachingTools",
      },
      {
        heading: "Extra Input",
        value: "extraInput",
      },
      {
        heading: "Teacher-Student Relationship",
        value: "teacherStudentRelationship",
      },
    ],
    [subjects]
  );

  useEffect(() => {
    fetchSubjects();
  }, []);

  const Table = ({ data, column }) => {
    return (
      <table className="divide-y m-10 mt-2 w-3/4 divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {column.map((item, index) => (
              <TableHeadItem key={index} item={item} />
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <TableRow item={item} key={index} id={index} column={column} />
          ))}
        </tbody>
      </table>
    );
  };

  const TableHeadItem = ({ item }) => (
    <th
      className="px-8 py-3 text-center text-xs font-medium
  text-gray-500 uppercase"
    >
      {item.heading}
    </th>
  );

  const headers = [
    "subjectKnowledge",
    "clearExplanation",
    "usageOfTeachingTools",
    "extraInput",
    "teacherStudentRelationship",
  ];

  const TableRow = ({ item, column, id }) => {
    const isEven = (id) => id % 2 === 0;
    return (
      <tr
        className={
          isEven(id)
            ? "bg-dark-purple bg-opacity-30"
            : "bg-light-white bg-opacity-30"
        }
      >
        {column.map((columnItem, index) => {
          // if (columnItem.value.includes(".")) {
          //   const itemSplit = columnItem.value.split("."); //['address', 'city']
          //   return <td key={index}>{item[itemSplit[0]][itemSplit[1]]}</td>;
          // }

          return (
            <td className={`px-6 py-4 text-center outline-none`} key={index}>
              {headers[index - 2] === columnItem.value ? (
                <Dropdown id={id} columnItem={columnItem} rowItem={item} />
              ) : (
                item[`${columnItem.value}`]
              )}
            </td>
          );
        })}
      </tr>
    );
  };

  const checkData = async () => {
    let unFilled = 0;
    subjects.map((subject) => {
      headers.map((header) => {
        if (subject[header] === -1) {
          unFilled = unFilled + 1;
          return;
        }
      });
    });
    if (unFilled > 0) {
      setError("fill all fields");
      return;
    } else {
      setError(null);
    }
  };

  const submitFeedback = async () => {
    setLoading(true);

    const body = subjects;

    let response = { eMessage: "no value received", path: "addfeedback" };

    response = await useFetch("POST", "/student/feedback", body).then(
      async function ({ status, data }) {
        if (status != 200) {
          setError(data.eMessage);
          return data;
        }
        if (status === 200) {
          setA(false);
          return { Message: "feedbackSubmitted", path: "addfeedback" };
        }
        if (status === 409) {
          return { eMessage: data.eMessage, path: "addfeedback" };
        }
      }
    );

    setLoading(false);
    return response;
  };

  const submitData = async (e) => {
    e.preventDefault();
    let unFilled = 0;
    await subjects.map((subject) => {
      headers.map((header) => {
        if (subject[header] === -1) {
          unFilled = unFilled + 1;
          return;
        }
      });
    });
    if (unFilled > 0) {
      setError("fill all fields");
      return;
    } else {
      setError(null);
      await submitFeedback();
      return;
    }
  };

  const fillData = () => {
    const newValues = subjects.map((subject) => {
      headers.map((header) => {
        subject[header] = 2;
      });
      return subject;
    });
    setSubjects(newValues);
  };

  const unFillData = () => {
    const newValues = subjects.map((subject) => {
      headers.map((header) => {
        subject[header] = -1;
      });
      return subject;
    });
    setSubjects(newValues);
  };

  const Dropdown = ({ id, columnItem, rowItem }) => {
    const handleChange = (value) => {
      const newValues = subjects.map((subject) => {
        if (subject.subjectCode === rowItem.subjectCode) {
          subject[columnItem.value] = value;
        }
        return subject;
      });
      setSubjects(newValues);
    };
    return (
      <select
        value={subjects[id][columnItem.value]}
        onChange={(e) => handleChange(Number(e.target.value))}
        onClick={() => setError(null)}
        className={`outline-none text-center bg-inherit`}
      >
        <option value={-1}>{"select"}</option>
        <option value={8}>Excellent</option>
        <option value={6}>Good</option>
        <option value={4}>Satisfactory</option>
        <option value={2}>Not Satisfactory</option>
        <option value={0}>Poor</option>
        {/* <option value={rowItem[columnItem.value]}>
          {rowItem[columnItem.value]}
        </option> */}
      </select>
    );
  };

  return (
    <div className="flex flex-col items-center w-full pt-8">
      {/* heading */}
      <div className="w-10/12 flex justify-between items-center">
        <h1
          className="text-2xl md:text-3xl py-1.5
           mb-5 font-semibold text-dark-purple
      "
        >
          Feedback
        </h1>
        <button
          className="text-1xl md:text-2xl py-1.5 rounded-lg px-10 mr-10 bg-green-500
          items-center mb-5 font-semibold  text-white shadow"
          onClick={studentLogout}
        >
          Logout
        </button>
      </div>
      {/* basic details of feedback */}
      <div className="w-full flex justify-center">
        <div
          className="flex flex-col md:flex-row items-center
         w-10/12 justify-evenly"
        >
          <div className="flex items-center mb-4 md:mb-0 md:ml-2">
            <label htmlFor="batch" className="mr-3">
              Batch:
            </label>
            <input
              className="outline-none py-1 px-2 rounded bg-white
                cursor-not-allowed"
              type="text"
              name="batch"
              onChange={(e) => {}}
              id="batch"
              value={feedback.batch}
              readOnly
            />
          </div>

          <div className="flex items-center mb-4 md:mb-0 md:ml-2">
            <label htmlFor="Dept_&_sec" className="mr-3">
              Class:{" "}
            </label>
            <input
              className="outline-none px-2 py-1 rounded bg-white
               cursor-not-allowed"
              type="text"
              name="Dept_&_sec"
              onChange={(e) => {}}
              id="Dept_&_sec"
              value={`${feedback.degree} - ${feedback.section}`}
              readOnly
            />
          </div>

          <div className="flex items-center mb-4 md:mb-0 md:ml-2">
            <label htmlFor="Dept_&_sec" className="mr-3">
              Semester:{" "}
            </label>
            <input
              className="outline-none px-2 py-1 rounded bg-white
               cursor-not-allowed"
              type="text"
              name="Dept_&_sec"
              id="Dept_&_sec"
              onChange={(e) => {}}
              value={feedback.semester}
              readOnly
            />
          </div>
        </div>
      </div>
      {/* error */}
      <div className="mt-8 w-9/12">
        {error ? (
          <span className="flex text-red-600 justify-start">{error}</span>
        ) : (
          ""
        )}
      </div>
      {/* table */}
      <form onSubmit={submitData} className="w-full">
        <div className="w-full flex justify-center">
          <Table data={subjects} column={subjectsColumns} />
        </div>
        {/* submit button */}
        <div className="flex w-10/12 justify-end">
          <button
            type="submit"
            className="bg-dark-purple bg-opacity-30 px-4 py-2 rounded-lg
        text-white"
          >
            Submit
          </button>
        </div>
      </form>
      {IS_DEVELOPMENT && (
        <>
          <div className="flex mt-3 w-9/12 justify-end">
            <button
              onClick={fillData}
              className="bg-dark-purple bg-opacity-30 px-4 py-2 rounded-lg
          text-white"
            >
              fill
            </button>
          </div>
          <div className="flex mt-3 w-9/12 justify-end">
            <button
              onClick={unFillData}
              className="bg-dark-purple bg-opacity-30 px-4 py-2 rounded-lg
          text-white"
            >
              unfill
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default StudentDashboard;
