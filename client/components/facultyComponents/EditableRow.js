import React from "react";
import { facultyPositions, departments } from "@utils/constants";
import { MdCancel, MdCheckCircle } from "react-icons/md";


const EditableRow = ({
  isElective,
  editFormData,
  handleEditFormChange,
  handleCancelClick,
  idx,
}) => {
  const isEven = (idx) => idx % 2 === 0;
  return (
    <tr
      className={
        isEven(idx)
          ? "bg-dark-purple bg-opacity-30"
          : "bg-light-white bg-opacity-30"
      }
    >
      {isElective ? <td className={`px-6 py-4 text-center`}>
        <input
          type="text"
          required="required"
          placeholder="Enter regNo"
          name="regNo"
          className="bg-inherit text-center outline-none"
          value={editFormData.regNo}
          readOnly
        />
      </td> : ""}

      <td className={`px-6 py-4 text-center`}>
        <input
          type="text"
          required="required"
          placeholder="Enter subjectCode"
          name="subjectCode"
          className="bg-inherit text-center outline-none"
          value={editFormData.subjectCode}
          readOnly
        />
      </td>

      <td className={`px-6 py-4 text-center`}>
        <input
          type="text"
          required="required"
          placeholder="Enter subjectName"
          name="subjectName"
          className={`${
            isEven(idx)
              ? "bg-white bg-opacity-40"
              : "bg-dark-purple bg-opacity-20"
          }   text-center
          py-2 outline-none rounded-lg`}
          value={editFormData.subjectName}
          onChange={handleEditFormChange}
        />
      </td>

      <td className={`px-6 py-4 text-center`}>
        <input
          type="text"
          required="required"
          placeholder="Enter faculty name"
          name="faculty"
          className={`${
            isEven(idx)
              ? "bg-white bg-opacity-40"
              : "bg-dark-purple bg-opacity-20"
          }   text-center
          py-2 outline-none rounded-lg`}
          value={editFormData.faculty}
          onChange={handleEditFormChange}
        />
      </td>

      <td className={`px-1 py-4 text-center`}>
        <div className="  md:mb-0">
          <div className="relative">
            <select
              className="block text-center appearance-none w-full
                         bg-gray-200 border border-gray-200
                          text-gray-700 py-3 px-2 pr-8 rounded 
                          leading-tight focus:outline-none focus:bg-white
                           focus:border-gray-500"
              value={editFormData.facultyPosition}
              onChange={handleEditFormChange}
              name="facultyPosition"
            >
              <option>Select</option>
              {facultyPositions.map((facultyPosition, idx) => (
                <option key={idx}>{facultyPosition}</option>
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
      </td>

      <td className={`px-6 py-4 text-center`}>
        <div className="w-full px-3  md:mb-0">
          <div className="relative">
            <select
              className="block text-center appearance-none w-full
                                 bg-gray-200 border border-gray-200
                                  text-gray-700 py-3 px-4 pr-8 rounded 
                                  leading-tight focus:outline-none focus:bg-white
                                   focus:border-gray-500"
              value={editFormData.facultyDepartment}
              onChange={handleEditFormChange}
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
      </td>

      <td className={`px-6 py-4 text-center`}>
        <button className="mr-3" type="submit">
          <MdCheckCircle className="text-dark-purple w-4 h-4" />
        </button>
        <button type="button" onClick={handleCancelClick}>
          <MdCancel className="text-dark-purple" />
        </button>
      </td>
    </tr>
  );
};

export default EditableRow;
