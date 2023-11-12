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
    <div className="flex flex-col justify-center items-center p-9">
      <div className ="w-56 m-9 relative shadow rounded-[30px]">
        <div className="top-0 right-0 absolute w-[115px] h-10 bg-gradient-to-r from-[#5F6066] to-[#1f21292e] rounded-[30px]"></div>
            <button type="button" className="relative px-7 py-2 cursor-pointer bg-transparent border-none outline-none text-[#ffffff29]">Log in</button>
            <button type="button" className="relative px-8 py-2 cursor-pointer bg-transparent border-none outline-none text-white">Register</button>
      </div>
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
            <Field
              id="username"
              name="username"
              placeholder="Username"
              className="px-0 py-3 mx-0 my-1 border-b outline-none bg-transparent text-white"
            />
            <ErrorMessage
              component="div"
              className="text-red-600 font-semibold"
              name="username"
            />

            <Field
              id="email"
              name="email"
              placeholder="Email"
              type="email"
              className="px-0 py-3 mx-0 my-1 border-b outline-none bg-transparent text-white"
            />
            <ErrorMessage
              component="div"
              className="text-red-600 font-semibold"
              name="email"
            />

            <Field
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              className="px-0 py-3 mx-0 my-1 border-b outline-none bg-transparent text-white"
            />
            <ErrorMessage
              component="div"
              className="text-red-600 font-semibold"
              name="password"
            />

            <button
              type="submit"
              className="px-7 py-2 m-auto cursor-pointer bg-[#15172365] border-none shadow outline-none rounded-[30px] text-white mt-2"
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
