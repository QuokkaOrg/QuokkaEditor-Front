import { useAppSelector } from "../../../Redux/hooks";
import Client from "./Client";

const ConnectedClients: React.FC = () => {
  const connectedClients = useAppSelector((state) => state.clients.clients);

  return (
    <div className="flex justify-center items-center">
      {connectedClients?.map(({ token, line, ch, clientColor }) => (
        <Client
          clientToken={token}
          currentLine={line}
          currentChar={ch}
          clientColor={clientColor || "#FFFFFF"}
        />
      ))}
    </div>
  );
};
export default ConnectedClients;
