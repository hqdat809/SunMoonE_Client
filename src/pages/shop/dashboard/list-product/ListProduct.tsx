import React, { useContext, useEffect, useState } from "react";
import { getProducts } from "../../../../services/product-service";
import { EUnit, IProductResponse, IUnit } from "../../../../interfaces/product-interface";
import "./ListProduct.scss";
import ProductCard from "../product-card/ProductCard";
import * as RoutePath from "../../../../routes/paths";
import { useNavigate } from "react-router-dom";
import { Button, Rating } from "@mui/material";
import { CartContext } from "../../../layouts/Layouts";
import { EUserTypeCategory } from "../../../../interfaces/user-interfaces";

interface IProps {
  categoryId: number;
  categoryName: string;
}

const ListProduct = ({ categoryId, categoryName }: IProps) => {
  const navigate = useNavigate();
  const { setOpen, setCart, cart } = useContext(CartContext);
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
  const userRole = userDetails.authorities?.[0]?.authority;

  const handleNavigateProductDetailsPage = (productId: number) => {
    navigate(`${RoutePath.PRODUCTS}/${productId}`);
  };

  const handleNavigateProductSearch = () => {
    navigate(`${RoutePath.PRODUCTS}`, { state: categoryId });
  };


  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, product: IProductResponse) => {
    e.stopPropagation()
    handleAddToCart(e, product)
    navigate(RoutePath.ORDER);
    setOpen(false);
  }

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, product: IProductResponse) => {
    e.stopPropagation()
    setOpen(true);
    if (!cart.length && product) {
      setCart([{ details: product, count: 1 }]);
    } else {
      const productAsJSON = [...cart];
      if (
        productAsJSON.some((item: any) => item?.details?.id === product?.id)
      ) {
        const index = productAsJSON.findIndex(
          (item: any) => item?.details?.id === product?.id
        );

        productAsJSON[index].count += 1;
      } else if (product) {
        productAsJSON.push({ details: product, count: 1 });
      }
      setCart(productAsJSON);
    }
  }

  const handleGetBasePrice = (p: IProductResponse) => {
    switch (userRole) {
      case EUserTypeCategory.USER:
        return p.basePrice.toLocaleString("vi-VN");
      case EUserTypeCategory.CTV1:
        return p.units.find((unit: IUnit) => unit.unit === EUnit.CTV1)?.basePrice.toLocaleString("vi-VN");
      case EUserTypeCategory.CTV2:
        return p.units.find((unit: IUnit) => unit.unit === EUnit.CTV2)?.basePrice.toLocaleString("vi-VN");
      case EUserTypeCategory.CTV3:
        return p.units.find((unit: IUnit) => unit.unit === EUnit.CTV3)?.basePrice.toLocaleString("vi-VN");
      default:
        return p.basePrice.toLocaleString("vi-VN");
    }
  }

  useEffect(() => {
    getProducts({
      pageSize: 7,
      orderBy: "createdDate",
      orderDirection: "DESC",
      categoryId: categoryId,
      isActive: true,
      branchIds: import.meta.env.VITE_BRANCH_ID,
    }).then((response) => {
      if (response) {
        setProducts(response?.data);
      }
    });
  }, []);

  if (!products.length) {
    return null;
  }

  return (
    <div className="ListProducts">
      <div
        className="ListProducts-header"
        onClick={handleNavigateProductSearch}
      >
        <div className="ListProducts-title">{categoryName}</div>
        <div className="ListProducts-more">{`Xem tất cả >>`}</div>
      </div>

      <div className="ListProducts-products">
        <div className="ListProducts-first">
          <div
            className="ListProducts-products-item"
            onClick={() => {
              handleNavigateProductDetailsPage(products[0]?.id);
            }}
          >
            <div
              className="ListProducts-products-img"
              style={{
                backgroundImage: `url(${products[0]?.images?.[0] || ""})`,
              }}
            ></div>
            <div className="ListProducts-products-details">
              <div className="ListProducts-products-name">
                {products[0]?.name}
              </div>
              <div className="ListProducts-products-category">
                <div className="ListProducts-products-chip">
                  {products[0]?.name}
                </div>
              </div>
              <div className="ListProducts-products-basePrice">
                {products[0] && handleGetBasePrice(products[0])}đ
              </div>
              <div className="ListProducts-products-rating">
                <Rating name="read-only" value={5} readOnly size="small" />
              </div>
              <Button variant="outlined" className="ListProducts-products-addToCart" onClick={(e) => handleAddToCart(e, products[0])}>Thêm vào giỏ hàng</Button>
              <Button variant="outlined" className="ListProducts-products-buying" onClick={e => handleBuyNow(e, products[0])}>Mua ngay</Button>
            </div>
          </div>
        </div>
        <div className="ListProducts-list">
          {products.map((p, i) => {
            if (i) {
              return <ProductCard product={p} key={i} />;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
