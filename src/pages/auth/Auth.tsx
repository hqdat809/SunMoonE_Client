import { useEffect, useState } from "react";
import LoginForm from "./login/LoginForm";
import "./Auth.scss";
import RegisterForm from "./register/Register";
import { useLocation } from "react-router-dom";

interface IAuthProps {
  setAccessToken: (token: string) => void;
}

const Auth = ({ setAccessToken }: IAuthProps) => {
  const location = useLocation();
  const status = location.state;

  const [hasAccount, setHasAccount] = useState(
    status === "REGISTER" ? false : true
  );

  return (
    <div className="login_page">
      <div className="container">
        <div className="wrapper">
          <div className="login_card">
            {hasAccount ? (
              <LoginForm
                setHasAccount={setHasAccount}
                setAccessToken={setAccessToken}
              />
            ) : (
              <RegisterForm setHasAccount={setHasAccount} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
