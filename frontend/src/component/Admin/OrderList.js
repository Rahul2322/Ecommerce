import React, { Fragment, useEffect } from 'react'
import "./ProductList.css";
import {  useDispatch, useSelector } from 'react-redux'
import { DataGrid } from '@material-ui/data-grid'
import { Link } from 'react-router-dom'
import { useAlert } from 'react-alert';
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import MetaData from '../layout/MetaData';
import Sidebar from "./Sidebar.js";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";
import {
    clearErrors,
    getAllOrders,
    deleteOrder,
  } from "../../actions/orderAction";
  import { Button } from "@material-ui/core";


const OrderList = ({history}) => {
    const dispatch = useDispatch()
    const alert = useAlert()

    const { error, orders } = useSelector(state => state.allOrders)

    const {isDeleted ,error:deleteError} = useSelector(state=>state.order)

    useEffect(() => {
       if(error){
           alert.error(error);
           dispatch(clearErrors())
       }
       if(deleteError){
           alert.error(deleteError)
           dispatch(clearErrors())
       }
       if(isDeleted){
           alert.success("Product deleted successfully")
           history.push("/admin/dashboard")
           dispatch({type:DELETE_ORDER_RESET})
       }

       dispatch(getAllOrders())
    }, [dispatch,alert,error,deleteError,isDeleted,history])

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
      };

    const columns = [
        { field: "id", headerName: "OrderId", 
        minwidth: 200, flex: 0.5 
        },

        { 
        field: "status",
         headerName: "Status",
          minwidth: 350, flex: 1,
          cellClassName:(params)=>{
            return params.getValue(params.id,'status') === "Delivered"?"green":"red"
        } 
    },
        { field: "itemsQty", headerName: "ItemsQty", type: "number", minwidth: 150, flex: 0.3 },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 270,
            flex: 0.5,
        },
        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>

                        <Button
                            onClick={() =>
                                deleteOrderHandler(params.getValue(params.id, "id"))
                            }
                        >
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                );
            },
        },

    ]

    const rows = [];
    orders && orders.forEach(item => {
        rows.push({
            id: item._id,
            status: item.orderStatus,
            itemsQty: item.orderItems.length,
            amount: item.totalPrice
        })
    })
    return (
        <Fragment>
            <MetaData title="ProductList" />
            <div className="dashboard">
                <Sidebar/>
                <div className="productListContainer">
                    <h1 id="productListHeading">All Orders</h1>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                    />
                </div>

            </div>
        </Fragment>
    )
}

export default OrderList
