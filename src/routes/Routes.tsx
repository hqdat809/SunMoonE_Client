import React, { Suspense, useState } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { getStorageToken } from "../utils/storage-utils";
import * as RoutePaths from "./paths";
const Auth = React.lazy(() => import("../pages/auth/Auth"));
const Dashboard = React.lazy(() => import("../pages/shop/dashboard/Dashboard"));
const Order = React.lazy(() => import("../pages/shop/order/Order"));
const Profile = React.lazy(() => import("../pages/profile/ProfilePage"));
const OrderListPage = React.lazy(() => import("../pages/order-list/OrderListPage"));
const Product = React.lazy(() => import("../pages/shop/product/Product"));
const ProductDetail = React.lazy(
  () => import("../pages/shop/product-detail/ProductDetail")
);

const Layouts = React.lazy(() => import("../pages/layouts/Layouts"));
const NotFound = React.lazy(() => import("../pages/not-found/NotFound"));

const Routes = () => {
  const [accessToken, setAccessToken] = useState(getStorageToken());

  const signInRouter = createBrowserRouter([
    {
      path: "*",
      element: <Navigate to={RoutePaths.AUTH} />,
    },
    {
      element: <Auth setAccessToken={setAccessToken} />,
      path: RoutePaths.AUTH,
    },
  ]);

  const authenticatedRouter = createBrowserRouter([
    {
      element: <Layouts setAccessToken={setAccessToken} />,
      path: "",
      children: [
        { path: "", element: <Navigate to={RoutePaths.DASHBOARD} /> },
        { path: RoutePaths.DASHBOARD, element: <Dashboard /> },
        { path: RoutePaths.ORDER, element: <Order /> },
        { path: RoutePaths.PROFILE, element: <Profile /> },
        { path: RoutePaths.ORDER_LIST, element: <OrderListPage /> },
        {
          path: RoutePaths.PRODUCTS,
          children: [
            {
              path: "",
              element: <Product />,
            },
            {
              path: `${RoutePaths.PRODUCTS}/:productId`,
              element: <ProductDetail />,
            },
          ],
        },
      ],
    },
    {
      element: <Navigate to={RoutePaths.DASHBOARD} />,
      path: "*",
    },
  ]);

  return (
    <Suspense>
      <RouterProvider router={getStorageToken() ? authenticatedRouter : signInRouter} />
    </Suspense>
  );
};

export default Routes;
