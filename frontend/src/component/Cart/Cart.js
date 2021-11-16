import React,{Fragment} from 'react'
import './Cart.css'
import CartItemCard from './CartItemCard'
import {useDispatch,useSelector} from 'react-redux'
import {addItemsToCart, removeItemsFromCart} from '../../actions/cartAction'
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from "react-router-dom";



const Cart = ({history}) => {

    const dispatch = useDispatch();

    const {cartItems} = useSelector(state=>state.cart)

    const increaseQty = (id,qty,stock)=>{
        const newQty = qty + 1;
        if(qty>=stock)return
        dispatch(addItemsToCart(id,newQty));
    }

    const decreaseQty = (id,qty,)=>{
        const newQty = qty - 1;
        if(qty<=1) return;
        dispatch(addItemsToCart(id,newQty))
    }

    const deleteCartItems = (id)=>{
           dispatch(removeItemsFromCart(id)) 
    }

    //here if the user is not logged in he will be pushed to login as indicated and then it will
    //go to <Route exact path="/login" component={LoginSignUp}/> and there check if autenticated or not in redirect variable
    const checkOutHandler = ()=>{
        history.push('/login?redirect=shipping')
    }
    //after ? its search
    return (
        <Fragment>
            {cartItems.length === 0 ? (
                <div className="emptyCart">
                        <RemoveShoppingCartIcon/>
                        <Typography>No Product in Your Cart</Typography>
                  <Link to="/products">View Products</Link>
                </div>
            ):( <Fragment>
                <div className="cartPage">
                    <div className="cartHeader">
                        <p>Product</p>
                        <p>Qty</p>
                        <p>Totals</p>
                    </div>
    
                    {cartItems && 
                    cartItems.map(item=>(
                        <div className="cartContainer" key={item.product}>
                            <CartItemCard item={item} deleteCartItems={deleteCartItems}/>
                            <div className="cartInput">
                                <button 
                                onClick={()=>decreaseQty(item.product,item.qty)
                                }>-</button>
                                <input type="number" readOnly value={item.qty}/>
                                <button 
                                onClick={()=>increaseQty(item.product,item.qty,item.stock)
                                }>+</button>
                            </div>
                            <p className="cartSubTotal">
                                {`₹${item.qty* item.price}`}
                            </p>
                        </div>
                    ))}
    
                    <div className="cartGrossProfit">
                        <div></div>
                        <div className="cartGrossProfitBox">
                            <p>Gross Total</p>
                            <p>{`₹${cartItems.reduce((acc,item)=> acc + item.qty*item.price
                            ,0)}`}</p>
                        </div>
                        <div></div>
                        <div className="checkOutBtn">
                            <button onClick={checkOutHandler}>Check Out</button>
                        </div>
                    </div>
                </div>
            </Fragment>)}
        </Fragment>
       
    )
}

export default Cart
