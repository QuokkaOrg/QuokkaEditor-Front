import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { API_URL } from "../../../consts";
import axios from "axios";
import { ERRORS } from "../../../errors";

interface Register {
  username: string;
  email: string;
  password: string;
}
const validationSchema = Yup.object().shape({
  username: Yup.string().required(ERRORS.required),
  email: Yup.string().email(ERRORS.email).required(ERRORS.required),
  password: Yup.string()
    .required(ERRORS.required)
    .min(8, ERRORS.passwordLength),
});

const Register: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">Register</h1>
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={(values: Register) =>
          axios
            .post(API_URL + "auth/register", values)
            .then((res) => res.status === 200 && "Successfully registered")
        }
        validationSchema={validationSchema}
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
            <ErrorMessage
              component="div"
              className="text-red-600 font-semibold"
              name="username"
            />

            <label htmlFor="email">Email</label>
            <Field
              id="email"
              name="email"
              placeholder="Email"
              type="email"
              className="border border-black rounded-md p-0.5"
            />
            <ErrorMessage
              component="div"
              className="text-red-600 font-semibold"
              name="email"
            />

            <label htmlFor="password">Password</label>
            <Field
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              className="border border-black rounded-md p-0.5"
            />
            <ErrorMessage
              component="div"
              className="text-red-600 font-semibold"
              name="password"
            />

            <button
              type="submit"
              className="bg-slate-600 text-white rounded-full w-1/2 self-center font-semibold m-2 p-1"
            >
              Register
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
