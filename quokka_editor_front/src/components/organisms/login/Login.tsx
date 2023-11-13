import { Field, Form, Formik } from "formik";
import { API_URL } from "../../../consts";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface Login {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center p-12">
      <div className ="w-56 m-9 shadow rounded-[30px]">
            <button type="button" className=" px-8 py-2 cursor-pointer bg-gradient-to-r from-[#1f21292e] to-[#5F6066] rounded-[30px] border-none outline-none text-white">Log in</button>
            <Link to={"register"}>
              <button type="button" className=" px-7 py-2 cursor-pointer bg-transparent border-none outline-none text-[#ffffff29]">Register</button>
            </Link>
      </div>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values: Login) =>
          axios.post(API_URL + "auth/login", values).then((res) => {
            if (res.data.status_code) {
              alert(res.data.detail);
            } else {
              sessionStorage.setItem("userToken", "Bearer " + res.data.token);
              navigate("/documents/");
            }
          })
        }
      >
        {() => (
          <Form className="flex flex-col w-72">
            <Field
              id="username"
              name="username"
              placeholder="Username"
              className="px-0 py-3 mx-0 my-1 border-b outline-none bg-transparent text-white"
            />
            <Field
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              className="px-0 py-3 mx-0 my-1 border-b outline-none bg-transparent text-white"
            />
            <button
              type="submit"
              className="px-7 py-2 m-auto cursor-pointer bg-[#15172365] border-none shadow outline-none rounded-[30px] text-white mt-4"
            >
              Login
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
