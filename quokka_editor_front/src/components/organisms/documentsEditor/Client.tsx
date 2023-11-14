import { RemoteClient } from "../../../Redux/clientsSlice";

interface ClientProps {
  clientToken: string;
  currentLine: number;
  currentChar: number;
  clientColor: string;
}

const Client: React.FC<ClientProps> = ({
  clientToken,
  currentLine,
  currentChar,
  clientColor,
}) => {
  return (
    <div className="group flex flex-col justify-center items-center mx-1 relative">
      <img
        className="rounded-full shadow-md shadow-slate-700"
        style={{ backgroundColor: clientColor }}
        src="/userIcon.svg"
      />
      <span
        className="rounded-full shadow-md shadow-slate-700 px-1 mt-1 text-sm font-semibold"
        style={{ backgroundColor: clientColor }}
      >
        {clientToken}
      </span>
      <div className="absolute invisible w-40 p-2 top-3/4 z-10 rounded-md font-semibold bg-project-theme-dark-600 group-hover:visible">
        <p>{`Current Line: ${currentLine + 1}`}</p>
        <p>{`Current Char: ${currentChar}`}</p>
      </div>
    </div>
  );
};
export default Client;
