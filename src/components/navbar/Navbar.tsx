import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
import { Avatar, Badge, Divider, Input, ListItemIcon, ListItemText, Menu, MenuItem, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/icon.jpg";
import { EAuthToken, TUserDetails } from "../../interfaces/user-interfaces";
import { CartContext } from "../../pages/layouts/Layouts";
import * as RoutePath from "../../routes/paths";
import { getListOrder } from "../../services/order-service";
import SearchButton from "../search-button/SearchButton";
import "./Navbar.scss";

const listRouteNavbar = [
  { label: "Trang chủ", path: RoutePath.DASHBOARD },
  { label: "Giới thiệu", path: "/gioi-thieu" },
  { label: "Sản phẩm", path: RoutePath.PRODUCTS },
  { label: "Tin tức", path: "/tin-tuc" },
  { label: "Liên hệ", path: "/lien-he" },
];

const Navbar = () => {
  const navigate = useNavigate();

  const { setOpen, cart } = useContext(CartContext);
  const [orderNumber, setOrderNumber] = useState(0);

  const [userDetails, setUserDetails] = useState<TUserDetails>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log(event)
    setAnchorEl(event.currentTarget);
  };


  const handleNavigateLoginPage = () => {
    navigate(RoutePath.AUTH);
  };

  const handleNavigateRegisterPage = () => {
    navigate(RoutePath.AUTH, { state: "REGISTER" });
  };

  const handleLogout = () => {
    localStorage.removeItem(EAuthToken.ACCESS_TOKEN)
    localStorage.removeItem(EAuthToken.KIOT_TOKEN)
    localStorage.removeItem(EAuthToken.REFRESH_TOKEN)
    navigate(RoutePath.AUTH);
    handleClose()
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateProfilePage = () => {
    navigate(RoutePath.PROFILE);
    handleClose()
  };

  const handleGetListOrder = async () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails") || "") as TUserDetails

    const orderRequest = {
      orderBy: "createdDate",
      orderDirection: "DESC",
      pageSize: 20,
      status: [1],
      customerIds: [Number(userDetails.customerId)]
    }
    const res = await getListOrder(orderRequest)

    if (res) setOrderNumber(res.data.length || 0)
  }

  useEffect(() => {
    const details = localStorage.getItem("userDetails");
    if (details && details != undefined) {
      setUserDetails(JSON.parse(details || ""));
    }

    handleGetListOrder()
  }, []);

  return (
    <div className="Navbar">
      <div className="Navbar__left">
        <div className="Navbar__icon">
          <img className="Navbar__icon-img" src={logo} />
        </div>
        <div className="Navbar__routes">
          {listRouteNavbar.map((route, index) => (
            <div
              key={index}
              className={`Navbar__routes-item ${route.path === window.location.pathname ? "active" : ""
                }`}
              onClick={() => navigate(route.path)}
            >
              {route.label}
            </div>
          ))}
        </div>
      </div>
      <div className="Navbar__right">
        <div className="Navbar__search">
          {/* <TextField variant='outlined' size='small' placeholder='Tìm kiếm...' /> */}
          {/* <SearchButton /> */}
        </div>
        <div className="Navbar__cart" onClick={() => navigate(RoutePath.ORDER_LIST)}>
          <Badge
            badgeContent={orderNumber}
            color="primary"
            className="Navbar__cart-badge"
          >
            <LocalShippingOutlinedIcon className="Navbar__cart-icon" />
          </Badge>
        </div>
        <div className="Navbar__cart" onClick={() => setOpen(true)}>
          <Badge
            badgeContent={cart.length}
            color="primary"
            className="Navbar__cart-badge"
          >
            <ShoppingCartTwoToneIcon className="Navbar__cart-icon" />
          </Badge>
        </div>
        {/* <div className="Navbar__auth">
          <div className="Navbar__auth-login" onClick={handleNavigateLoginPage}>
            Đăng nhập
          </div>
          <div
            className="Navbar__auth-register"
            onClick={handleNavigateRegisterPage}
          >
            Đăng kí
          </div>
        </div> */}


        {/* <div className="Navbar__profile">
          <div className="Navbar__profile-avatar">
            <Avatar alt="logo" sx={{ width: 30, height: 30 }} />
          </div>
          <div className="Navbar__profile-name">Admin</div>
        </div> */}
        <div className="Navbar__profile" id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}>
          <div className="Navbar__auth-name">
            {`${userDetails?.firstName} ${userDetails?.lastName}`}
          </div>
          <div className="Navbar__profile-avatar">
            <Avatar alt="logo" sx={{ width: 30, height: 30 }} />
          </div>
        </div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleNavigateProfilePage}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText >Logout</ListItemText>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
