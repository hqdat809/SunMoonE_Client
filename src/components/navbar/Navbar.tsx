import React, { useContext } from "react";
import "./Navbar.scss";
import logo from "../../assets/images/icon.jpg";
import { useNavigate } from "react-router-dom";
import * as RoutePath from "../../routes/paths";
import SearchButton from "../search-button/SearchButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { CartContext } from "../../pages/layouts/Layouts";
import ShoppingCartTwoToneIcon from "@mui/icons-material/ShoppingCartTwoTone";
import { Badge } from "@mui/material";
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
              className={`Navbar__routes-item ${
                route.path === window.location.pathname ? "active" : ""
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
          <SearchButton />
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
        <div className="Navbar__auth">
          <div className="Navbar__auth-login">Đăng nhập</div>
          <div className="Navbar__auth-register">Đăng kí</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
