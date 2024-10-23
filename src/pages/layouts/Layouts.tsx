import { Outlet, useNavigate } from "react-router-dom";

import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Drawer } from "antd";
import { createContext, useCallback, useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { getStorageToken } from "../../utils/storage-utils";
import "./Layouts.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Button, Divider, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { IProductResponse } from "../../interfaces/product-interface";
import { Swiper, SwiperSlide } from "swiper/react";
import * as RoutePath from "../../routes/paths";

interface ILayoutsProps {
  setAccessToken: (token: string) => void;
}

interface IContext {
  open: boolean;
  setOpen: (value: boolean) => void;
  cart: IProductResponse[];
  setCart: (value: IProductResponse[]) => void;
}

export const CartContext = createContext({
  open: false,
  setOpen: (value: boolean) => {},
  cart: [] as ICart[],
  setCart: (cart: ICart[]) => {},
});

interface ICart {
  details: IProductResponse;
  count: number;
}

const Layouts = ({ setAccessToken }: ILayoutsProps) => {
  const navigate = useNavigate();
  const [isExpand, setIsExpand] = useState(true);
  const [open, setOpen] = useState<boolean>(false);
  const [cart, setCart] = useState<ICart[]>([]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleDeleteItem = (index: number) => {
    const newListCart = [...cart];
    newListCart.splice(index, 1);
    setCart(newListCart);
  };

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

  const handleNavigateOrderPage = () => {
    navigate(RoutePath.ORDER);
    setOpen(false);
  };

  const handleGetTotalPriceInCart = useCallback(() => {
    let totalPrice = 0;
    cart.forEach((item) => {
      totalPrice += item.details.basePrice * item.count;
    });
    return totalPrice.toLocaleString("vi-VN");
  }, [cart]);

  useEffect(() => {
    if (open) {
      console.log("cart: ", cart);
      console.log("open: ", open);
      localStorage.setItem("productInCart", JSON.stringify(cart));
    }
  }, [cart, open]);

  const CartContextValues = {
    open,
    setOpen,
    cart,
    setCart,
  };

  useEffect(() => {
    const cartFromLocal = localStorage.getItem("productInCart");
    setCart(JSON.parse(cartFromLocal || ""));
  }, []);

  const DrawerList = (
    <Box role="presentation" className="Cart">
      <List className="Cart__listItem">
        {cart.map((product, index) => (
          <>
            <div key={index} className="Cart__item">
              <div
                className="Cart__item-img"
                style={{
                  backgroundImage: `url(${product.details.images[0]})`,
                }}
              />
              <div className="Cart__item-info">
                <Tooltip title={product.details.name}>
                  <div className="Cart__item-name">{product.details.name}</div>
                </Tooltip>

                <div className="Cart__item-quantity">
                  <div
                    className="Cart__item-desc"
                    onClick={() => {
                      handleChangeQuantity(index, "MINUS");
                    }}
                  >
                    -
                  </div>
                  <div className="Cart__item-number">
                    <input value={product.count} />
                  </div>
                  <div
                    className="Cart__item-asc"
                    onClick={() => {
                      handleChangeQuantity(index, "PLUS");
                    }}
                  >
                    +
                  </div>
                </div>
              </div>
              <div className="Cart__item-action">
                <div className="Cart__item-price">
                  <span className="Cart__item-basePrice">
                    {product.details.basePrice}
                  </span>{" "}
                  x {product.count}
                </div>
                <div
                  className="Cart__item-delete"
                  onClick={() => handleDeleteItem(index)}
                >
                  <DeleteIcon />
                </div>
              </div>
            </div>
            <Divider />
          </>
        ))}
        {/* </Swiper> */}
      </List>
      <div className="Cart__total">
        <div className="Cart__total-label">Tổng cộng</div>
        <div className="Cart__total-value">{handleGetTotalPriceInCart()} đ</div>
      </div>
      <Button
        className="Cart__buying"
        variant="contained"
        onClick={handleNavigateOrderPage}
      >
        Mua ngay
      </Button>
    </Box>
  );

  useEffect(() => {
    if (isExpand) {
      localStorage.setItem("SIDE_BAR_STATUS", "expanded");
    } else {
      localStorage.setItem("SIDE_BAR_STATUS", "collapsed");
    }
  }, [isExpand]);

  useEffect(() => {
    setAccessToken(getStorageToken() || "");
  }, []);

  return (
    <CartContext.Provider value={CartContextValues}>
      <div className="Layout">
        <Navbar />
        <div className="Content">
          <Outlet />
          <Drawer
            open={open}
            onClose={toggleDrawer(false)}
            title="Sản Phẩm Đã Thêm"
            className="Cart__drawer"
          >
            {DrawerList}
          </Drawer>
        </div>
        <div className="Footer">
          <div className="Footer__left">
            <div className="Footer__col">
              <div className="Footer__title">Chăm sóc khách hàng</div>
              <div className="Footer__item">Trung tâm trợ giúp</div>
              <div className="Footer__item">Hướng dẫn mua hàng</div>
              <div className="Footer__item">Chính sách vận chuyển</div>
            </div>
            <div className="Footer__col">
              <div className="Footer__title">Về chúng tôi</div>
              <div className="Footer__item">Về SunMoonE</div>
              <div className="Footer__item">Chính sách thanh toán</div>
              <div className="Footer__item">Điều khoản chính sách</div>
            </div>
          </div>
          <div className="Footer__right">
            <div className="Footer__col">
              <div className="Footer__title">Theo dõi chúng tôi</div>
              <div className="Footer__item">
                <FacebookRoundedIcon /> Facebook
              </div>
              <div className="Footer__item">
                <YouTubeIcon /> Youtube
              </div>
            </div>
          </div>
        </div>
      </div>
    </CartContext.Provider>
  );
};

export default Layouts;
