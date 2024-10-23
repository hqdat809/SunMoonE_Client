export interface IGetCollectionRequest {
  lastModifiedFrom?: Date; // thời gian cập nhật
  pageSize?: number; // số items trong 1 trang, mặc định 20 items, tối đa 100 items
  currentItem?: number; // lấy dữ liệu từ bản ghi hiện tại, nếu không nhập thì mặc định là 0
  orderBy?: string; //Sắp xếp dữ liệu theo trường orderBy (Ví dụ: orderBy=name)
  orderDirection?: string; //Sắp xếp kết quả trả về theo: Tăng dần Asc (Mặc định), giảm dần Desc
  hierachicalData?: boolean; // nếu HierachicalData=true thì mình sẽ lấy nhóm hang theo cấp mà không quan tâm lastModifiedFrom. Ngược lại, HierachicalData=false thì sẽ lấy 1 list nhóm hang theo lastModifiedFrom nhưng không có phân cấp
}

export interface ICollections {
  categoryId: number;
  categoryName: string;
  retailerId: number;
  hasChild: boolean;
  modifiedDate?: Date;
  createdDate: Date;
  rank?: number;
  children?: ICollections[];
  parentId?: number;
}
