import { MenuItem, Pagination, Skeleton, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ICollections } from "../../../interfaces/collection-interface";
import {
  EUnit,
  IProductRequest,
  IProductResponse,
} from "../../../interfaces/product-interface";
import { getDetailCollection } from "../../../services/collection-service";
import { getProducts } from "../../../services/product-service";
import ProductCard from "../dashboard/product-card/ProductCard";
import "./Product.scss";
import { useLocation, useParams } from "react-router-dom";
import { EUserTypeCategory } from "../../../interfaces/user-interfaces";
import * as _ from "lodash";

const priceSelections = [
  { label: "Mặc định", value: "default" },
  { label: "Giá từ cao đến thấp", value: "DESC" },
  { label: "Giá từ thấp đến cao", value: "ASC" },
];

const Product = () => {



  const initFilterProduct = {
    pageSize: 60,
    orderBy: "name",
    orderDirection: "ASC",
    categoryId: Number(import.meta.env.VITE_COLLECTION_USER_ID),
    currentItem: 0,
    isActive: true,
    branchIds: [import.meta.env.VITE_BRANCH_ID]
  };

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

  const handleGetCollections = () => {
    getDetailCollection(
      Number(JSON.parse(localStorage.getItem("CategoryParentId") || "")) ||
      import.meta.env.VITE_COLLECTION_USER_ID
    ).then((response) => {
      if (response) {
        const newCollectiosn = response.children
          ?.reverse()
          .filter((cate) => !cate.categoryName.includes("{DEL}"));
        setCollections(newCollectiosn);
      }
    });
  };

  const handleInputSearchText = (values: string) => {
    debouncedFetch(values);
  };

  const debouncedFetch = useCallback(
    _.debounce(
      (values: string) => setFilter({ ...filter, currentItem: 0, name: values }),
      1000
    ),
    [filter]
  );

  const handleSearchByName = (e: any) => {
    debouncedFetch(e.target.value);
  }

  const handleGetProduct = () => {
    getProducts(filter)
      .then((response) => {
        if (response) {
          setTotal(response.total);
          const result = response?.data.filter((p: IProductResponse) => p.unit === EUnit.USER);
          setProducts(result)
        }
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  };

  const handleChangeCategory = (e: any) => {
    if (e.target.value === "default") {
      setFilter({
        ...filter,
        categoryId:
          Number(
            JSON.parse(localStorage.getItem("CategoryParentId") || "")
          ) || import.meta.env.VITE_COLLECTION_USER_ID,
        currentItem: 0,
      })
    } else {
      setFilter({
        ...filter,
        categoryId: e.target.value,
        currentItem: 0,
      })
    }
  }

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
          className={`Product__collections-item ${filter.categoryId ===
            Number(
              JSON.parse(localStorage.getItem("CategoryParentId") || "")
            ) || import.meta.env.VITE_COLLECTION_USER_ID
            ? "active"
            : ""
            }`}
          onClick={() =>
            setFilter({
              ...filter,
              categoryId:
                Number(
                  JSON.parse(localStorage.getItem("CategoryParentId") || "")
                ) || import.meta.env.VITE_COLLECTION_USER_ID,
              currentItem: 0,
            })
          }
        >
          Tất cả
        </div>
        {collections?.map((collection) => (
          <div
            className={`Product__collections-item ${filter.categoryId === collection.categoryId ? "active" : ""
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
            className={`Product__filter-name Product__filter-item ${filter.orderBy === "name" ? "active" : ""
              }`}
            onClick={() =>
              setFilter({ ...filter, orderBy: "name", orderDirection: "ASC" })
            }
          >
            A-Z
          </div>
          <div
            className={`Product__filter-new Product__filter-item ${filter.orderBy === "createdDate" ? "active" : ""
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
            className={`Product__filter-price ${filter.orderBy === "basePrice" ? "active" : ""
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
          <div className={`Product__filter-category ${filter.categoryId !== Number(
            JSON.parse(localStorage.getItem("CategoryParentId") || "")
          ) ? "active" : ""
            }`} style={{ display: 'none' }}>
            <TextField
              id="outlined-select-currency"
              select
              label="Danh Mục"
              size="small"
              defaultValue="default"
              disabled={loading}
              value={
                filter.categoryId === Number(
                  JSON.parse(localStorage.getItem("CategoryParentId") || "")
                ) ? "default" : filter.categoryId
              }
              helperText=""
              onChange={handleChangeCategory}
            >
              <MenuItem value="default">
                Tất cả
              </MenuItem>
              {collections?.map((collection) => (
                <MenuItem key={collection.categoryId} value={collection.categoryId}>
                  {collection.categoryName}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className={`Product__filter-search `} style={{ flex: 1 }}>
            <TextField fullWidth label="Tìm kiếm..." variant='outlined' size='small' placeholder='Nhập để tìm kiếm...' onChange={handleSearchByName} />
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
    </div >
  );
};

export default Product;
