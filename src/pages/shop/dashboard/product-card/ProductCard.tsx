import { useNavigate } from "react-router-dom";
import noProductImage from "../../../../assets/images/no-product-image.png";
import { IProductResponse } from "../../../../interfaces/product-interface";
import "./ProductCard.scss";
import * as RoutePath from "../../../../routes/paths";
import { Rating } from "@mui/material";

interface IProps {
  loading?: boolean;
  product: IProductResponse;
  handleReload?: () => void;
}

const ProductCard = ({ product, loading, handleReload }: IProps) => {
  const navigate = useNavigate();

  const handleNavigateProductDetailsPage = () => {
    navigate(`${RoutePath.PRODUCTS}/${product.id}`, { replace: true });
    handleReload?.();
  };

  return (
    <div
      className="ListProducts-products-item"
      onClick={handleNavigateProductDetailsPage}
    >
      <div
        className="ListProducts-products-img"
        style={{
          backgroundImage: `url(${product.images?.[0] || noProductImage})`,
        }}
      ></div>
      <div className="ListProducts-products-info">
        <div className="ListProducts-products-details">
          <div className="ListProducts-products-name">{product?.name}</div>
          <div className="ListProducts-products-category">
            <div className="ListProducts-products-chip">
              {product?.categoryName}
            </div>
          </div>
        </div>

        <div className="ListProducts-products-actions">
          <div className="ListProducts-products-basePrice">
            {product?.basePrice.toLocaleString("vi-VN")}đ
          </div>
          <div className="ListProducts-products-rating">
            <Rating name="read-only" value={5} readOnly size="small" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
