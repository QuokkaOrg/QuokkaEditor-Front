import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { API_URL, ERRORS } from "../../../consts";
import axios from "axios";

interface Login {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">Login</h1>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values: Login) =>
          axios.post(API_URL + "auth/login", values).then((res) => {
            if (res.data.status_code) {
              alert(res.data.detail);
            } else {
              sessionStorage.setItem("userToken", res.data.token);
              alert("Succesfully logged in");
            }
          })
        }
      >
        {() => (
          <Form className="flex flex-col justify-center w-52">
            <label htmlFor="username">Username</label>
            <Field
              id="username"
              name="username"
              placeholder="Username"
              className="border border-black rounded-md p-0.5"
            />

            <label htmlFor="password">Password</label>
            <Field
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              className="border border-black rounded-md p-0.5"
            />

            <button
              type="submit"
              className="bg-slate-600 text-white rounded-full w-1/2 self-center font-semibold m-2 p-1"
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
