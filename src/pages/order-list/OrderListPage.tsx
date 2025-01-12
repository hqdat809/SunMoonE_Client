import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Button,
    Chip
} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IOrder } from "../../interfaces/order-interface";
import { TUserDetails } from "../../interfaces/user-interfaces";
import { ORDER } from "../../routes/paths";
import { getListOrder, cancelOrder } from "../../services/order-service";
import "./OrderListPage.scss";

const OrderListPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<IOrder[]>([]);

    const handleGetListOrder = async () => {
        const userDetails = JSON.parse(localStorage.getItem("userDetails") || "") as TUserDetails

        const orderRequest = {
            orderBy: "createdDate",
            orderDirection: "DESC",
            pageSize: 20,
            includeOrderDelivery: true,
            customerIds: [Number(userDetails.customerId)]
        }
        const res = await getListOrder(orderRequest)
        console.log(res?.data)

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

    const handleNavigateToOrderDetails = (orderId: number) => {
        navigate(`${ORDER}/${orderId}`)
    }

    const handleCancelOrder = (orderId: number) => {
        cancelOrder(orderId).then(handleGetListOrder)
    }


    useEffect(() => {
        handleGetListOrder()
    }, []);

    return <div className="OrderListPage">
        {orders.map((order) => (
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <div key={order.code} className="OrderListPage__item" >
                        <div className="OrderListPage__item-code">{order.code}</div>
                        <div className="OrderListPage__item-quantity">{order.orderDetails.length}</div>
                        <div className="OrderListPage__item-status">
                            <Chip
                                label={order.statusValue}
                                color={getStatusColor(order.status)}
                                variant="outlined"
                            />
                        </div>
                        <div className="OrderListPage__item-price" style={{ color: "#ff3f35", fontWeight: 'bold' }}>
                            <span>{(order.total + 30000).toLocaleString('vi-VN')}</span>
                            <span>đ</span>
                        </div>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <div className='OrderListPage__details'>
                        <div className="OrderListPage__details-address">
                            <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                                Địa chỉ:
                            </span>
                            <span>
                                {"  "}{order.orderDelivery?.address}
                            </span>
                        </div>
                        <div className="OrderListPage__details-description">
                            <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                                Ghi chú:
                            </span>
                            <span>
                                {order?.description?.split('\n').map((line, index) => (
                                    <span key={index}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </span>
                        </div>
                        <div className="OrderListPage__details-products">
                            <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                                Sản phẩm:
                            </span>
                            <div>
                                {order.orderDetails.map((product) => (
                                    <div key={product.productId} className="OrderListPage__details-product">
                                        <span style={{ flex: 9 }}>{product.productName}</span>
                                        <span style={{ flex: 1 }}>x</span>
                                        <span style={{ flex: 1 }}>{product.quantity}</span>
                                        <span>=</span>
                                        <span style={{ color: "#ff3f35", fontWeight: 'bold', flex: 3, justifyContent: 'flex-end', display: 'flex' }}>{product.price.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="OrderListPage__details-products">
                            <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                                Phí vận chuyển:
                            </span>
                            <div className="OrderListPage__details-product">
                                <span style={{ flex: 9 }}>Phí ship</span>
                                <span style={{ flex: 1 }}>x</span>
                                <span style={{ flex: 1 }}>1</span>
                                <span>=</span>
                                <span style={{ color: "#ff3f35", fontWeight: 'bold', flex: 3, justifyContent: 'flex-end', display: 'flex' }}>{(30000).toLocaleString('vi-VN')}đ</span>
                            </div>
                        </div>
                        <div className="OrderListPage__details-products">
                            <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                                Tổng cộng:
                            </span>
                            <div className="OrderListPage__details-product">
                                <span style={{ flex: 9 }}></span>
                                <span style={{ flex: 1 }}></span>
                                <span style={{ flex: 1 }}></span>
                                <span>=</span>
                                <span style={{ color: "#ff3f35", fontWeight: 'bold', flex: 3, justifyContent: 'flex-end', display: 'flex', fontSize: 26 }}>{(order.total + 30000).toLocaleString('vi-VN')}đ</span>
                            </div>
                        </div>
                        {order.status === 1 && <div className="OrderListPage__details-actions" >
                            <Button variant='contained' color='error' onClick={() => handleCancelOrder(order.id)}>Hủy đặt hàng</Button>
                        </div>}
                    </div>
                </AccordionDetails>
            </Accordion>
        ))}
    </div>

    // return <Paper elevation={3} sx={{ padding: 2, margin: 2 }} className="OrderListPage">
    //     <Typography variant="h5" gutterBottom>
    //         Đơn hàng
    //     </Typography>
    //     <TableContainer>
    //         <Table>
    //             <TableHead>
    //                 <TableRow>
    //                     <TableCell><strong>Mã đơn hàng</strong></TableCell>
    //                     <TableCell align="center"><strong>Số lượng</strong></TableCell>
    //                     <TableCell align="center"><strong>Trạng thái</strong></TableCell>
    //                     <TableCell align="right"><strong>Tổng tiền</strong></TableCell>
    //                 </TableRow>
    //             </TableHead>
    //             <TableBody>
    //                 {orders.map((order) => (
    //                     <TableRow key={order.code} onClick={() => handleNavigateToOrderDetails(order.id)}>
    //                         <TableCell>{order.code}</TableCell>
    //                         <TableCell align="center">{order.orderDetails.length}</TableCell>
    //                         <TableCell align="center">
    //                             <Chip
    //                                 label={order.statusValue}
    //                                 color={getStatusColor(order.status)}
    //                                 variant="outlined"
    //                             />
    //                         </TableCell>
    //                         <TableCell align="right" style={{ color: "#ff3f35", fontWeight: 'bold' }}>
    //                             <span>{order.total.toLocaleString('vi-VN')}</span>
    //                             <span>đ</span>
    //                         </TableCell>
    //                     </TableRow>
    //                 ))}
    //             </TableBody>
    //         </Table>
    //     </TableContainer>
    // </Paper>
};

export default OrderListPage;
