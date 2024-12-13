import React, { useEffect, useState } from "react";
import "./ProfilePage.scss";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Button } from "@mui/material";
import { IUserBank, TUserDetails } from "../../interfaces/user-interfaces";
import { getUserById, updateUserBank } from "../../services/user-service";
import { toastSuccess } from "../../utils/notifications-utils";


const validationShopSchema = Yup.object().shape({
    name: Yup.string(),
    phoneNumber: Yup.string(),
    email: Yup.string(),
});

const validationBankSchema = Yup.object().shape({
    bankName: Yup.string(),
    bankId: Yup.string(),
    fullName: Yup.string(),
});


const ProfilePage = () => {
    const [bank, setBank] = useState<IUserBank>({
        id: "",
        bankName: "",
        bankId: "",
        fullName: "",
    });
    const [userDetails, setUserDetails] = useState<TUserDetails>();
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmitBank = (values: any) => {
        setIsLoading(true)
        if (userDetails?.id) updateUserBank(userDetails?.id, values, handleGetUserDetails)
        toastSuccess("Cập nhật ngân hàng thành công")
    };


    const handleSubmitShop = () => { }

    const handleGetUserDetails = async () => {
        const userDetails = JSON.parse(localStorage.getItem("userDetails") || "") as TUserDetails
        const user = await getUserById(userDetails.id)
        setUserDetails(user.data)
        setBank(user.data.userBank)
        setIsLoading(false)
    }

    useEffect(() => {
        setIsLoading(true)
        handleGetUserDetails()
    }, []);

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-title">Chỉnh sửa thông tin</div>
            </div>
            <div className="page-contents">
                <div className="Edit">
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="Edit__shop">
                            <div className="Edit__shop-header">
                                <div className="Edit__shop-title">Thông tin cửa hàng</div>
                            </div>

                            <div className="Edit__shop-contents">
                                <Formik
                                    initialValues={{ ...userDetails, name: `${userDetails?.firstName} ${userDetails?.lastName}`, phoneNumber: userDetails?.phone }}
                                    validationSchema={validationShopSchema}
                                    onSubmit={handleSubmitShop}
                                >
                                    {(formikProps) => (
                                        <Form className="Edit__shop-form">
                                            <div className="Edit__shop-item">
                                                <div className="Edit__shop-item-label">
                                                    Tên người dùng:
                                                </div>
                                                <div className="Edit__shop-item-input">
                                                    <Field
                                                        type="text"
                                                        name="name"
                                                        disabled
                                                        placeholder="Nhập tên cửa hàng"
                                                    />
                                                </div>
                                            </div>
                                            <div className="Edit__shop-item">
                                                <div className="Edit__shop-item-label">Email:</div>
                                                <div className="Edit__shop-item-input">
                                                    <Field type="text" name="email" placeholder="Email" disabled />
                                                </div>
                                            </div>
                                            <div className="Edit__shop-item">
                                                <div className="Edit__shop-item-label">Điện thoại:</div>
                                                <div className="Edit__shop-item-input">
                                                    <Field
                                                        type="text"
                                                        name="phoneNumber"
                                                        placeholder="Số điện thoại"
                                                    />
                                                </div>
                                            </div>
                                            <div className="Edit__shop-submit">
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="success"
                                                    disabled={!formikProps.dirty}
                                                >
                                                    Sửa
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    )}
                    <div className="Edit__bank"></div>
                </div>
            </div>
            <div className="page-contents">
                <div className="Edit">
                    {isLoading ? <div>Loading...</div> : <div className="Edit__shop">
                        <div className="Edit__shop-header">
                            <div className="Edit__shop-title">Thông tin ngân hàng</div>
                        </div>
                        <div className="Edit__shop-contents">
                            <Formik
                                initialValues={{
                                    bankName: bank?.bankName || "",
                                    bankId: bank?.bankId || "",
                                    fullName: bank?.fullName || "",
                                }}
                                validationSchema={validationBankSchema}
                                onSubmit={handleSubmitBank}
                            >
                                {(formikProps) => (
                                    <Form className="Edit__shop-form">
                                        <div className="Edit__shop-item">
                                            <div className="Edit__shop-item-label">
                                                Tên ngân hàng:
                                            </div>
                                            <div className="Edit__shop-item-input">
                                                <Field
                                                    type="text"
                                                    name="bankName"
                                                    placeholder="Nhập tên ngân hàng"
                                                />
                                            </div>
                                        </div>
                                        <div className="Edit__shop-item">
                                            <div className="Edit__shop-item-label">
                                                Số tài khoản:
                                            </div>
                                            <div className="Edit__shop-item-input">
                                                <Field
                                                    type="text"
                                                    name="bankId"
                                                    placeholder="Số tài khoản"
                                                />
                                            </div>
                                        </div>
                                        <div className="Edit__shop-item">
                                            <div className="Edit__shop-item-label">Tên đầy đủ:</div>
                                            <div className="Edit__shop-item-input">
                                                <Field
                                                    type="text"
                                                    name="fullName"
                                                    placeholder="Họ và tên"
                                                />
                                            </div>
                                        </div>
                                        <div className="Edit__shop-submit">
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="success"
                                                disabled={!formikProps.dirty}
                                            >
                                                Sửa
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>}


                    <div className="Edit__bank"></div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
