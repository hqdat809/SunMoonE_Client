import { LoadingButton } from "@mui/lab";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { TSignInRequest } from "../../../interfaces/user-interfaces";
import * as authService from "../../../services/auth-service";
import "./LoginForm.scss";

interface ILoginFormProps {
  setHasAccount: (value: boolean) => void;
  setAccessToken: (token: string) => void;
}

const LoginForm = ({ setHasAccount, setAccessToken }: ILoginFormProps) => {
  const navigate = useNavigate();
  const isSignIn = false;
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(
        "Email của bạn nhập không đúng. Xin vui lòng nhập lại hoặc liên hệ với admin"
      )
      .required("Email không được bỏ trống"),
    password: Yup.string().required("Mật khẩu không được bỏ trống"),
  });

  const handleNavigateHome = () => {
    navigate("/", { replace: true });
  };

  const handleSubmit = (values: TSignInRequest) => {
    authService.signIn(values, handleNavigateHome).then((data) => {
      if (data) {
        setAccessToken(data.token);
      }
    });
  };

  return (
    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 form_login">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {(formikProps) => (
          <Form onSubmit={formikProps.handleSubmit}>
            <div className="divider d-flex align-items-center my-4">
              <div className="text-center fw-bold mx-3 mb-0 login-title">
                Đăng Nhập
              </div>
            </div>

            <div className="form-outline mb-4">
              <Field
                type="email"
                name="email"
                id="form3Example3"
                className={`form-control form-control-lg  ${formikProps.errors.email &&
                  formikProps.touched.email &&
                  "login-error-field"
                  }`}
                placeholder="Enter a valid email address"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="login-error-text"
              />
            </div>

            <div className="form-outline mb-3 password-field-wrapper">
              <Field
                type={showPassword ? "text" : "password"}
                name="password"
                id="form3Example4"
                className={`form-control form-control-lg  ${formikProps.errors.password &&
                  formikProps.touched.password &&
                  "login-error-field"
                  }`}
                placeholder="Enter password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <VisibilityOffIcon />
                ) : (
                  <VisibilityIcon />
                )}
              </button>
              <ErrorMessage
                name="password"
                component="div"
                className="login-error-text"
              />
            </div>
            <div className="text-center text-lg-start mt-4 pt-2 login-actions">
              <LoadingButton
                loading={isSignIn}
                type="submit"
                variant="contained"
                className="btn btn-primary btn-lg btn-login"
              >
                Đăng Nhập
              </LoadingButton>
              <p className="large fw-bold pt-1 mb-0 text-center" style={{ marginTop: 20 }}>
                Bạn chưa có tài khoản?
                <a
                  href="#!"
                  style={{ marginLeft: 6 }}
                  className="link-danger"
                  onClick={() => setHasAccount(false)}
                >
                  Đăng ký
                </a>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
