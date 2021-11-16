import React, { Fragment } from 'react'
import "./CartItemCard.css"
import {Link} from 'react-router-dom'

const CartItemCard = ({item,deleteCartItems}) => {
    return (
        <Fragment>
            <div className="cartItemCard">
                <img src={item.image} alt={item.name}/>
                <div>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                    <span>{`Price: ₹${item.price}`}</span>
                    <p onClick={()=>deleteCartItems(item.product)}>Remove</p>
                </div>
            </div>
        </Fragment>
    )
}

export default CartItemCard
