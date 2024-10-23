import { useState } from "react";
import LoginForm from "./login/LoginForm";
import "./Auth.scss";
import RegisterForm from "./register/Register";

interface IAuthProps {
  setAccessToken: (token: string) => void;
}

const Auth = ({ setAccessToken }: IAuthProps) => {
  const [hasAccount, setHasAccount] = useState(true);

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
