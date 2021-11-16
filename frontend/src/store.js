import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
    productsReducer, 
    productDetailsReducer ,
    newReviewReducer,
    productReducer,
    newProductReducer,
    productReviewsReducer,
    reviewReducer} from './reducers/productReducer'
import { 
    userReducer, 
    profileReducer, 
    forgotPasswordReducer,
    allUsersReducer ,
    userDetailsReducer} from './reducers/userReducer'
import { addToCartReducer } from './reducers/cartReducer'
import {
    newOrderReducer,
    myOrdersReducer,
    orderDetailsReducer,
    allOrdersReducer,
    orderReducer} from './reducers/orderReducer'



const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    user: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
    cart: addToCartReducer,
    newOrder:newOrderReducer,
    myOrders:myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview:newReviewReducer,
    newProduct:newProductReducer,
    product:productReducer,
    allOrders:allOrdersReducer,
    order:orderReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    productReview:productReviewsReducer,
    review:reviewReducer
});

const middleware = [thunk]

let initialState = {
    cart: {
        cartItems: localStorage.getItem("cartItems")
            ? JSON.parse(localStorage.getItem("cartItems"))
            : [],
        shippingInfo: localStorage.getItem('shippingInfo')
            ? JSON.parse(localStorage.getItem('shippingInfo'))
            : {}
    },

}

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store;