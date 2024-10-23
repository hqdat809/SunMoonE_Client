import React, { useEffect, useState } from "react";
import { getProducts } from "../../../../services/product-service";
import { IProductResponse } from "../../../../interfaces/product-interface";
import "./ListProduct.scss";
import ProductCard from "../product-card/ProductCard";
import * as RoutePath from "../../../../routes/paths";
import { useNavigate } from "react-router-dom";

interface IProps {
  categoryId: number;
  categoryName: string;
}

const ListProduct = ({ categoryId, categoryName }: IProps) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProductResponse[]>([]);

  const handleNavigateProductDetailsPage = (productId: number) => {
    navigate(`${RoutePath.PRODUCTS}/${productId}`);
  };

  const handleNavigateProductSearch = () => {
    navigate(`${RoutePath.PRODUCTS}`, { state: categoryId });
  };

  useEffect(() => {
    getProducts({
      pageSize: 7,
      orderBy: "createdDate",
      orderDirection: "DESC",
      categoryId: categoryId,
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
                backgroundImage: `url(${products[0]?.images[0] || ""})`,
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
                {products[0]?.basePrice.toLocaleString("vi-VN")}đ
              </div>
            </div>
          </div>
        </div>
        <div className="ListProducts-list">
          {products.map((p, i) => {
            if (i) {
              return <ProductCard product={p} />;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
