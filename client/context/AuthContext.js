import { createContext, useContext, useEffect, useRef, useState } from "react";
import useLocalStorage from "@hooks/useLocalStorage";
import useFetch from "@hooks/useFetch";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
  const [studentErrorMsg, setstudentErrorMsg] = useState(null);
  const [facultyErrorMsg, setfacultyErrorMsg] = useState(null);
  // const [student, setStudent] = useState(null);
  // const [staff, setStaff] = useState(null);
  const student = useRef();
  const staff = useRef();
  const [loading, setLoading] = useState(false);
  const url = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    setstudentErrorMsg(studentErrorMsg);
  }, [studentErrorMsg]);

  // *  to fetch the detail of student from session storage
  const fetchUser = () => {
    setLoading(true);
    const userData = useLocalStorage("user");
    if (!userData) {
      setLoading(false);
      return null;
    }
    const user = JSON.parse(userData);
    setLoading(false);
    return user;
  };

  const isLoggedIn = async () => {
    setLoading(true);

    let response = { eMessage: "no value received" };

    response = await fetch(url + "/auth/loggedIn", {
      method: "GET",
      credentials: "include",
    })
      .then(async function (res) {
        const status = res.status;
        const value = {
          status,
          data: await res.json(),
        };
        return value;
      })
      .then(function ({ data, status }) {
        if (status != 200) {
          // setstudentErrorMsg(data.message);
          return status;
        }
        if (!Number(data.id)) {
          // setStaff(data)
          staff.current = data;
        } else {
          student.current = data;
        }
        return data;
      });

    setLoading(false);
    return response;
  };

  // * function that is used to login for students
  const studentLogin = async (regNo, dob, password) => {
    setLoading(true);

    const body = {
      regNo: regNo,
      dob: dob,
      password: password,
    };

    let response = { eMessage: "no value received", path: "student" };

    response = await useFetch("POST", "/auth/student/login", body).then(
      async function ({ data, status }) {
        if (status != 200) {
          setstudentErrorMsg(data.eMessage);
          return data;
        }
        if (status === 200) {
          // const cipher = cryptr.encrypt(JSON.stringify(data));
          const cipher = JSON.stringify(data);

          localStorage.setItem("user", cipher);
        }
        return data;
      }
    );

    if (!response["eMessage"]) {
      const accessToken = document.cookie.split("=")[1];

      // sessionStorage.setItem("user", JSON.stringify(response));
      // sessionStorage.setItem("setupTime", now);
    }

    setLoading(false);
  };

  // * function that is used to logout for students
  const studentLogout = async () => {
    setLoading(true);
    let body = {};
    await useFetch("POST", "/auth/student/logout", body)
      .then(async function (res) {
        localStorage.removeItem("user");
      })
      .catch((err) => {
        console.log(err);
      });

    setLoading(false);
  };

  // * function that is used to login for faculty
  const facultyLogin = async (userName, password) => {
    setLoading(true);

    const body = {
      userName: userName,
      password: password,
    };

    let response = { eMessage: "no value received" };

    response = await useFetch("POST", "/auth/staff/login", body).then(
      function ({ data, status }) {
        console.log(status);
        if (status != 200) {
          setfacultyErrorMsg(data.eMessage);
          return data;
        }
        if (status === 200) {
          // const cipher = cryptr.encrypt(JSON.stringify(data));
          const cipher = JSON.stringify(data);

          localStorage.setItem("user", cipher);

          sessionStorage.setItem("title", "Dashboard");
          if (data.role == "ADMIN") {
            sessionStorage.setItem("title", "Feedbacks");
          }
        }
        return data;
      }
    );

    console.log("hi");
    setLoading(false);
  };

  // * function that is used to logout for students
  const facultyLogout = async () => {
    setLoading(true);

    let body = {};
    await useFetch("POST", "/auth/staff/logout", body)
      .then(async function (res) {
        localStorage.removeItem("user");
      })
      .catch((err) => {
        console.log(err);
      });
    sessionStorage.removeItem("title");
    setLoading(false);
  };

  const value = {
    student,
    staff,
    studentErrorMsg,
    facultyErrorMsg,
    studentLogin,
    isLoggedIn,
    fetchUser,
    studentLogout,
    facultyLogin,
    facultyLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading && (
        <div
          role="status"
          className="flex  flex-col items-center justify-center min-h-screen"
        >
          <div className=""></div>
          <span className="">Loading...</span>
        </div>
      )}
      {!loading && children}
    </AuthContext.Provider>
  );
};
