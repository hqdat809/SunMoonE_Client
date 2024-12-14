import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import GroupsIcon from "@mui/icons-material/Groups";
import SpaIcon from "@mui/icons-material/Spa";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import { getTokenFromKiotViet } from "../../../services/auth-service";
import leafImg from "../../../assets/images/logo-leaf-new.png";
import { getProducts } from "../../../services/product-service";
import { IProductResponse } from "../../../interfaces/product-interface";
import { EAuthToken, TUserDetails } from "../../../interfaces/user-interfaces";
import bigLeafImg from "../../../assets/images/basil-leaf.png";
import {
  getCollections,
  getDetailCollection,
} from "../../../services/collection-service";
import { ICollections } from "../../../interfaces/collection-interface";
import ListProduct from "./list-product/ListProduct";
import Cookies from "universal-cookie";
import { createCustomer } from "../../../services/customer-service";
import { toastError } from "../../../utils/notifications-utils";

const incentives = [
  {
    title: "Miễn phí ship",
    description: "Trong nội thành",
    icon: <LocalShippingIcon />,
  },
  {
    title: "Nhiều ưu đãi",
    description: "Cho CTV",
    icon: <GroupsIcon />,
  },
  {
    title: "Sản phẩm đa dạng",
    description: "",
    icon: <AllInclusiveIcon />,
  },
  {
    title: "Hoàn toàn tự nhiên",
    description: "",
    icon: <SpaIcon />,
  },
];

const Dashboard = () => {
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [collections, setCollections] = useState<ICollections>();
  const cookies = new Cookies();

  const handleGetKiotTokenAndProduct = async () => {

    try {

      await getTokenFromKiotViet();

      const userDetails: TUserDetails = JSON.parse(localStorage.getItem('userDetails') || "")

      console.log(userDetails)

      if (!userDetails.customerId) {
        const createdCustomerResponse = await createCustomer()
      }
      getDetailCollection(
        Number(JSON.parse(localStorage.getItem("CategoryParentId") || "")) ||
        import.meta.env.VITE_COLLECTION_USER_ID
      ).then((response) => {
        if (response) {
          setCollections(response);
        }
      });
    } catch (error) {
      toastError("Error: ", error as string)
    }

  };

  useEffect(() => {
    handleGetKiotTokenAndProduct();
  }, []);

  return (
    <div className="Dashboard">
      <div className="Dashboard__slide">
        <h1>Banner here</h1>
      </div>
      <div className="Dashboard__incentives">
        {incentives.map((item, index) => (
          <div className="Dashboard__incentives-item" key={index}>
            <div className="Dashboard__incentives-icon">{item.icon}</div>
            <div className="Dashboard__incentives-content">
              <div className="Dashboard__incentives-title">{item.title}</div>
              <div className="Dashboard__incentives-description">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {collections?.children
        ?.filter((cate) => !cate.categoryName.includes("{DEL}"))
        .map((collection) => (
          <ListProduct
            categoryId={collection.categoryId}
            categoryName={collection.categoryName}
            key={collection.categoryId}
          />
        ))}
    </div>
  );
};

export default Dashboard;
