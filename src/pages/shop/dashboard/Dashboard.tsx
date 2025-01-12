import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SpaIcon from "@mui/icons-material/Spa";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { ICollections } from "../../../interfaces/collection-interface";
import { TUserDetails } from "../../../interfaces/user-interfaces";
import { getTokenFromKiotViet } from "../../../services/auth-service";
import {
  getDetailCollection
} from "../../../services/collection-service";
import { createCustomer } from "../../../services/customer-service";
import { toastError } from "../../../utils/notifications-utils";
import "./Dashboard.scss";
import ListProduct from "./list-product/ListProduct";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import imageBanner1 from "../../../assets/images/banner1.jpg"
import imageBanner2 from "../../../assets/images/banner2.jpg"

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
  const [collections, setCollections] = useState<ICollections>();

  const handleGetKiotTokenAndProduct = async () => {

    try {

      await getTokenFromKiotViet();

      const userDetails: TUserDetails = JSON.parse(localStorage.getItem('userDetails') || "")

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

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 2000,
    cssEase: "linear"
  };

  useEffect(() => {
    handleGetKiotTokenAndProduct();
  }, []);

  return (
    <div className="Dashboard">
      <div className="Dashboard__slide">
        <div className="Dashboard__slide-item" >
          <img src={imageBanner1} alt="" />
        </div>
      </div>
      <div className="Dashboard__banner" >
        <img src={imageBanner2} alt="" />
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
