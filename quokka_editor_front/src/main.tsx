import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux/es/exports";
import { store } from "./Redux/store";
import Login from "./components/organisms/login/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./components/organisms/register/Register.tsx";
import Documents from "./components/organisms/documentsPage/Documents.tsx";
import EditorPage from "./components/organisms/documentsEditor/EditorPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/documents",
    element: <Documents />,
  },
  { path: "/documents/:documentId", element: <EditorPage /> },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <div className="min-h-screen bg-project-theme-dark-300">
      <RouterProvider router={router} />
    </div>
  </Provider>
);
