import React, { useContext, useEffect, useState } from "react";
import "./ProductDetail.scss";
import {
  getProductDetails,
  getProducts,
} from "../../../services/product-service";
import { useNavigate, useParams } from "react-router-dom";
import { IProductResponse } from "../../../interfaces/product-interface";
import noImageProduct from "../../../assets/images/no-product-image.png";
import { Button, TextField } from "@mui/material";
import AddShoppingCartTwoToneIcon from "@mui/icons-material/AddShoppingCartTwoTone";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import ProductCard from "../dashboard/product-card/ProductCard";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import * as RoutePath from "../../../routes/paths";
import { CartContext } from "../../layouts/Layouts";

interface IProps {
  productId: number;
}

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { setOpen, setCart, cart } = useContext(CartContext);

  const [count, setCount] = useState(1);
  const [productsRelated, setProductsRelated] = useState<IProductResponse[]>(
    []
  );

  const descriptionElement = document.getElementById(
    "ProductDetail__details-description"
  );

  const moreDescriptionElement = document.getElementById(
    "ProductDetail__moreDetails-description"
  );

  const [details, setDetails] = useState<IProductResponse>();

  const handleClickMore = () => {
    if (moreDescriptionElement?.getBoundingClientRect().y) {
      window.scrollTo({
        top: moreDescriptionElement?.getBoundingClientRect().y - 160,
        behavior: "smooth",
      });
    }
  };


  const handleBuyNow = () => {
    handleAddToCart()
    navigate(RoutePath.ORDER);
    setOpen(false);
  }

  const handleAddToCart = () => {
    setOpen(true);
    if (!cart.length && details) {
      setCart([{ details, count }]);
    } else {
      const productAsJSON = [...cart];
      if (
        productAsJSON.some((item: any) => item?.details?.id === details?.id)
      ) {
        const index = productAsJSON.findIndex(
          (item: any) => item?.details?.id === details?.id
        );
        productAsJSON[index].count += count;
      } else if (details) {
        productAsJSON.push({ details, count });
      }
      setCart(productAsJSON);
    }
  };

  const handleGetProductsRelated = (categoryId: number) => {
    getProducts({
      pageSize: 20,
      orderBy: "createdDate",
      orderDirection: "DESC",
      categoryId: categoryId,
    }).then((response) => {
      if (response) {
        setProductsRelated(response?.data);
      }
    });
  };

  const handleReloadPage = () => {
    window.location.reload();
  };

  const handleGetOldPrice = (p: IProductResponse) => {
    const listOldProduct = JSON.parse(
      localStorage.getItem("products") || ""
    ) as IProductResponse[];

    if (Array.isArray(listOldProduct)) {
      const oldProduct: IProductResponse | undefined = listOldProduct?.find(
        (item: IProductResponse) => p.code.includes(item.code.substring(3))
      );
      if (oldProduct) {
        return oldProduct.basePrice.toLocaleString("vi-VN");
      }
    }
    return p.basePrice.toLocaleString("vi-VN");
  };

  useEffect(() => {
    descriptionElement?.setHTMLUnsafe(details?.description || "");
    moreDescriptionElement?.setHTMLUnsafe(details?.description || "");
    if (details?.categoryId) {
      handleGetProductsRelated(details?.categoryId);
    }
  }, [details]);

  useEffect(() => {
    if (productId) {
      getProductDetails(parseInt(productId)).then((res) => {
        setDetails(res?.data);
      });
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="ProductDetail">
      <div className="ProductDetail__wrapper">
        <div
          className="ProductDetail__image"
          style={{
            backgroundImage: `url(${details?.images?.[0] || noImageProduct})`,
          }}
        ></div>
        <div className="ProductDetail__details">
          <div className="ProductDetail__details-name">{details?.name}</div>
          <div className="ProductDetail__details-category">
            <div className="ProductDetail__details-chip">
              {details?.categoryName}
            </div>
          </div>

          <div className="ProductDetail__details-price">
            <div className="ProductDetail__details-newPrice">
              {details?.basePrice.toLocaleString("vi-VN")}đ
            </div>
            {details && handleGetOldPrice(details) && (
              <div className="ProductDetail__details-oldPrice">
                {handleGetOldPrice(details)}đ
              </div>
            )}

          </div>

          <div
            className="ProductDetail__details-description"
            id="ProductDetail__details-description"
          >
            {/* {details?.description} */}
          </div>
          {details?.description && (
            <div
              className="ProductDetail__details-more"
              onClick={handleClickMore}
            >
              Xem thêm
            </div>
          )}

          <div className="ProductDetail__selectNumber">
            <div className="ProductDetail__selectNumber-label">Số lượng: </div>
            <div className="ProductDetail__selectNumber-select">
              <div
                className="ProductDetail__selectNumber-desc"
                onClick={() => {
                  if (count > 1) {
                    setCount(count - 1);
                  }
                }}
              >
                -
              </div>
              <div className="ProductDetail__selectNumber-number">
                <input
                  value={count}
                  onChange={(e) => {
                    if (!e.target.value) {
                      setCount(1);
                    } else {
                      setCount(parseInt(e.target.value));
                    }
                  }}
                />
              </div>
              <div
                className="ProductDetail__selectNumber-asc"
                onClick={() => setCount(count + 1)}
              >
                +
              </div>
            </div>
          </div>

          <div className="ProductDetail__actions">
            <div className="ProductDetail__addToCart">
              <Button variant="outlined" onClick={handleAddToCart}>
                <div className="ProductDetail__addToCart-icon">
                  <AddShoppingCartTwoToneIcon />
                </div>
                <span>Thêm vào giỏ hàng</span>
              </Button>
            </div>
            <div className="ProductDetail__buy" onClick={handleBuyNow}>
              <Button variant="contained">Mua ngay</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="ProductDetail__moreDetails">
        <div className="ProductDetail__moreDetails-label">
          Thông Số Sản Phẩm
        </div>
        <div className="ProductDetail__moreDetails-field">
          <span className="ProductDetail__moreDetails-field-label">
            Danh mục
          </span>
          <span>{details?.categoryName}</span>
        </div>

        <div className="ProductDetail__moreDetails-field">
          <span className="ProductDetail__moreDetails-field-label">
            Mã sản phẩm
          </span>
          <span>{details?.code}</span>
        </div>
        <div className="ProductDetail__moreDetails-label">Mô tả sản phẩm</div>
        <div
          className="ProductDetail__moreDetails-description"
          id="ProductDetail__moreDetails-description"
        ></div>
      </div>

      <div className="ProductDetail__productRelated">
        <div className="ProductDetail__productRelated-label">
          Sản phẩm liên quan:
        </div>

        <div className="ProductDetail__productRelated-mobile">
          {productsRelated.map((p) => (
            <div className="Product__list-item" key={p.id}>
              <ProductCard product={p} handleReload={handleReloadPage} />
            </div>
          ))}
        </div>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={1.2}
          slidesPerView={2}
          scrollbar={{ draggable: true }}
          className="ProductDetail__productRelated-swiper"
        >
          {productsRelated.map((product) => (
            <SwiperSlide>
              <div className="ProductDetail__productRelated-item">
                <ProductCard
                  product={product}
                  handleReload={handleReloadPage}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="ProductDetail__actions-mobile" style={{ display: "none" }}>
        <div className="ProductDetail__addToCart">
          <Button variant="outlined" onClick={handleAddToCart}>
            <span>Thêm vào giỏ hàng</span>
          </Button>
        </div>
        <div className="ProductDetail__buy" onClick={handleBuyNow}>
          <Button variant="contained">Mua ngay</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
