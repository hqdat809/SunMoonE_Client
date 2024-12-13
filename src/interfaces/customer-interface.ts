export interface TCreateCustomer {
    name?: string; // Tên khách hàng
    gender?: boolean; // Giới tính (true: nam; false: nữ)
    contactNumber?: string; // Số điện thoại khách hàng
    address?: string; // Địa chỉ khách hàng
    locationName?: string; // Khu vực
    wardName?: string; // Phường xã
    email?: string; // Email của khách hàng
    comments?: string;
    branchId?: number
}