import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Register from "./components/organisms/register/Register";
import Login from "./components/organisms/login/Login";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex justify-evenly">
      {/* <Login /> */}
      <Register />
    </div>
  );
}

export default App;
