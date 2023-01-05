import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@context/AuthContext";
import UseFetch from "@hooks/useFetch";
import { remarks, remarkHeaders } from "@utils/constants";

const StudentDashboard = () => {
  const IS_DEVELOPMENT = process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true";
  const { studentLogout, fetchUser } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);
  const isEven = (id) => id % 2 === 0;
  const [feedback, setFeedback] = useState({
    batch: "",
    section: "",
    degree: "",
    semester: "",
  });

  const fetchSubjects = async () => {
    const response = await UseFetch("GET", "/student/feedback/get").then(function ({
      status,
      data,
    }) {
      return data;
    });

    if (response.subjects) {
      const subjects = response.subjects;
      const electiveSubjects = response.electiveSubjects;
      subjects.map((subject) => {
        (subject["subjectKnowledge"] = -1),
          (subject["clearExplanation"] = -1),
          (subject["usageOfTeachingTools"] = -1),
          (subject["extraInput"] = -1),
          (subject["teacherStudentRelationship"] = -1);
      });
      electiveSubjects.map((electiveSubjects) => {
        (electiveSubjects["subjectKnowledge"] = -1),
          (electiveSubjects["clearExplanation"] = -1),
          (electiveSubjects["usageOfTeachingTools"] = -1),
          (electiveSubjects["extraInput"] = -1),
          (electiveSubjects["teacherStudentRelationship"] = -1);
      });

      setSubjects([...subjects, ...electiveSubjects]);
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

  const TableRow = ({ item, column, id }) => {
    return (
      <tr
        className={
          isEven(id)
            ? "bg-dark-purple bg-opacity-30"
            : "bg-light-white bg-opacity-30"
        }
      >
        {column.map((columnItem, index) => {
          return (
            <td className={`px-6 py-4 text-center outline-none`} key={index}>
              {remarkHeaders[index - 2] === columnItem.value ? (
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

  const submitFeedback = async () => {
    setLoading(true);

    const body = {
      batch: feedback.batch,
      degree: feedback.degree,
      semester: feedback.semester,
      section: feedback.section,
      feedbackNo: feedback.feedbackNo,
      subjects: subjects,
    };

    let response = { eMessage: "no value received", path: "submit feedback" };

    response = await UseFetch("POST", "/student/feedback/submit", body).then(
      async function ({ status, data }) {
        if (status != 200) {
          setError(data.eMessage);
          return data;
        }
        if (status === 200) {
          setSubjects([])
          return { Message: "feedback Submitted", path: "submit feedbac" };
        }
        if (status === 409) {
          return { eMessage: data.eMessage, path: "submit feedback" };
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
      remarkHeaders.map((header) => {
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

  function getRandomItem() {
    const arr = [0, 2, 4, 6, 8];
    // get random index value
    const randomIndex = Math.floor(Math.random() * arr.length);

    // get random item
    const item = arr[randomIndex];

    return item;
  }

  const fillData = () => {
    const newValues = subjects.map((subject) => {
      remarkHeaders.map((header) => {
        subject[header] = getRandomItem();
      });
      return subject;
    });
    setSubjects(newValues);
  };

  const unFillData = () => {
    const newValues = subjects.map((subject) => {
      remarkHeaders.map((header) => {
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
        {remarks.map((remark, idx) => (
          <option value={remark.value} key={idx}>
            {remark.title}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="flex flex-col items-center w-full h-screen pt-8">
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
          className="bg-dark-purple bg-opacity-30 
        py-2 px-10 font-semibold text-white shadow-md rounded-lg mb-5"
          onClick={studentLogout}
        >
          Logout
        </button>
      </div>

      {subjects[0] ? (
        <div>
          {/* basic details */}
          <div className="w-full flex mb-5 justify-center">
            <div
              className="flex flex-col md:flex-row items-center
         w-9/12 justify-between"
            >
              {/* <div className="flex items-center mb-4 md:mb-0 md:ml-2">
            <label htmlFor="name" className="mr-3">
              Name:
            </label>
            <input
              className="outline-none py-1 px-2 rounded bg-white
                cursor-not-allowed"
              type="text"
              name="name"
              onChange={(e) => {}}
              id="name"
              value={user.name}
              readOnly
            />
          </div>

          <div className="flex items-center mb-4 md:mb-0 md:ml-2">
            <label htmlFor="regNo" className="mr-3">
              RegNo:{" "}
            </label>
            <input
              className="outline-none px-2 py-1 rounded bg-white
               cursor-not-allowed"
              type="text"
              name="regNo"
              id="regNo"
              value={user.regNo}
              readOnly
            />
          </div> */}

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
            </div>
          </div>

          {/* basic details of feedback */}
          <div className="w-full flex justify-center">
            <div
              className="flex flex-col md:flex-row items-center
         w-9/12 justify-between"
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

              <div className="flex items-center mb-4 md:mb-0 md:ml-2">
                <label htmlFor="feedbackNo" className="mr-3">
                  feedback No:{" "}
                </label>
                <input
                  className="outline-none px-2 py-1 rounded bg-white
               cursor-not-allowed"
                  type="text"
                  name="feedbackNo"
                  onChange={(e) => {}}
                  id="feedbackNo"
                  value={feedback.feedbackNo}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* error */}
          <div className="mt-8 w-8/12 ">
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
        </div>
      ) : (
        <div className="w-full h-4/5 flex justify-center items-center ">
          no feedback to submit
        </div>
      )}

      {subjects[0] && IS_DEVELOPMENT && (
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
