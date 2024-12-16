import React, { useCallback, useContext, useEffect, useState } from "react";
import "./Order.scss";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import { Button, Divider, FormLabel, Input, InputBase, MenuItem, Select, TextareaAutosize, TextField } from "@mui/material";
import * as provinceService from "../../../services/province-service";
import EditNoteIcon from "@mui/icons-material/EditNote";
import InventoryIcon from "@mui/icons-material/Inventory";
import { CartContext, ICart } from "../../layouts/Layouts";
import DeleteIcon from "@mui/icons-material/Delete";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaidIcon from "@mui/icons-material/Paid";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import QRCode from "../../../assets/images/QRCode.png";
import DescriptionIcon from "@mui/icons-material/Description";
import { createOrder } from "../../../services/order-service";
import { verifyEmail } from "../../../services/auth-service";
import { toastError, toastSuccess } from "../../../utils/notifications-utils";
import HandshakeIcon from '@mui/icons-material/Handshake';
import { PAYMENT_TYPE } from "../../../enum/OrderEnum";
import { useNavigate } from "react-router-dom";
import * as RoutePath from "../../../routes/paths";

const Order = () => {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Tên không được bỏ trống"),
    phoneNumber: Yup.string().required("Số điện thoại không được bỏ trống"),
    province: Yup.string().required("Trường này không được bỏ trống"),
    district: Yup.string().required("Trường này không được bỏ trống"),
    ward: Yup.string().required("Trường này không được bỏ trống"),
    address: Yup.string().required("Trường này không được bỏ trống"),
  });

  const [formLocationValues, setFormLocationValues] = useState({
    name: "",
    phoneNumber: "",
    province: "",
    district: "",
    ward: "",
    address: "",
  });
  const [addressRecipient, setAddressRecipient] = useState<any>();

  const [provinceCode, setProvinceCode] = useState<number>();
  const [districtCode, setDistrictCode] = useState<number>();

  const [listProvince, setListProvince] = useState<any[]>([]);
  const [listDistrict, setListDistrict] = useState<any[]>([]);
  const [listWard, setListWard] = useState<any[]>([]);
  const [productInCart, setProductInCart] = useState<ICart[]>(cart);

  const [note, setNote] = useState("");



  const [payment, setPayment] = React.useState(PAYMENT_TYPE.COD);

  const handleChange = (event: React.SyntheticEvent, newValue: PAYMENT_TYPE) => {
    setPayment(newValue);
    setProductInCart(cart)
  };

  const handleGetProvices = () => {
    provinceService.getProvinces().then((res) => {
      setListProvince(res);
    });
  };

  useEffect(() => {
    handleGetProvices();
  }, []);

  const handleSubmitUserInfo = (values: any) => {
    const addRecipient = { ...values };
    setFormLocationValues(values);
    if (values.province) {
      const provinceName = listProvince.find(
        (province) => province.code === values.province
      )?.name;
      addRecipient.province = provinceName;
    }
    if (values.district) {
      const districtName = listDistrict.find(
        (district) => district.code === values.district
      )?.name;
      addRecipient.district = districtName;
    }
    if (values.ward) {
      const wardName = listWard.find((ward) => ward.code === values.ward)?.name;
      addRecipient.ward = wardName;
    }
    setAddressRecipient(addRecipient);
  };

  const handleEditLocation = () => {
    setAddressRecipient(null);
  };

  const handleDeleteItem = (index: number) => {
    const newListCart = [...cart];
    newListCart.splice(index, 1);
    setCart(newListCart);
  };

  const handleGetTotalItemInCart = useCallback(() => {
    let totalPrice = 0;
    cart.forEach((item) => {
      totalPrice += item.count;
    });
    return totalPrice.toLocaleString("vi-VN");
  }, [cart]);

  const handleGetTotalPriceCollector = useCallback(() => {
    let totalPrice = 0;
    productInCart.forEach((item) => {
      totalPrice += item.details.basePrice * item.count;
    });
    return totalPrice.toLocaleString("vi-VN");
  }, [productInCart]);

  const handleGetTotalPriceInCart = useCallback(() => {
    let totalPrice = 0;
    cart.forEach((item) => {
      totalPrice += item.details.basePrice * item.count;
    });
    return totalPrice.toLocaleString("vi-VN");
  }, [cart]);

  const handleChangeQuantity = (index: number, type: string) => {
    const newListCart = [...cart];
    if (type === "MINUS") {
      if (newListCart[index].count > 1) {
        newListCart[index].count -= 1;
      }
      setCart(newListCart);
    }
    if (type === "PLUS") {
      newListCart[index].count += 1;
      setCart(newListCart);
    }
  };

  const handleChangeNote = (e: any) => {
    setNote(e.target.value);
  }

  const handleChangePrice = (e: any, cartDetail: ICart) => {
    const newCarts = cart.map(c => {
      if (c.details.id === cartDetail.details.id) {
        return ({ ...c, details: { ...cartDetail.details, basePrice: e.target.value } })
      }
      return c;
    })

    setProductInCart(newCarts)
  }


  const handleCreateOrder = async () => {
    const orderDetails = cart.map(product => {
      return {
        productId: product.details.id,
        quantity: product.count,
        productName: product.details.name,
        price: product.details.basePrice,
        discount: 0,
        discountRatio: 0,
        viewDiscount: 0.0000
      }
    })

    if (!addressRecipient) {
      toastError("Vui lòng lưu thông tin liên lạc")
      return
    }

    let description = '';

    switch (payment) {
      case (PAYMENT_TYPE.COD):
        description = "COD"
        break;
      case (PAYMENT_TYPE.BANKING):
        description = "BANKING"
        break;
      case (PAYMENT_TYPE.COLLECTOR):
        description = "Thu hộ " + handleGetTotalPriceCollector() + "đ"
        break;
    }

    const userDetails = JSON.parse(localStorage.getItem("userDetails") || "")

    const address = `${addressRecipient.address}, ${addressRecipient.ward}, ${addressRecipient.district}, ${addressRecipient.province}`;
    const customerDetails = {
      id: userDetails.customerId,
    }

    const orderDelivery = {
      receiver: addressRecipient.name,
      address: address,
      contactNumber: addressRecipient.phoneNumber,
      wardName: addressRecipient.ward,
      price: parseInt(handleGetTotalPriceInCart())
    }

    const newOrder = {
      description: description + '\n' + note,
      saleChannelId: 1000003992,
      branchId: 286368,
      orderDetails,
      orderDelivery,
      customer: customerDetails
    }

    await createOrder(newOrder)

    toastSuccess("Đã tạo đơn hàng thành công", "Thành công")
    navigate(RoutePath.ORDER_LIST);
    setCart([])
  }

  useEffect(() => {
    setProductInCart(cart);
  }, [cart]);


  return (
    <div className="Order">
      <div className="Order__userInfo">
        <div className="Order__title">
          <div className="Order__title-icon">
            <LocationOnIcon />
          </div>
          <div className="Order__title-text">Địa chỉ nhận hàng</div>
        </div>

        {!addressRecipient ? (
          <div>
            <div className="Order__label">Thêm địa chỉ mới:</div>
            <div className="Order__form">
              <Formik
                initialValues={formLocationValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  handleSubmitUserInfo(values);
                }}
              >
                {({
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  values,
                  handleSubmit,
                  setFieldValue,
                }) => (
                  <Form onSubmit={handleSubmit} className="Form">
                    <div className="form-outline mb-4 Form__row">
                      <Field
                        type="text"
                        name="name"
                        as={TextField}
                        id="form3Example3"
                        label="Họ và tên (*)"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="small"
                        className={`form-control form-control-lg  ${errors.name && touched.name && "Form__error-field"
                          }`}
                        helperText={touched.name && errors.name}
                      />
                      <Field
                        type="text"
                        name="phoneNumber"
                        as={TextField}
                        id="form3Example3"
                        label="Số điện thoại (*)"
                        value={values.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="small"
                        className={`form-control form-control-lg  ${errors.phoneNumber &&
                          touched.phoneNumber &&
                          "Form__error-field"
                          }`}
                        helperText={touched.phoneNumber && errors.phoneNumber}
                      />
                    </div>
                    <div className="form-outline mb-4 Form__row">
                      <Field
                        type="email"
                        name="province"
                        as={TextField}
                        id="form3Example3"
                        label="Tỉnh / Thành phố (*)"
                        value={provinceCode}
                        onChange={(e: React.ChangeEvent<any>) => {
                          handleChange(e);
                          setFieldValue("district", "");
                          setFieldValue("ward", "");
                          setDistrictCode(undefined);
                          setProvinceCode(e.target.value)
                          setListDistrict(listProvince.find(d => d.code === e.target.value).districts)
                        }}
                        onBlur={handleBlur}
                        size="small"
                        select
                        className={`form-control form-control-lg  ${errors.province &&
                          touched.province &&
                          "Form__error-field"
                          }`}
                        helperText={touched.province && errors.province}
                      >
                        {listProvince?.map((province) => (
                          <MenuItem value={province.code}>
                            {province.name}
                          </MenuItem>
                        ))}
                      </Field>
                      <Field
                        type="text"
                        name="district"
                        as={TextField}
                        select
                        id="form3Example3"
                        label="Quận / Huyện (*)"
                        value={districtCode}
                        onChange={(e: React.ChangeEvent<any>) => {
                          handleChange(e)
                          setFieldValue("ward", "");
                          setDistrictCode(e.target.value);
                          setListWard(listDistrict.find(d => d.code === e.target.value).wards);
                        }}
                        onBlur={handleBlur}
                        disabled={!provinceCode}
                        size="small"
                        className={`form-control form-control-lg  ${errors.district &&
                          touched.district &&
                          "Form__error-field"
                          }`}
                        helperText={touched.district && errors.district}
                      >
                        {listDistrict?.map((province) => (
                          <MenuItem value={province.code}>
                            {province.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </div>
                    <div className="form-outline mb-4 Form__row">
                      <Field
                        type="email"
                        name="ward"
                        as={TextField}
                        select
                        id="form3Example3"
                        label="Xã / Phường (*)"
                        value={values.ward}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!districtCode}
                        size="small"
                        className={`form-control form-control-lg  ${errors.ward &&
                          touched.ward &&
                          values.district &&
                          "Form__error-field"
                          }`}
                        helperText={
                          values.district && touched.ward && errors.ward
                        }
                      >
                        {listWard?.map((province) => (
                          <MenuItem value={province.code}>
                            {province.name}
                          </MenuItem>
                        ))}
                      </Field>
                      <Field
                        type="text"
                        name="address"
                        as={TextField}
                        id="form3Example3"
                        label="Địa chỉ (*)"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        size="small"
                        className={`form-control form-control-lg  ${errors.address &&
                          touched.address &&
                          "Form__error-field"
                          }`}
                        helperText={touched.address && errors.address}
                      />
                    </div>
                    <div className="text-center text-lg-start pt-2 login-actions Form__buttons-save Form__buttons-primary">
                      <div className="Form__note">
                        Lưu ý: Lưu địa chỉ trước khi đặt hàng
                      </div>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        className="btn btn-primary btn-lg btn-login"
                      >
                        Lưu
                      </LoadingButton>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        ) : (
          <div className="Order__location">
            <div className="Order__userRecipient">
              <div className="Order__userRecipient-title">
                Thông tin người nhận:
              </div>
              <div className="Order__userRecipient-info">
                <div className="Order__userRecipient-info-item">
                  <div className="Order__userRecipient-info-label">
                    Họ và tên:
                  </div>
                  <div className="Order__userRecipient-info-values">
                    {addressRecipient?.name}
                  </div>
                </div>
                <div className="Order__userRecipient-info-item">
                  <div className="Order__userRecipient-info-label">
                    Số điện thoại(+84):
                  </div>
                  <div className="Order__userRecipient-info-values">
                    {addressRecipient?.phoneNumber}
                  </div>
                </div>
                <div className="Order__userRecipient-info-item">
                  <div className="Order__userRecipient-info-label">
                    Tỉnh / Thành phố:
                  </div>
                  <div className="Order__userRecipient-info-values">
                    {addressRecipient?.province}
                  </div>
                </div>
                <div className="Order__userRecipient-info-item">
                  <div className="Order__userRecipient-info-label">
                    Quận / Huyện:
                  </div>
                  <div className="Order__userRecipient-info-values">
                    {addressRecipient?.district}
                  </div>
                </div>
                <div className="Order__userRecipient-info-item">
                  <div className="Order__userRecipient-info-label">
                    Phường / Xã:
                  </div>
                  <div className="Order__userRecipient-info-values">
                    {addressRecipient?.ward}
                  </div>
                </div>
                <div className="Order__userRecipient-info-item">
                  <div className="Order__userRecipient-info-label">
                    Địa chỉ:
                  </div>
                  <div className="Order__userRecipient-info-values">
                    {addressRecipient?.address}
                  </div>
                </div>
              </div>
            </div>
            <div className="Order__action" onClick={handleEditLocation}>
              <EditNoteIcon />
            </div>
          </div>
        )}
      </div>
      <div className="Order__delivery">
        <div className="Order__title">
          <div className="Order__title-icon">
            <PaymentsIcon />
          </div>
          <div className="Order__title-text">Phương thức thanh toán</div>
        </div>
        <div className="Order__tabs">
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={payment}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab
                    label="COD"
                    value={PAYMENT_TYPE.COD}
                    icon={<PaidIcon />}
                    iconPosition="start"
                  />
                  <Tab
                    label="Chuyển khoản"
                    value={PAYMENT_TYPE.BANKING}
                    icon={<AccountBalanceIcon />}
                    iconPosition="start"
                  />
                  <Tab
                    label="Thu Hộ"
                    value={PAYMENT_TYPE.COLLECTOR}
                    icon={<HandshakeIcon />}
                    iconPosition="start"
                  />
                </TabList>
              </Box>
              <TabPanel value={PAYMENT_TYPE.COD}>
                <div>Lưu ý: Khách hàng nhận hàng mới thanh toán</div>
              </TabPanel>
              <TabPanel value={PAYMENT_TYPE.BANKING}>
                <div className="Order__tabs-banking">
                  <div className="Order__tabs-banking-info">
                    <div className="Order__tabs-banking-name Order__tabs-banking-item">
                      <div className="Order__tabs-banking-label">
                        Tên ngân hàng:
                      </div>
                      <div className="Order__tabs-banking-value">
                        VIETCOMBANK
                      </div>
                    </div>
                    <div className="Order__tabs-banking-id Order__tabs-banking-item">
                      <div className="Order__tabs-banking-label">
                        Số tài khoản:{" "}
                      </div>
                      <div className="Order__tabs-banking-value">
                        0051000326996
                      </div>
                    </div>
                    <div className="Order__tabs-banking-owner Order__tabs-banking-item">
                      <div className="Order__tabs-banking-label">
                        Chủ tài khoản
                      </div>
                      <div className="Order__tabs-banking-value">
                        Hà Thị Thanh Thúy
                      </div>
                    </div>
                    <div className="Order__tabs-banking-branch Order__tabs-banking-item">
                      <div className="Order__tabs-banking-label">
                        Chi nhánh:
                      </div>
                      <div className="Order__tabs-banking-value">
                        PGD Bình Định
                      </div>
                    </div>
                    <div className="Order__tabs-banking-branch Order__tabs-banking-item">
                      <div className="Order__tabs-banking-label bold">
                        Nội dung:
                      </div>
                      <div className="Order__tabs-banking-value">
                        Mã đơn hàng (hiển thị sau khi bạn đặt hàng)
                      </div>
                    </div>
                  </div>
                  <div className="Order__tabs-banking-qr">
                    <div
                      className="Order__tabs-banking-qr-image"
                      style={{ backgroundImage: `url(${QRCode})` }}
                    ></div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value={PAYMENT_TYPE.COLLECTOR}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  Chỉnh sửa giá của từng sản phẩm theo mức thu hộ, tổng thu hộ <span style={{ fontSize: 20, fontWeight: 'bold' }}>{handleGetTotalPriceCollector()}</span>đ
                  {/* <FormLabel >Nhập mức tiền thu hộ (vnđ)</FormLabel>
                  <Input value={collector} placeholder="VND" onChange={(e) => {
                    setCollector(Number(e.target.value.replace(/\D/g, "")).toLocaleString('vi-VN'))
                  }} /> */}
                </div>
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
      <div className="Order__products">
        <div className="Order__title">
          <div className="Order__title-icon">
            <InventoryIcon />
          </div>
          <div className="Order__title-text">Sản phẩm</div>
        </div>
        <div className="Order__listProduct">
          {productInCart.map((cartItem, index) => (
            <div className="Order__item">
              <div
                className="Order__item-image"
                style={{
                  backgroundImage: `url(${cartItem.details?.images?.[0]})`,
                }}
              ></div>
              <div className="Order__item-name">{cartItem.details?.name}</div>
              <div className="Order__item-price">
                {payment === PAYMENT_TYPE.COLLECTOR ?
                  <InputBase
                    type="number"
                    className="Order__item-price-input"
                    dir="rtl"
                    value={cartItem.details?.basePrice}
                    onChange={(e) => handleChangePrice(e, cartItem)} />
                  : cartItem.details?.basePrice.toLocaleString("vi-VN")}
              </div>
              <span>x</span>
              <div className="Order__item-quantity">
                <div className="Order__item-quantity-input">
                  <div className="Order__item-quantity">
                    <div
                      className="Order__item-desc"
                      onClick={() => {
                        handleChangeQuantity(index, "MINUS");
                      }}
                    >
                      -
                    </div>
                    <div className="Order__item-number">
                      <input value={cartItem.count} />
                    </div>
                    <div
                      className="Order__item-asc"
                      onClick={() => {
                        handleChangeQuantity(index, "PLUS");
                      }}
                    >
                      +
                    </div>
                  </div>
                </div>
              </div>
              <span>=</span>
              <div className="Order__item-totalPrice">
                {(cartItem.details?.basePrice * cartItem.count).toLocaleString(
                  "vi-VN"
                )}
                đ
              </div>
              <div
                className="Order__item-action"
                onClick={() => handleDeleteItem(index)}
              >
                <DeleteIcon />
              </div>
            </div>
          ))}
        </div>

        <div className="Order__total">
          <div className="Order__total-label">Tổng cộng:</div>
          <div className="Order__total-item">
            {handleGetTotalItemInCart()} <span>(sản phẩm)</span>
          </div>
          <span>=</span>
          <div className="Order__total-price">
            {handleGetTotalPriceCollector()}đ
          </div>
        </div>
      </div>

      <div className="Order__note">
        <div className="Order__title">
          <div className="Order__title-icon">
            <PaymentsIcon />
          </div>
          <div className="Order__title-text">Ghi chú</div>
        </div>
        <div className="Order__tabs">
          <textarea onChange={handleChangeNote} className="Order__note-textarea" placeholder="Nhập ghi chú..." cols={5} />
        </div>
      </div>
      <div className="Order__bill">
        <div className="Order__title">
          <div className="Order__title-icon">
            <DescriptionIcon />
          </div>
          <div className="Order__title-text">Hóa đơn</div>
        </div>
        <div className="Order__bill-details">
          <div className="Order__bill-item">
            <div className="Order__bill-label">Số sản phẩm: </div>
            <div className="Order__bill-value">
              {handleGetTotalItemInCart()} (sản phẩm)
            </div>
          </div>
          <div className="Order__bill-item">
            <div className="Order__bill-label">Tổng cộng: </div>
            <div className="Order__bill-value">
              {handleGetTotalPriceInCart()}đ
            </div>
          </div>
          <div className="Order__bill-item">
            <div className="Order__bill-label">Phí vận chuyển: </div>
            <div className="Order__bill-value">Chưa tính</div>
          </div>
          <div className="Order__bill-item">
            <div className="Order__bill-label">Tổng thanh toán: </div>
            <div className="Order__bill-value total">
              {handleGetTotalPriceInCart()}đ
            </div>
          </div>
          <Divider />
          <div className="Order__bill-actions">
            <div className="Order__bill-back">
              <Button variant="outlined">Trở lại</Button>
            </div>
            <div className="Order__bill-submit" onClick={handleCreateOrder}>
              <Button variant="contained">Đặt hàng</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
