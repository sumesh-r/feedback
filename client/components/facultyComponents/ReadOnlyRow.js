import React from "react";
import { HiPencilAlt, HiTrash } from "react-icons/hi";

const ReadOnlyRow = ({ isElective, subject, handleEditClick, handleDeleteClick, idx }) => {
  const isEven = (idx) => idx % 2 === 0;
  return (
    <tr
      className={
        isEven(idx)
          ? "bg-dark-purple bg-opacity-30"
          : "bg-light-white bg-opacity-30"
      }
    >
      {isElective ? (
        <td className={`px-6 py-4 text-center`}>{subject.regNo}</td>
      ) : (
        ""
      )}
      <td className={`px-6 py-4 text-center`}>{subject.subjectCode}</td>
      <td className={`px-6 py-4 text-center`}>{subject.subjectName}</td>
      <td className={`px-6 py-4 text-center`}>{subject.faculty}</td>
      <td className={`px-6 py-4 text-center`}>{subject.facultyPosition}</td>
      <td className={`px-6 py-4 text-center`}>{subject.facultyDepartment}</td>
      <td className={`px-6 py-4 text-center`}>
        <button
          type="button"
          className="mr-2"
          onClick={(event) => handleEditClick(event, subject)}
        >
          <HiPencilAlt className="text-dark-purple" />
        </button>
        <button type="button" onClick={() => handleDeleteClick(subject)}>
          <HiTrash className="text-dark-purple" />
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;
