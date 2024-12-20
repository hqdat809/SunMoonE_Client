import React, { useEffect, useState } from "react";
import { getListOrder } from "../../services/order-service";
import { TUserDetails } from "../../interfaces/user-interfaces";
import "./OrderListPage.scss"
import { IOrder } from "../../interfaces/order-interface";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Typography,
} from "@mui/material";

const OrderListPage = () => {

    const [orders, setOrders] = useState<IOrder[]>([]);

    const handleGetListOrder = async () => {
        const userDetails = JSON.parse(localStorage.getItem("userDetails") || "") as TUserDetails

        const orderRequest = {
            orderBy: "createdDate",
            orderDirection: "DESC",
            pageSize: 20,
            customerIds: [Number(userDetails.customerId)]
        }
        const res = await getListOrder(orderRequest)

        if (res) setOrders(res.data)
    }

    const getStatusColor = (status: number) => {
        switch (status) {
            case 1:
                return "warning";
            case 2:
                return "info";
            case 3:
                return "success";
            case 4:
                return "error";
            default:
                return "default";
        }
    };


    useEffect(() => {
        handleGetListOrder()
    }, []);


    return <Paper elevation={3} sx={{ padding: 2, margin: 2 }} className="OrderListPage">
        <Typography variant="h5" gutterBottom>
            Đơn hàng
        </Typography>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Mã đơn hàng</strong></TableCell>
                        <TableCell align="center"><strong>Số lượng</strong></TableCell>
                        <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                        <TableCell align="right"><strong>Tổng tiền</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.code}>
                            <TableCell>{order.code}</TableCell>
                            <TableCell align="center">{order.orderDetails.length}</TableCell>
                            <TableCell align="center">
                                <Chip
                                    label={order.statusValue}
                                    color={getStatusColor(order.status)}
                                    variant="outlined"
                                />
                            </TableCell>
                            <TableCell align="right" style={{ color: "#ff3f35", fontWeight: 'bold' }}>
                                <span>{order.total.toLocaleString('vi-VN')}</span>
                                <span>đ</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
};

export default OrderListPage;
