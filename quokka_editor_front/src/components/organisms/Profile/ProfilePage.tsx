import { ErrorMessage, Field, Form, Formik } from "formik";
import { useAppSelector } from "../../../Redux/hooks";
import * as Yup from "yup";
import { ERRORS } from "../../../errors";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../../api";
import toast from "react-hot-toast";
import { TOAST_MESSAGE, TOAST_OPTIONS } from "../../../consts";

const validationSchema = Yup.object().shape({
  username: Yup.string().required(ERRORS.required),
  email: Yup.string().email(ERRORS.email).required(ERRORS.required),
});

const ProfilePage: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen">
      <div
        className="flex absolute top-0 left-0 m-6 px-2 cursor-pointer rounded-full outline-1 outline-slate-300 hover:outline transition-all"
        onClick={() => navigate("/projects")}
      >
        <img className="rotate-90" src="/arrow.svg" alt="arrow" />
        <span className="p-2 font-bold text-lg text-slate-300">Go back</span>
      </div>
      <div className="flex flex-col items-center p-12">
        <img
          className="bg-project-theme-dark-600 rounded-full w-28 h-28"
          src="/userIcon.svg"
          alt="userIcon"
        />
        <Formik
          initialValues={{ username: user.username, email: user.email }}
          onSubmit={(values) => {
            updateUser({ ...user, ...values })
              .then((res) =>
                toast.success(TOAST_MESSAGE.userUpdated, TOAST_OPTIONS)
              )
              .catch((err) =>
                toast.error(ERRORS.somethingWrong, TOAST_OPTIONS)
              );
          }}
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

              <button
                type="submit"
                className="px-7 py-2 m-auto cursor-pointer bg-project-theme-dark-120 border-none shadow outline-none rounded-[30px] text-white mt-4"
              >
                Update User
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProfilePage;
