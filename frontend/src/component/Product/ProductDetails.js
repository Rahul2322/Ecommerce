import React, { Fragment, useEffect, useState } from 'react'
import Carousel from 'react-material-ui-carousel'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import Loader from '../layout/Loader/Loader'
import { getProductDetails, clearErrors ,newReview} from '../../actions/productAction'
import './ProductDetails.css'
// import ReactStars from 'react-rating-stars-component'
import ReviewCard from './ReviewCard.js'
import MetaData from '../layout/MetaData'
import { addItemsToCart } from '../../actions/cartAction'
import { Rating } from "@material-ui/lab";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@material-ui/core";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";

const ProductDetails = ({ match }) => {
    const dispatch = useDispatch();
    const alert = useAlert()

    const { product, error, loading } = useSelector(state => state.productDetails)
    const { success, error: reviewError } = useSelector(
        (state) => state.newReview
      );

    const [quantity, setQuantity] = useState(1)

    const [open,setOpen] = useState(false)
    const [rating,setRating] = useState(0)
    const [comment,setComment] = useState("")

   

    const options = {
        size:"large",
        readOnly:true,
        value: product.ratings,
        precision:0.5
    }

    function increaseQty() {

        if (product.stock <= quantity) return;

        let qty = quantity + 1

        setQuantity(qty)
    }

    function decreaseQty() {

        if (quantity <= 1) return;

        let qty = quantity - 1

        setQuantity(qty)
    }

    function addToCartHandler() {
        dispatch(addItemsToCart(match.params.id, quantity));
        alert.success("Items Added to cart")
    }

    function submitReviewToggle(){
        open?setOpen(false):setOpen(true)
    }

    const reviewSubmitHandler = ()=>{
        const myForm = new FormData();

        myForm.set("rating",rating);
        myForm.set("comments",comment);
        myForm.set("productId",match.params.id);

        dispatch(newReview(myForm));

        setOpen(false)
    }

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (reviewError) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (success) {
            alert.success("Review submitted successfully")
            dispatch({type:NEW_REVIEW_RESET})
        }
        dispatch(getProductDetails(match.params.id))

    }, [dispatch, error, match.params.id, alert, reviewError, success])
    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title={`${product.name} --ECOMMERCE`} />
                    <div className="ProductDetails">
                        <div>
                            <Carousel>
                                {product.images && product.images.map((item, i) => (
                                    <img className="carouselImage"
                                        key={i}
                                        src={item.url}
                                        alt={`${i} Slide`} />
                                ))}
                            </Carousel>
                        </div>

                        <div>
                            <div className="detailsBlock-1">
                                <h2>{product.name}</h2>
                                <p>Product #{product._id}</p>
                            </div>
                            <div className="detailsBlock-2">
                                <Rating {...options} />
                                <span className="detailsBlock-2-span">({product.numOfReviews}) Reviews</span>
                            </div>
                            <div className="detailsBlock-3">
                                <h1>{`₹${product.price}`}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        <button onClick={decreaseQty}>-</button>
                                        <input readOnly type="number" value={quantity} />
                                        <button onClick={increaseQty}>+</button>

                                    </div>
                                    <button disabled={product.stock < 1 ? true : false} onClick={addToCartHandler}>Add to cart</button>
                                </div>
                                <p>
                                    Status:
                                    <b className={product.stock < 1 ? "red" : "green"}>
                                        {product.stock < 1 ? "OutOfStock" : "InStock"}
                                    </b>
                                </p>


                            </div>
                            <div className="detailsBlock-4">
                                Description:<p>{product.description}</p>
                            </div>
                            <button onClick={submitReviewToggle} className="submitReview">Submit Review</button>
                        </div>
                    </div>
                    <h3 className="reviewsHeading">
                        REVIEWS
                    </h3>
                    <Dialog
                        aria-labelledby="simple-dialog-title"
                        open={open}
                        onClose={submitReviewToggle}
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className="submitDialog">
                            <Rating
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                size="large"
                            />

                            <textarea
                                className="submitDialogTextArea"
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={submitReviewToggle} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={reviewSubmitHandler} color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {product.reviews && product.reviews[0] ? (
                        <div className="reviews">
                            {product.reviews && product.reviews.map((review) => <ReviewCard review={review} />)}

                        </div>
                    ) : (
                        <p className="noReviews">No Reviews Yet</p>
                    )}
                </Fragment>
            )
            }
        </Fragment>
    )
}

export default ProductDetails
