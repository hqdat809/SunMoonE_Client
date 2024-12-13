import { useEffect } from "react";
import "./App.css";
import Routes from "./routes/Routes";
import { checkSession } from "./services/auth-service";
import { toastError } from "./utils/notifications-utils";
import { EAuthToken } from "./interfaces/user-interfaces";

function App() {
  const handleCheckSession = async () => {
    try {
      // if (localStorage.getItem(EAuthToken.ACCESS_TOKEN))
      // await checkSession()
    } catch (error) {
      toastError("Bạn cần đăng nhập để tiếp tục")
    }
  }

  useEffect(() => {
    handleCheckSession()
  }, []);

  return (
    <div className="App">
      <Routes />
    </div>
  );
}

export default App;
