import React, { useCallback, useContext, useEffect, useState } from "react";
import "./Order.scss";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import { Autocomplete, Button, createFilterOptions, Divider, FormLabel, Input, InputBase, MenuItem, Select, styled, TextareaAutosize, TextField } from "@mui/material";
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
import { createOrder, getAllLocations } from "../../../services/order-service";
import { verifyEmail } from "../../../services/auth-service";
import { toastError, toastSuccess } from "../../../utils/notifications-utils";
import HandshakeIcon from '@mui/icons-material/Handshake';
import { PAYMENT_TYPE } from "../../../enum/OrderEnum";
import { useNavigate } from "react-router-dom";
import * as RoutePath from "../../../routes/paths";
import { getUserAddress, updateUserAddress } from "../../../services/user-service";
import { IUserAddress } from "../../../interfaces/user-interfaces";

const filterOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: any) => option.name,
});


const Order = () => {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Tên không được bỏ trống"),
    phoneNumber: Yup.string().required("Số điện thoại không được bỏ trống"),
    address: Yup.string().required("Trường này không được bỏ trống"),
    wardName: Yup.string(),
  });

  const [formLocationValues, setFormLocationValues] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    wardName: ""
  });
  const [addressRecipient, setAddressRecipient] = useState<any>();
  const [selectedLocation, setSelectedLocation] = useState<any>({ id: 0 });
  const [provinceData, setProvinceData] = useState<any>();
  const [wards, setWards] = useState<any[]>([]);
  const [selectedWard, setSelectedWard] = useState<any>();



  const [productInCart, setProductInCart] = useState<ICart[]>(cart);
  const [location, setLocation] = useState<any[]>();
  const [note, setNote] = useState("");



  const [payment, setPayment] = React.useState(PAYMENT_TYPE.COD);

  const handleChange = (event: React.SyntheticEvent, newValue: PAYMENT_TYPE) => {
    setPayment(newValue);
    setProductInCart(cart)
  };

  const handleGetAllLocations = async () => {
    await getAllLocations().then((res) => {
      setLocation(res)
    })
  }

  const handleGetUserAddress = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem('userDetails') || '')
      const res = await getUserAddress(userDetails.id)
      if (res.data.id) {
        const { location, id, ...userAddress } = res.data
        const addRecipient = { ...userAddress, selectedLocation: JSON.parse(location) };
        setFormLocationValues(userAddress)
        setAddressRecipient(addRecipient)
        handleSelectLocation(addRecipient.selectedLocation)

        const wardData = await handleGetWards(addRecipient.selectedLocation.name)

        const ward = wardData.filter((w: any) => w.name === addRecipient.wardName)

        setSelectedWard(ward[0])

      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleGetProvinceData()
    handleGetAllLocations()
    handleGetUserAddress()
  }, []);

  const handleSubmitUserInfo = async (values: any) => {

    try {
      values.wardName = selectedWard.name
      const userDetails = JSON.parse(localStorage.getItem('userDetails') || '')

      const addRecipient = { ...values, selectedLocation };
      await updateUserAddress(userDetails.id, { ...values, location: JSON.stringify(selectedLocation) })
      setFormLocationValues(values);
      setAddressRecipient(addRecipient);
    } catch (error) {
      console.error(error);
    }

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

  const handleGetTotalPriceNotShip = useCallback(() => {
    let totalPrice = 0;
    cart.forEach((item) => {
      totalPrice += item.details.basePrice * item.count;
    });
    return totalPrice.toLocaleString("vi-VN");
  }, [cart]);

  const handleGetWards = async (str: string) => {
    // Tách chuỗi để lấy tên tỉnh/thành phố và quận/huyện
    const parts = str.split(" - ");
    let provinceName, districtName;

    if (parts.length === 2) {
      // Trường hợp chuỗi có hai phần (ví dụ: "Hà Nội - Quận Ba Đình")
      provinceName = parts[0].trim();
      districtName = parts[1].trim();
    } else if (parts.length === 3) {
      // Trường hợp chuỗi có ba phần (ví dụ: "Bà Rịa - Vũng Tàu - Huyện X")
      provinceName = parts[0].trim() + " - " + parts[1].trim();
      districtName = parts[2].trim();
    } else {
      // Trường hợp không hợp lệ
      console.error("Invalid input format");
      return [];
    }


    let provinces = provinceData;

    if (!provinces) {
      provinces = await provinceService.getProvinces()
    }


    // Duyệt qua data để tìm đúng tỉnh/thành phố và quận/huyện
    let wards = [];
    for (const province of provinces) {
      if (province.name.endsWith(provinceName)) {
        for (const district of province.districts) {
          if (district.name.endsWith(districtName)) {
            setWards(district.wards)
            wards = district.wards;
            break;
          }
        }
      }
    }

    return wards
  }

  const handleSelectLocation = async (value: any) => {
    setSelectedLocation(value)
    handleGetWards(value.name)
    setSelectedWard(null)
  }

  const handleGetTotalPriceInCart = useCallback(() => {
    let totalPrice = 0;
    cart.forEach((item) => {
      totalPrice += item.details.basePrice * item.count;
    });
    totalPrice += 30000
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

  useEffect(() => {
    console.log(selectedWard)
  }, [selectedWard]);


  const handleChangePrice = (e: any, cartDetail: ICart) => {
    const newCarts = productInCart.map(c => {
      if (c.details.id === cartDetail.details.id) {
        return ({ ...c, details: { ...cartDetail.details, basePrice: e.target.value } })
      }
      return c;
    })

    setProductInCart(newCarts)
  }


  const handleCreateOrder = async () => {
    try {
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

      const address = `${addressRecipient.address}`;
      const customerDetails = {
        id: userDetails.customerId,
      }

      const orderDelivery = {
        receiver: addressRecipient.name,
        address: address,
        contactNumber: addressRecipient.phoneNumber,
        wardName: addressRecipient.wardName,
        locationId: addressRecipient.selectedLocation.id,
        locationName: addressRecipient.selectedLocation.name,
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
    } catch (error: any) {
      toastError(error.message)
    }

  }

  useEffect(() => {
    setProductInCart(cart);
  }, [cart]);

  const handleGetProvinceData = async () => {
    const provinceData = await provinceService.getProvinces()
    setProvinceData(provinceData)
  }




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
                      <Autocomplete
                        options={location || []}
                        getOptionLabel={(option) => option.name}
                        filterOptions={filterOptions}
                        fullWidth
                        value={selectedLocation?.id === 0 ? null : selectedLocation}
                        className={` ${!selectedLocation &&
                          "Form__error-field"
                          }`}

                        onChange={(e, value) => handleSelectLocation(value)}
                        renderInput={(params) => <TextField {...params} label="Chọn tỉnh thành" size="small" fullWidth helperText={selectedLocation === null && "Trường này không được bỏ trống"} />}
                      />

                      <Autocomplete
                        options={wards || []}
                        getOptionLabel={(option) => option.name}
                        filterOptions={filterOptions}
                        fullWidth
                        value={selectedWard}
                        className={` ${!setSelectedWard &&
                          "Form__error-field"
                          }`}

                        onChange={(e, value) => setSelectedWard(value)}
                        renderInput={(params) => <TextField {...params} label="Chọn phường xã" size="small" fullWidth />}
                      />
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
                    SĐT(+84):
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
                    {addressRecipient?.selectedLocation.name}
                  </div>
                </div>
                <div className="Order__userRecipient-info-item">
                  <div className="Order__userRecipient-info-label">
                    Phường/xã:
                  </div>
                  <div className="Order__userRecipient-info-values">
                    {addressRecipient?.wardName}
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
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexDirection: 'column' }}>
                  <span><span style={{ textDecoration: "underline" }}>Chú ý:</span> Nhấn vào giá của sản phẩm để chỉnh sửa </span>
                  {/* <FormLabel >Nhập mức tiền thu hộ (vnđ)</FormLabel>
                  <Input value={collector} placeholder="VND" onChange={(e) => {
                    setCollector(Number(e.target.value.replace(/\D/g, "")).toLocaleString('vi-VN'))
                  }} /> */}
                  <div style={{ fontSize: 20, fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', width: '100%' }}><span>Tổng cộng: </span><span>{handleGetTotalPriceCollector()}đ</span></div>
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
          {productInCart.map((cartItem, index) => (
            <div className="Order__item-mobile" style={{ display: 'none' }}>
              <div
                className="Order__item-image"
                style={{
                  backgroundImage: `url(${cartItem.details?.images?.[0]})`,
                }}
              ></div>
              <div className="Order__item-details">
                <div className="Order__item-name">{cartItem.details?.name}</div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="Order__item-price">
                    {payment === PAYMENT_TYPE.COLLECTOR ?
                      <InputBase
                        type="number"
                        className="Order__item-price-input"
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
                </div>
                <div className="Order__item-totalPrice">
                  {(cartItem.details?.basePrice * cartItem.count).toLocaleString(
                    "vi-VN"
                  )}
                  đ
                </div>
                {/* <div
                  className="Order__item-action"
                  onClick={() => handleDeleteItem(index)}
                >
                  <DeleteIcon />
                </div> */}
              </div>
            </div>
          ))}
        </div>

        <div className="Order__total">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: 20, gap: 8 }}>
            <div className="Order__total-label">Tổng cộng</div>
            <div className="Order__total-item">
              {handleGetTotalItemInCart()} <span>(sản phẩm):</span>
            </div>
          </div>

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
              {handleGetTotalPriceNotShip()}đ
            </div>
          </div>
          <div className="Order__bill-item">
            <div className="Order__bill-label">Phí vận chuyển: </div>
            <div className="Order__bill-value">
              30.000đ
            </div>
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
          <div className="Order__bill-actions-mobile" style={{ display: 'none' }}>
            <div className="Order__bill-actions-details">
              <div>Tổng cộng: </div>
              <div className="Order__bill-actions-details-price">
                {handleGetTotalPriceInCart()}đ
              </div>
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
