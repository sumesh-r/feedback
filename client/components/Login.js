import { useEffect, useState } from "react";
import { useAuth } from "@context/AuthContext";

const Login = () => {
  const IS_DEVELOPMENT = process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true";
  // Student
  const [regNo, setRegNo] = useState(IS_DEVELOPMENT ? 20104169 : "");
  const [dob, setDob] = useState(IS_DEVELOPMENT ? "07/03/2003" : "");
  const [studentPassword, setStudentPassword] = useState(
    IS_DEVELOPMENT ? "hicet" : ""
  );
  const [studentError, setStudentError] = useState("");
  const { studentLogin, facultyLogin, facultyErrorMsg, studentErrorMsg } =
    useAuth();

  // Faculty
  const [userName, setUserName] = useState(IS_DEVELOPMENT ? "admin" : "");
  const [facultyPassword, setFacultyPassword] = useState(
    IS_DEVELOPMENT ? "admin" : ""
  );
  const [facultyError, setFacultyError] = useState("");

  useEffect(() => {
    setStudentError(studentErrorMsg);
    setFacultyError(facultyErrorMsg);
  }, []);

  // * Validating and submiting the data
  const studentHandleSubmit = async (e) => {
    e.preventDefault();
    setStudentError("");
    if (!regNo || !dob || !studentPassword) {
      setStudentError("all fields should be filled");
      return;
    }
    if (!Number(regNo)) {
      setStudentError("register number should be numerical value");
      return;
    }
    if (
      !/([0-2]{1}[0-9]{1}|3[0-1]{1})[/](0[1-9]|1[0-2])[/]([0-9]{4})/.test(dob)
    ) {
      setStudentError("date should be in the format dd/mm/yyyy");
      return;
    }
    if (studentPassword.length >= 15 || studentPassword.length < 5) {
      setStudentError("password must be between 5 to 10 characters");
      return;
    }
    setStudentError("");
    await studentLogin(regNo, dob, studentPassword);
  };
  const facultyHandleSubmit = async (e) => {
    e.preventDefault();
    setFacultyError("");
    if (!userName || !facultyPassword) {
      setFacultyError("all fields should be filled");
      return;
    }
    if (facultyPassword.length >= 15 || facultyPassword.length < 5) {
      setFacultyError("password must be between 5 to 10 characters");
      return;
    }
    setFacultyError("");
    await facultyLogin(userName, facultyPassword);
  };

  return (
    <div className="container flex items-center justify-center mx-auto min-h-screen min-w-1/2">
      <div
        className="flex flex-col m-10 md:flex-row md:max-h-screen items-center 
      max-w-sm md:max-w-3xl justify-center"
      >
        {/* student form */}
        <div
          className="flex items-center bg-gray-400 rounded-2xl shadow-lg
         mb-10 md:mr-10"
        >
          {/* image */}
          {/* <div className="md:block hidden py-3 pl-3 w-1/2">
            <Image
              className="rounded-2xl"
              width="510"
              height="685"
              src="/img2.svg"
            />
          </div> */}

          {/* Student form  */}
          <div className=" p-8 md:px-10">
            <h2 className="font-bold text-2xl text-[#002D74]">Student Login</h2>

            <div className="text-gray-800">
              {studentError && (
                <div className="text-red-500 pt-2">{studentError}</div>
              )}

              <div>
                <p className="mt-5 mb-1">Register Number</p>
                <input
                  className="p-2 w-full outline-none rounded-lg border"
                  type="text"
                  name="regNo"
                  value={regNo}
                  placeholder="123"
                  onClick={(e) => {
                    setStudentError("");
                  }}
                  onChange={(e) => {
                    setRegNo(e.target.value);
                  }}
                />
              </div>

              <div>
                <p className="mt-5 mb-1">Date of Birth</p>
                <input
                  className="p-2 w-full outline-none rounded-lg border"
                  type="text"
                  name="dob"
                  value={dob}
                  placeholder="dd/mm/yyyy"
                  onClick={(e) => {
                    setStudentError("");
                  }}
                  onChange={(e) => {
                    setStudentError("");
                    setDob(e.target.value);
                  }}
                />
              </div>

              <div>
                <p className="mt-5 mb-1">Password</p>
                <input
                  className="p-2 rounded-lg outline-none w-full border"
                  type="password"
                  name="password"
                  placeholder="abc"
                  value={studentPassword}
                  onClick={(e) => {
                    setStudentError("");
                  }}
                  onChange={(e) => {
                    setStudentError("");
                    setStudentPassword(e.target.value);
                  }}
                />
              </div>

              <button
                onClick={studentHandleSubmit}
                className="bg-[#002D74] mt-7 w-full rounded-xl text-white
                 py-2.5 hover:scale-105 duration-300"
              >
                Login
              </button>
            </div>
          </div>
        </div>
        {/* Faculty form  */}
        <div className="flex items-center bg-gray-400 rounded-2xl shadow-lg ">
          <div className=" p-8 md:px-10">
            <h2 className="font-bold text-2xl  text-[#002D74]">
              Faculty Login
            </h2>

            <div className="text-gray-800">
              {facultyError && (
                <div className="text-red-500 pt-2">{facultyError}</div>
              )}

              <div>
                <p className="mt-5 mb-1">User Name</p>
                <input
                  className="p-2 w-full outline-none rounded-lg border"
                  type="text"
                  name="regNo"
                  value={userName}
                  placeholder="123"
                  onClick={(e) => {
                    setFacultyError("");
                  }}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
              </div>

              <div>
                <p className="mt-5 mb-1">Password</p>
                <input
                  className="p-2 rounded-lg outline-none w-full border"
                  type="password"
                  name="password"
                  placeholder="abc"
                  value={facultyPassword}
                  onClick={(e) => {
                    setFacultyError("");
                  }}
                  onChange={(e) => {
                    setFacultyError("");
                    setFacultyPassword(e.target.value);
                  }}
                />
              </div>

              <button
                onClick={facultyHandleSubmit}
                className="bg-[#002D74] mt-7 w-full rounded-xl text-white
                 py-2.5 hover:scale-105 duration-300"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
