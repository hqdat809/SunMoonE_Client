export interface IOrderRequest {
    branchIds?: number[]; // ID chi nhánh
    customerIds?: number[]; // Id khách hàng
    customerCode?: string; //Mã khách hàng
    status?: number[]; // Tình trạng đặt hàng
    includePayment?: boolean; // có lấy thông tin thanh toán
    includeOrderDelivery?: boolean;
    lastCreatedFrom?: any;
    lastModifiedFrom?: any; // thời gian cập nhật
    pageSize?: number; // số items trong 1 trang; mặc định 20 items; tối đa 100 items
    currentItem?: number;
    toDate?: any; //Thời gian cập nhật cho đến thời điểm toDate
    orderBy?: string; //Sắp xếp dữ liệu theo trường orderBy (Ví dụ?: orderBy=name)
    orderDirection?: string; //Sắp xếp kết quả trả về theo?: Tăng dần Asc (Mặc định); giảm dần Desc
    createdDate?: any; //Thời gian tạo
    saleChannelId?: number; // Id kênh bán hàng, nếu không truyền mặc định kênh khác
}

export interface IOrder {
    id: number;
    code: string;
    purchaseDate: Date;
    branchId: number;
    branchName: string;
    soldById: number;
    soldByName: string;
    customerId: number;
    customerCode: string;
    customerName: string;
    total: number;
    totalPayment: number;
    discount: number;
    status: number;
    statusValue: string;
    retailerId: number;
    description?: string;
    usingCod: boolean;
    modifiedDate: string;
    createdDate: string;
    PriceBookId: number;
    Extra: string;
    orderDetails: IOrderDetails[];
    SaleChannelId?: number;
    SaleChannelName?: string;
    orderDelivery: {
        address: string;
        contactNumber: string;
        latestStatus: number;
        locationName: string;
        partnerDelivery: {
            code: string;
            name: string;
            contactNumber: string;
            address: string;
            email: string;
        };
        price: number;
        receiver: string;
        serviceType: string;
        status: number;
        wardName: string;
    };
}

export interface IOrderDetails {
    productId: number;
    productCode: string;
    productName: string;
    isMaster: boolean;
    quantity: number;
    price: number;
    discount: number;
    discountRatio: number;
    viewDiscount: number;
    note?: string;
}
