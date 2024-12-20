import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
import { Avatar, Badge, Divider, Drawer, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/icon.jpg";
import { EAuthToken, TUserDetails } from "../../interfaces/user-interfaces";
import { CartContext } from "../../pages/layouts/Layouts";
import * as RoutePath from "../../routes/paths";
import { getListOrder } from "../../services/order-service";
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

  const [openDrawer, setOpenDrawer] = useState(false);

  const [userDetails, setUserDetails] = useState<TUserDetails>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log(event)
    setAnchorEl(event.currentTarget);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen);
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
    handleClose()
    setTimeout(() => {
      navigate(RoutePath.PROFILE);
    }, 200)
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

  const handleNavigateMenu = (path: string) => {
    setOpenDrawer(false)
    setTimeout(() => {
      navigate(path)
    }, 500)
  }

  useEffect(() => {
    const details = localStorage.getItem("userDetails");
    if (details && details != undefined) {
      setUserDetails(JSON.parse(details || ""));
    }

    handleGetListOrder()
  }, []);




  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Divider />
      <List>
        {listRouteNavbar.map(({ label, path }, index) => (
          <ListItem key={label} disablePadding onClick={() => handleNavigateMenu(path)}>
            <ListItemButton>
              <ListItemText primary={label} sx={{ fontSize: 20 }} style={{ fontSize: 20 }} />
            </ListItemButton>
            <Divider />
          </ListItem>
        ))}
      </List>
    </Box>
  );

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
        <div className='Navbar__menu' style={{ display: 'none' }} onClick={toggleDrawer(true)}>
          <MenuRoundedIcon />
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

      <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default Navbar;
