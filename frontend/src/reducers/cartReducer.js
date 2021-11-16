import { ADD_TO_CART ,REMOVE_CART_ITEM,SAVE_SHIPPING_INFO} from "../constants/cartConstants";

export const addToCartReducer = (state = {cartItems:[]} ,action)=>{
    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload;
            const isItemExist = state.cartItems.find(i=>i.product === item.product)

            // here checking if item exists then replace it with this new item otherwise same item
           
            if(isItemExist){
                return{
                    ...state,
                    cartItems : state.cartItems.map( (i)=>
                        i.product === isItemExist.product ? item :i   
                        )
                }
            }else{
                return{
                    ...state,
                    cartItems : [...state.cartItems,item]
                };
            }

            case REMOVE_CART_ITEM:
                return{
                    ...state,
                    cartItems:state.cartItems.filter(i=>i.product !== action.payload)
                }

            case SAVE_SHIPPING_INFO:
                return{
                    ...state,
                    shippingInfo:action.payload
                }
            
    
        default:
            return state;
    }
}
