import React, { Fragment, useEffect, useMemo, useState } from "react";
import UseFetch from "@hooks/useFetch";
import { useRouter } from "next/router";
import ReadOnlyRow from "@facultyComponents/ReadOnlyRow";
import EditableRow from "@facultyComponents/EditableRow";
import SubjectModel from "@components/SubjectModel";

const Feedback = () => {
  const [subjects, setSubjects] = useState([]);
  const [electiveSubjects, setElectiveSubjects] = useState([]);
  const [details, setDetails] = useState({});
  const [subjectModel, setSubjectModel] = useState(false);
  const [isElective, setIsElective] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  let urlParams, queryString, semester, feedbackNo;

  const handleSubjectModel = () => {
    setSubjectModel(!subjectModel);
  };

  const handleChangeSubject = (newSubject) => {
    if (isElective) {
      const newElectiveSubjects = [...electiveSubjects, newSubject];
      setElectiveSubjects(newElectiveSubjects);
    } else {
      const newSubjects = [...subjects, newSubject];
      setSubjects(newSubjects);
    }
  };

  useEffect(() => {
    // Client-side-only code
    queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);
    semester = urlParams.get("s");
    feedbackNo = urlParams.get("f");

    if (!semester || !feedbackNo) {
      router.push("/dashboard");
      return;
    }
  }, []);

  const fetchSubjects = async () => {
    const body = {
      semester: semester,
      feedbackNo: feedbackNo,
    };
    const response = await UseFetch("POST", "/staff/feedback", body).then(
      async function ({ status, data }) {
        if (status === 401 || status === 409 || status === 404) {
          router.push("/dashboard");
          return;
        }
        if (data.isLive) {
          data.isLive = "Active";
        } else {
          data.isLive = "InActive";
        }
        if (!data.subjects) {
          data.subjects = [];
        }
        if (!data.electiveSubjects) {
          data.electiveSubjects = [];
        }
        return data;
      }
    );

    if (response) {
      const subjects = response.subjects;
      const electiveSubjects = response.electiveSubjects;
      const details = response;
      setSubjects(subjects);
      setElectiveSubjects(electiveSubjects);
      setDetails(details);
    }
  };
  const subjectsData = useMemo(() => [...subjects], [subjects]);
  const subjectsColumns = useMemo(() => {
    const s = subjects[0]
      ? Object.keys(subjects[0])
          .filter((key) => key !== "_id")
          .filter((key) => key !== "semester")
          .filter((key) => key !== "feedbackNo")
          .map((key) => {
            return { Header: key, accessor: key };
          })
      : [];
    s.push({
      Header: "actions",
      accessor: "actions",
    });
    return s;
  }, [subjects]);

  const electiveSubjectsData = useMemo(
    () => [...electiveSubjects],
    [electiveSubjects]
  );
  const electiveSubjectsColumns = useMemo(() => {
    const s = electiveSubjects[0]
      ? Object.keys(electiveSubjects[0])
          .filter((key) => key !== "_id")
          .filter((key) => key !== "semester")
          .filter((key) => key !== "feedbackNo")
          .map((key) => {
            return { Header: key, accessor: key };
          })
      : [];
    s.push({
      Header: "actions",
      accessor: "actions",
    });
    return s;
  }, [electiveSubjects]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleChange = ({ currentTarget: input }) => {
    setDetails({ ...details, [input.name]: input.value });
  };

  const updateFeedback = async (e) => {
    e.preventDefault();

    const feedback = {
      semester: details.semester,
      feedbackNo: details.feedbackNo,
      isLive: details.isLive === "Active",
      subjects: [...subjects],
      electiveSubjects: [...electiveSubjects],
    };
    const response = UseFetch(
      "POST",
"/feedback/staff/update",
feedback
    ).then(({ status, data }) => {
      if (status === 401) {
        router.push("/");
        return "not 200 status";
      } else if (status === 409) {
        return { eMessage: data.eMessage, path: "updateFeedback" };
      } else if (status === 200) {
        return { Message: "feedback updated", path: "updateFeedback" };
      } else if (status != 200) {
        setError(data.eMessage);
        return data;
      }
    });
  };

  const SubjectsTable = () => {
    const [editFormData, setEditFormData] = useState({
      subjectCode: "",
      subjectName: "",
      faculty: "",
      facultyPosition: "",
      facultyDepartment: "",
    });

    const [editSubjectCode, setEditSubjectCode] = useState(null);

    const handleEditFormChange = (event) => {
      event.preventDefault();

      const fieldName = event.target.getAttribute("name");
      const fieldValue = event.target.value;

      const newFormData = { ...editFormData };
      newFormData[fieldName] = fieldValue;

      setEditFormData(newFormData);
    };

    const handleEditFormSubmit = async (event) => {
      event.preventDefault();

      const editedSubject = {
        subjectCode: editFormData.subjectCode,
        subjectName: editFormData.subjectName,
        faculty: editFormData.faculty,
        facultyPosition: editFormData.facultyPosition,
        facultyDepartment: editFormData.facultyDepartment,
      };

      const newSubjects = subjects.map((subject) => {
        if (editSubjectCode === subject.subjectCode) {
          return editedSubject;
        } else {
          return subject;
        }
      });
      setSubjects(newSubjects);

      setEditSubjectCode(null);
    };

    const handleEditClick = (event, subject) => {
      event.preventDefault();
      setEditSubjectCode(subject.subjectCode);

      const formValues = {
        subjectCode: subject.subjectCode,
        subjectName: subject.subjectName,
        faculty: subject.faculty,
        facultyPosition: subject.facultyPosition,
        facultyDepartment: subject.facultyDepartment,
      };

      setEditFormData(formValues);
    };

    const handleCancelClick = () => {
      setEditSubjectCode(null);
    };

    const handleDeleteClick = async (deleteSubject) => {
      const newSubjects = subjects.filter((subject) => {
        if (deleteSubject.subjectCode != subject.subjectCode) {
          return subject;
        }
      });
      setSubjects(newSubjects);
    };

    return (
      <div className="w-full flex flex-col justify-center">
        {/* add btn */}
        <div className="w-full flex justify-end ">
          <button
            className="bg-dark-purple bg-opacity-30 
        py-2 px-4 rounded text-white shadow-md
        "
            onClick={() => {
              handleSubjectModel();
            }}
          >
            Add Subject
          </button>
        </div>
        {subjects[0] ? (
          <form
            className="w-full flex justify-center"
            onSubmit={handleEditFormSubmit}
          >
            <table className="w-full divide-y my-10  divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {subjectsColumns.map((column, idx) => {
                    return (
                      <th
                        key={idx}
                        className="px-8 py-3 text-center text-xs font-medium
                text-gray-500 uppercase"
                      >
                        {column.Header}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjectsData.map((subject, idx) => (
                  <Fragment key={idx}>
                    {editSubjectCode === subject.subjectCode ? (
                      <EditableRow
                        editFormData={editFormData}
                        handleEditFormChange={handleEditFormChange}
                        handleCancelClick={handleCancelClick}
                        idx={idx}
                      />
                    ) : (
                      <ReadOnlyRow
                        idx={idx}
                        subject={subject}
                        handleEditClick={handleEditClick}
                        handleDeleteClick={handleDeleteClick}
                      />
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </form>
        ) : (
          <div className="text-1xl mb-10 flex justify-center">
            No Subjects Exists
          </div>
        )}
      </div>
    );
  };

  const ElectiveSubjectsTable = () => {
    const [editFormData, setEditFormData] = useState({
      regNo: "",
      subjectCode: "",
      subjectName: "",
      faculty: "",
      facultyPosition: "",
      facultyDepartment: "",
    });

    const [editSubjectCode, setEditSubjectCode] = useState(null);

    const handleEditFormChange = (event) => {
      event.preventDefault();

      const fieldName = event.target.getAttribute("name");
      const fieldValue = event.target.value;

      const newFormData = { ...editFormData };
      newFormData[fieldName] = fieldValue;

      setEditFormData(newFormData);
    };

    const handleEditFormSubmit = async (event) => {
      event.preventDefault();

      const editedSubject = {
        subjectCode: editFormData.subjectCode,
        regNo: editFormData.regNo,
        subjectName: editFormData.subjectName,
        faculty: editFormData.faculty,
        facultyPosition: editFormData.facultyPosition,
        facultyDepartment: editFormData.facultyDepartment,
      };

      const newElectiveSubjects = electiveSubjects.map((electiveSubject) => {
        if (editSubjectCode === electiveSubject.subjectCode) {
          return editedSubject;
        } else {
          return electiveSubject;
        }
      });
      setElectiveSubjects(newElectiveSubjects);

      setEditSubjectCode(null);
    };

    const handleEditClick = (event, subject) => {
      event.preventDefault();
      setEditSubjectCode(subject.subjectCode);

      const formValues = {
        subjectCode: subject.subjectCode,
        regNo: subject.regNo,
        subjectName: subject.subjectName,
        faculty: subject.faculty,
        facultyPosition: subject.facultyPosition,
        facultyDepartment: subject.facultyDepartment,
      };

      setEditFormData(formValues);
    };

    const handleCancelClick = () => {
      setEditSubjectCode(null);
    };

    const handleDeleteClick = async (deleteElectiveSubject) => {
      const newElectiveSubjects = electiveSubjects.filter((electiveSubject) => {
        if (deleteElectiveSubject.subjectCode != electiveSubject.subjectCode) {
          return electiveSubject;
        }
      });
      setElectiveSubjects(newElectiveSubjects);
    };

    return (
      <div className="w-full flex flex-col justify-center">
        {/* add btn */}
        <div className="w-full flex justify-end ">
          <button
            className="bg-dark-purple bg-opacity-30 
        py-2 px-4 rounded text-white shadow-md
        "
            onClick={() => {
              setIsElective(true);
              handleSubjectModel();
            }}
          >
            Add Elective Subject
          </button>
        </div>
        {electiveSubjects[0] ? (
          <form
            className="w-full flex justify-center"
            onSubmit={handleEditFormSubmit}
          >
            <table className="w-full divide-y my-10  divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {electiveSubjectsColumns.map((column, idx) => {
                    return (
                      <th
                        key={idx}
                        className="px-8 py-3 text-center text-xs font-medium
                text-gray-500 uppercase"
                      >
                        {column.Header}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {electiveSubjectsData.map((subject, idx) => (
                  <Fragment key={idx}>
                    {editSubjectCode === subject.subjectCode ? (
                      <EditableRow
                        isElective={true}
                        editFormData={editFormData}
                        handleEditFormChange={handleEditFormChange}
                        handleCancelClick={handleCancelClick}
                        idx={idx}
                      />
                    ) : (
                      <ReadOnlyRow
                        isElective={true}
                        idx={idx}
                        subject={subject}
                        handleEditClick={handleEditClick}
                        handleDeleteClick={handleDeleteClick}
                      />
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </form>
        ) : (
          <div className="text-1xl mb-10 flex justify-center">
            No Elective Subjects Exists
          </div>
        )}
      </div>
    );
  };

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

        <h1 className="text-3xl font-semibold text-dark-purple">Feedback</h1>
      </div>

      {subjectModel ? (
        <SubjectModel
          handleChangeSubject={handleChangeSubject}
          callback={handleSubjectModel}
          subjects={subjects}
          isElective={isElective}
          electiveSubject={electiveSubjects}
        />
      ) : (
        ""
      )}

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

          <div className="flex h-full items-start ">
            <div className="flex items-center mb-4">
              <label htmlFor="isLive" className="mr-3">
                isLive:
              </label>
              <div className="w-full px-3  md:mb-0">
                <div className="relative">
                  <select
                    className="block text-center appearance-none w-full
                                 bg-white border border-gray-200
                                  text-gray-700 py-3 px-4 pr-8 rounded 
                                  leading-tight focus:outline-none focus:bg-white
                                   focus:border-gray-500"
                    value={details.isLive}
                    onChange={handleChange}
                    name="isLive"
                  >
                    <option>InActive</option>
                    <option>Active</option>
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
          </div>
        </div>
      </div>

      <div className="w-9/12">
        <SubjectsTable />
      </div>

      <div className="w-9/12">
        <ElectiveSubjectsTable />
      </div>

      {/* update btn */}
      <form onSubmit={updateFeedback} className="w-9/12 flex justify-end">
        <button
          className="bg-dark-purple bg-opacity-30 
        py-2 px-4 rounded text-white shadow-md
        "
          type="submit"
        >
          update
        </button>
      </form>
    </div>
  );
};

export default Feedback;
