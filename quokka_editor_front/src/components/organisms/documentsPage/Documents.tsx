import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { useEffect } from "react";
import { getDocuments } from "../../../Redux/documentsSlice";
import axios from "axios";
import { API_URL } from "../../../consts";
import DeleteDocument from "../../molecules/deleteDocument/DeleteDocument";
import AddDocument from "../../molecules/addDocument/AddDocument";

const Documents: React.FC = () => {
  const navigate = useNavigate();

  const documentsState = useAppSelector((state) => state.documents);
  const dispatch = useAppDispatch();

  useEffect(() => {
    axios
      .get(API_URL + "documents", {
        headers: { Authorization: sessionStorage.getItem("userToken") },
      })
      .then((res) => dispatch(getDocuments(res.data)));
  }, []);

  const logoutAction = () => {
    sessionStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <div>
      <button type="button" onClick={logoutAction}>
        Logout
      </button>
      <AddDocument />
      {documentsState.documents.map((document) => (
        <div key={document.id} className="border-2 m-2">
          {document.title}
          <DeleteDocument id={document.id} title={document.title} />
        </div>
      ))}
    </div>
  );
};

export default Documents;
