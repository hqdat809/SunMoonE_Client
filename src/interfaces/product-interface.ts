export interface IProductRequest {
  orderBy?: string | string[]; //Sắp xếp dữ liệu theo trường orderBy (ví dụ?: orderBy=Name)
  lastModifiedFrom?: Date; // thời gian cập nhật
  pageSize?: number; // số items trong 1 trang, mặc định 20 items, tối đa 100 items
  currentItem?: number; // lấy dữ liệu từ bản ghi currentItem
  includeInventory?: boolean; // có lấy thông tin tồn kho?
  includePricebook?: boolean; // có lấy thông tin bảng giá?
  IncludeSerials?: boolean; // lấy thông tin serial imei
  IncludeBatchExpires?: boolean; // lấy thông tin lô, hạn sử dụng
  includeWarranties?: boolean; // Lấy thông tin bảo hành
  masterUnitId?: number; //Id hàng hoá đơn vị cần filter
  masterProductId?: number; //Id hàng hoá cùng loại cần filter
  categoryId?: number | string | number[]; //Id nhóm hàng cần filter
  branchIds?: number[]; //Id chi nhánh cần xem tồn kho
  orderDirection?: string;
  includeRemoveIds?: boolean; //Có lấy thông tin danh sách Id bị xoá dựa
  includeQuantity?: boolean; //có lấy thông tin định mức tồn
  productType?: boolean; //loại hàng hóa
  includeMaterial?: boolean; //có lấy danh sách hàng thành phần
  isActive?: boolean | null | string; //Hàng đang kinh doanh,
  name?: string; //search hàng hóa theo tên
  includeSoftDeletedAttribute?: boolean; //Có lấy thông tin danh sách thuộc tính bị xóa của hàng hóa (mặc định là true nếu không truyền tham số này => Nghĩa là lấy tất cả thuộc tính bao gồm thuộc tính đã bị xóa. Ngược lại nếu = false thì loại bỏ các thuộc tính đã bị xóa).
  tradeMarkId?: number; //Id thương hiệu cần filter
}

export interface IProductResponse {
  id: number;
  retailerId: number;
  code: string;
  barCode: string;
  name: string;
  fullName: string;
  description: string;
  categoryId: number;
  categoryName: string;
  allowsSale: boolean;
  type: number;
  hasVariants: boolean;
  basePrice: number;
  weight: number;
  conversionValue: number;
  isActive: boolean;
  isLotSerialControl: boolean;
  isBatchExpireControl: boolean;
  images: string[];
  modifiedDate: Date;
  createdDate: Date;
}
