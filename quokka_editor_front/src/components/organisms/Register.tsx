import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { ERRORS } from "../../errors";
import { RegisterType } from "../../types/global";
import { registerUser } from "../../api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TOAST_OPTIONS } from "../../consts";

const validationSchema = Yup.object().shape({
  username: Yup.string().required(ERRORS.required),
  email: Yup.string().email(ERRORS.email).required(ERRORS.required),
  password: Yup.string()
    .required(ERRORS.required)
    .min(8, ERRORS.passwordLength),
});

const Register: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center p-12">
      <div className="w-56 m-9 shadow rounded-[30px]">
        <Link to={"/"}>
          <button
            type="button"
            className="px-7 py-2 cursor-pointer bg-transparent border-none outline-none text-project-theme-dark-115"
          >
            Log in
          </button>
        </Link>
        <button
          type="button"
          className="px-8 py-2 cursor-pointer bg-gradient-to-r from-project-theme-dark-110 to-project-theme-dark-105 rounded-[30px] border-none outline-none text-white"
        >
          Register
        </button>
      </div>
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={(values: RegisterType) =>
          registerUser(values).then(() => {
            toast.success("Successfully registered", TOAST_OPTIONS);
            navigate("/");
          })
        }
        validationSchema={validationSchema}
      >
        {() => (
          <Form className="flex flex-col justify-center w-72">
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
              className="px-7 py-2 m-auto cursor-pointer bg-project-theme-dark-120 border-none shadow outline-none rounded-[30px] text-white mt-4"
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
