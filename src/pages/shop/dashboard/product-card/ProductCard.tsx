import { useNavigate } from "react-router-dom";
import noProductImage from "../../../../assets/images/no-product-image.png";
import { EUnit, IProductResponse, IUnit } from "../../../../interfaces/product-interface";
import "./ProductCard.scss";
import * as RoutePath from "../../../../routes/paths";
import { Button, Rating } from "@mui/material";
import { useContext } from "react";
import { CartContext } from "../../../layouts/Layouts";
import { EUserTypeCategory } from "../../../../interfaces/user-interfaces";

interface IProps {
  loading?: boolean;
  product: IProductResponse;
  handleReload?: () => void;
}

const ProductCard = ({ product }: IProps) => {
  const navigate = useNavigate();
  const { setOpen, setCart, cart } = useContext(CartContext);
  const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
  const userRole = userDetails.authorities[0].authority;

  const handleNavigateProductDetailsPage = () => {
    navigate(`${RoutePath.PRODUCTS}/${product.id}`);
  };

  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    handleAddToCart(e)
    navigate(RoutePath.ORDER);
    setOpen(false);
  }

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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

  console.log(handleGetBasePrice(product))

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
          {userRole !== EUserTypeCategory.USER && userRole !== EUserTypeCategory.ADMIN && <div className="ListProducts-products-oldPrice">
            {product.basePrice.toLocaleString("vi-VN")}đ
          </div>}
          <div className="ListProducts-products-basePrice">
            {handleGetBasePrice(product)}đ
          </div>
          <div className="ListProducts-products-rating">
            <Rating name="read-only" value={5} readOnly size="small" />
          </div>
          <Button variant="outlined" className="ListProducts-products-addToCart" onClick={(e) => handleAddToCart(e)}>Thêm vào giỏ hàng</Button>
          <Button variant="outlined" className="ListProducts-products-buying" onClick={e => handleBuyNow(e)}>Mua ngay</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
