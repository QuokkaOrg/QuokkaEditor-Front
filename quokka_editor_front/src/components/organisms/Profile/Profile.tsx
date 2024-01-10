import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { clearUser } from "../../../Redux/userSlice";
import { clearProjects } from "../../../Redux/projectsSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TOAST_MESSAGE, TOAST_OPTIONS } from "../../../consts";

const Profile: React.FC = () => {
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const userName = useAppSelector((state) => state.user.username);
  const dispatch = useAppDispatch();

  const buttonsStyle =
    "p-2 m-2 w-44 border border-white rounded-full hover:text-black hover:bg-slate-300 hover:border-bg-slate-300 duration-300 transition-all";

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearProjects());
    sessionStorage.removeItem("userToken");
    navigate("/");
    toast.success(TOAST_MESSAGE.logOut, TOAST_OPTIONS);
  };

  return (
    <div>
      <div className="mr-14 relative">
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => setShow((currShow) => !currShow)}
        >
          <img
            className="w-11 h-11 bg-project-theme-dark-600 rounded-full"
            src="/userIcon.svg"
            alt="user icon"
          />
          <span className="text-sm text-white font-semibold px-1.5 my-1 bg-project-theme-dark-600 rounded-full">
            {userName}
          </span>
        </div>
      </div>
      {show && (
        <div className="flex flex-col justify-center text-white m-1 w-72 h-48 rounded-3xl right-0 bg-project-theme-dark-600 items-center mr-14  absolute z-10">
          <span className="text-4xl m-2">Hello, {userName}!</span>
          <button className={buttonsStyle} onClick={() => navigate("/profile")}>
            Manage your account
          </button>
          <button className={buttonsStyle} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
export default Profile;
