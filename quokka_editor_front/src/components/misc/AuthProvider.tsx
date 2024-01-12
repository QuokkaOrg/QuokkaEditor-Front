import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import { refreshToken } from "../../api";
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);
const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const tokenInterval = useRef<number>();

  useEffect(() => {
    tokenInterval.current = setInterval(() => {
      refreshToken().then((res) =>
        sessionStorage.setItem("userToken", "Bearer " + res.data.token)
      );
      //Token is refreshing every 25 minutes
    }, 1000 * 60 * 25);
    return () => clearInterval(tokenInterval.current);
  }, []);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
