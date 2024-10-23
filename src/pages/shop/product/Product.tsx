import { MenuItem, Pagination, Skeleton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { ICollections } from "../../../interfaces/collection-interface";
import {
  IProductRequest,
  IProductResponse,
} from "../../../interfaces/product-interface";
import { getDetailCollection } from "../../../services/collection-service";
import { getProducts } from "../../../services/product-service";
import ProductCard from "../dashboard/product-card/ProductCard";
import "./Product.scss";
import { useLocation, useParams } from "react-router-dom";

const priceSelections = [
  { label: "Mặc định", value: "default" },
  { label: "Giá từ cao đến thấp", value: "DESC" },
  { label: "Giá từ thấp đến cao", value: "ASC" },
];

const initFilterProduct = {
  pageSize: 20,
  orderBy: "name",
  orderDirection: "ASC",
  categoryId: 1738133,
  currentItem: 0,
};

const Product = () => {
  const location = useLocation();
  const categoryId = location.state;

  const [collections, setCollections] = useState<ICollections[] | undefined>(
    []
  );
  const [filter, setFilter] = useState<IProductRequest>({
    ...initFilterProduct,
    categoryId: categoryId || initFilterProduct.categoryId,
  });

  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState<IProductResponse[]>([]);

  const [total, setTotal] = useState(0);

  const [selectedCollectionId, setSelectedCollectionId] = useState<number>();

  const handleGetCollections = () => {
    getDetailCollection(1738133).then((response) => {
      if (response) {
        setCollections(response.children?.reverse());
      }
    });
  };

  const handleGetProduct = () => {
    getProducts(filter)
      .then((response) => {
        if (response) {
          setTotal(response.total);
          setProducts(response?.data);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  };

  useEffect(() => {
    setLoading(true);
    handleGetProduct();
  }, [filter]);

  useEffect(() => {
    handleGetCollections();
  }, []);

  return (
    <div className="Product">
      <div className="Product__collections">
        <div className="Product__collections-title">Danh mục</div>
        <div
          className={`Product__collections-item ${
            filter.categoryId === 1738133 ? "active" : ""
          }`}
          onClick={() =>
            setFilter({ ...filter, categoryId: 1738133, currentItem: 0 })
          }
        >
          Tất cả
        </div>
        {collections?.map((collection) => (
          <div
            className={`Product__collections-item ${
              filter.categoryId === collection.categoryId ? "active" : ""
            }`}
            onClick={() =>
              setFilter({
                ...filter,
                categoryId: collection.categoryId,
                currentItem: 0,
              })
            }
            key={collection.categoryId}
          >
            {collection.categoryName}
          </div>
        ))}
      </div>
      <div className="Product__contents">
        <div className="Product__filter">
          <div className="Product__filter-label ">Sắp xếp theo:</div>
          <div
            className={`Product__filter-name Product__filter-item ${
              filter.orderBy === "name" ? "active" : ""
            }`}
            onClick={() =>
              setFilter({ ...filter, orderBy: "name", orderDirection: "ASC" })
            }
          >
            A-Z
          </div>
          <div
            className={`Product__filter-new Product__filter-item ${
              filter.orderBy === "createdDate" ? "active" : ""
            }`}
            onClick={() =>
              setFilter({
                ...filter,
                orderBy: "createdDate",
                orderDirection: "DESC",
              })
            }
          >
            Mới nhất
          </div>
          <div
            className={`Product__filter-price ${
              filter.orderBy === "basePrice" ? "active" : ""
            }`}
          >
            <TextField
              id="outlined-select-currency"
              select
              label="Sắp xếp theo giá"
              size="small"
              defaultValue="default"
              disabled={loading}
              value={
                filter.orderBy === "basePrice"
                  ? filter.orderDirection
                  : "default"
              }
              helperText=""
              onChange={(event) => {
                if (event.target.value === "default") {
                  setFilter({
                    ...filter,
                    orderBy: "name",
                    orderDirection: "ASC",
                  });
                } else {
                  setFilter({
                    ...filter,
                    orderBy: "basePrice",
                    orderDirection: event.target.value,
                  });
                }
              }}
            >
              {priceSelections.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>
        <div className="Product__list">
          {loading
            ? Array.from(new Array(20)).map((item, index) => (
                <div className="Skeleton__product" key={index}>
                  <Skeleton className="Skeleton__product-img" />
                  <Skeleton width="100%" />
                  <Skeleton width="100%" />
                </div>
              ))
            : products.map((p) => (
                <div className="Product__list-item" key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
          {!products.length && (
            <div className="Product__no-product">
              Không có sản phẩm bạn cần tìm
            </div>
          )}
        </div>
        <div className="Product__pagination">
          <Pagination
            count={filter.pageSize ? Math.ceil(total / filter.pageSize) : 1}
            variant="outlined"
            shape="rounded"
            page={
              filter.currentItem !== undefined && filter.pageSize !== undefined
                ? filter.currentItem / filter.pageSize + 1
                : 1
            }
            onChange={(e, value) =>
              filter.pageSize &&
              setFilter({
                ...filter,
                currentItem: (value - 1) * filter.pageSize,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Product;
