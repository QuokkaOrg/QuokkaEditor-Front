import { Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { LoginType } from "../../../types/global";
import { loginUser } from "../../../api";

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">Login</h1>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values: LoginType) =>
          loginUser(values).then((res) => {
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
            <Link to={"register"} className="text-sm text-blue-600">
              Don't have an account?
            </Link>
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
