import { useState } from "react";
import { DocumentState } from "../../../Redux/documentsSlice";
import axios from "axios";
import { API_URL } from "../../../consts";

interface DocumentTitleUpdateProps {
  id: string;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<DocumentState>>;
}

const DocumentTitleUpdate: React.FC<DocumentTitleUpdateProps> = ({
  id,
  title,
  setTitle,
}) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(title);

  const titleSubmitHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    axios
      .patch(
        API_URL + "documents" + id,
        {
          title: newTitle,
        },
        {
          headers: { Authorization: sessionStorage.getItem("userToken") },
        }
      )
      .then((res) => {
        //TODO change alert to toast
        setIsEditable((currEditable) => !currEditable);
        alert("Title changed");
        setTitle((currDocument) => ({ ...currDocument, title: newTitle }));
      })
      .catch((err) => {
        //TODO change alert to toast
        alert("Something went wrong");
      });
  };

  return (
    <>
      <div
        className={`${
          isEditable ? "visible" : "hidden"
        } h-full w-full absolute top-0 left-0 opacity-0 z-10`}
        onClick={() => setIsEditable((currEditable) => !currEditable)}
      ></div>
      {isEditable ? (
        <input
          className="w-36 px-2 py-0.5 bg-project-theme-dark-400 focus:outline-none focus:border-project-window-bonus-100 focus:ring-1 rounded-md text-white z-20"
          type="text"
          name="titleInput"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => titleSubmitHandler(e)}
        />
      ) : (
        <span
          className="w-36 px-1 py-0.5"
          onClick={() => {
            setNewTitle(title);
            setIsEditable((currEditable) => !currEditable);
          }}
        >
          {title}
        </span>
      )}
    </>
  );
};

export default DocumentTitleUpdate;
