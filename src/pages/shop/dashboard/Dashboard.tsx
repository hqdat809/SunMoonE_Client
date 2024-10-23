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
import { EAuthToken } from "../../../interfaces/user-interfaces";
import bigLeafImg from "../../../assets/images/basil-leaf.png";
import {
  getCollections,
  getDetailCollection,
} from "../../../services/collection-service";
import { ICollections } from "../../../interfaces/collection-interface";
import ListProduct from "./list-product/ListProduct";

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

  const handleGetKiotTokenAndProduct = () => {
    getTokenFromKiotViet();
    getDetailCollection(1738133).then((response) => {
      if (response) {
        console.log(response);
        setCollections(response);
        console.log(response.children?.reverse());
      }
    });
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
        {incentives.map((item) => (
          <div className="Dashboard__incentives-item">
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

      {collections?.children?.map((collection) => (
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
