import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { TRegisterRequest } from "../../../interfaces/user-interfaces";
import * as authService from "../../../services/auth-service";
import "./RegisterForm.scss";
import Timing from "../../../components/timing/Timing";
import OTPInput from "react-otp-input";
import * as RoutePath from "../../../routes/paths";

interface IRegisterProps {
  setHasAccount: (value: boolean) => void;
}
const RegisterForm = ({ setHasAccount }: IRegisterProps) => {
  const navigate = useNavigate();
  const isSignIn = false;
  const [isSendOTP, setIsSendOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(30);

  const validationOtpSchema = Yup.object().shape({
    otp: Yup.string().required("Trường này không được bỏ trống").min(6),
  });

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Họ không được bỏ trống"),
    lastName: Yup.string().required("Tên không được bỏ trống"),
    email: Yup.string()
      .email(
        "Email của bạn nhập không đúng. Xin vui lòng nhập lại hoặc liên hệ với admin"
      )
      .required("Email không được bỏ trống"),
    password: Yup.string().required("Mật khẩu không được bỏ trống"),
    phone: Yup.string().required("Số điện thoại không được bỏ trống"),
  });

  const handleNavigateHome = () => {
    navigate("/", { replace: true });
    authService.getTokenFromKiotViet();
  };

  const handleSubmitOtp = (values: { otp: string }) => {
    setLoading(true);
    authService
      .verifyEmail({ email, otp: values.otp }, handleNavigateHome)
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSendOtp = (values?: string) => {
    setIsSendOTP(true);
    authService.sendOTP(values || email).finally(() => {});
  };

  const handleNavigateToHomePage = () => {
    navigate(RoutePath.DASHBOARD, { replace: true });
  };

  const handleSubmit = (
    values: TRegisterRequest,
    formikProps: FormikHelpers<any>
  ) => {
    setLoading(true);
    setEmail(values.email);
    authService.register(values, handleSendOtp, formikProps).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1 register__form">
      {isSendOTP ? (
        <Formik
          initialValues={{
            otp: "",
          }}
          validationSchema={validationOtpSchema}
          onSubmit={(values) => {
            handleSubmitOtp(values);
          }}
        >
          {(formikProps) => (
            <Form onSubmit={formikProps.handleSubmit}>
              <div className="divider d-flex align-items-center my-4">
                <div className="text-center fw-bold mx-3 mb-0 login-title">
                  Xác nhận OTP
                </div>
              </div>
              <div className="form-outline mb-3">
                <OTPInput
                  value={formikProps.values.otp}
                  onChange={(value) => formikProps.setFieldValue("otp", value)}
                  numInputs={6}
                  containerStyle={{ justifyContent: "center", gap: "8px" }}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props} className="otp" />}
                />
              </div>
              {!loading && (
                <Timing
                  title="Bạn chưa nhận được OTP? "
                  defaultValue={30}
                  action={handleSendOtp}
                />
              )}
              <div className="text-center text-lg-start mt-4 pt-2 login-actions">
                <LoadingButton
                  loading={loading}
                  type="submit"
                  variant="contained"
                  className="btn btn-primary btn-lg btn-login"
                  disabled={
                    formikProps.values.otp
                      ? formikProps.values.otp?.length < 6
                      : true
                  }
                >
                  Xác nhận OTP
                </LoadingButton>
              </div>
              <div className="note" onClick={handleNavigateToHomePage}>
                Tải lại trang để vào trang chủ
              </div>
              {/* <div className="skip-action">
                <div className="skip-button">Bỏ qua</div>
              </div> */}
            </Form>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, formikProps) => {
            handleSubmit(values, formikProps);
          }}
        >
          {(formikProps) => (
            <Form onSubmit={formikProps.handleSubmit}>
              <div className="divider d-flex align-items-center my-4">
                <div className="text-center fw-bold mx-3 mb-0 login-title">
                  Đăng Ký
                </div>
              </div>

              <div className="form-outline mb-4 register__row">
                <div>
                  <Field
                    type="text"
                    name="firstName"
                    label="Họ"
                    as={TextField}
                    error={
                      formikProps.errors.firstName &&
                      formikProps.touched.firstName
                    }
                    id="form3Example3"
                    className={`form-control form-control-lg  ${
                      formikProps.errors.firstName &&
                      formikProps.touched.firstName &&
                      "login-error-field"
                    }`}
                    placeholder="Họ"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="login-error-text"
                  />
                </div>

                <div>
                  <Field
                    type="text"
                    name="lastName"
                    label="Tên"
                    error={
                      formikProps.errors.lastName &&
                      formikProps.touched.lastName
                    }
                    as={TextField}
                    id="form3Example3"
                    className={`form-control form-control-lg  ${
                      formikProps.errors.lastName &&
                      formikProps.touched.lastName &&
                      "login-error-field"
                    }`}
                    placeholder="Tên"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="login-error-text"
                  />
                </div>
              </div>

              <div className="form-outline mb-4">
                <Field
                  type="email"
                  name="email"
                  label="Email"
                  error={formikProps.errors.email && formikProps.touched.email}
                  as={TextField}
                  id="form3Example3"
                  className={`form-control form-control-lg  ${
                    formikProps.errors.email &&
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
              <div className="form-outline mb-3">
                <Field
                  type="password"
                  name="password"
                  label="Mật khẩu"
                  error={
                    formikProps.errors.password && formikProps.touched.password
                  }
                  as={TextField}
                  id="form3Example4"
                  className={`form-control form-control-lg  ${
                    formikProps.errors.password &&
                    formikProps.touched.password &&
                    "login-error-field"
                  }`}
                  placeholder="Nhập mật khẩu"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="login-error-text"
                />
              </div>
              <div className="form-outline mb-3">
                <Field
                  type="text"
                  name="phone"
                  label="Số điện thoại"
                  error={formikProps.errors.phone && formikProps.touched.phone}
                  as={TextField}
                  id="form3Example4"
                  className={`form-control form-control-lg  ${
                    formikProps.errors.phone &&
                    formikProps.touched.phone &&
                    "login-error-field"
                  }`}
                  placeholder="Nhập mật số điện thoại"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="login-error-text"
                />
              </div>
              <div className="text-center text-lg-start mt-4 pt-2 login-actions">
                <LoadingButton
                  loading={loading}
                  type="submit"
                  variant="contained"
                  className="btn btn-primary btn-lg btn-login"
                >
                  Đăng Ký
                </LoadingButton>
                <p className="small fw-bold mt-2 pt-1 mb-0 text-center">
                  Bạn đã có tài khoản?
                  <a
                    href="#!"
                    className="link-danger"
                    onClick={() => setHasAccount(true)}
                  >
                    Đăng nhập
                  </a>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default RegisterForm;
