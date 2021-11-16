import React from 'react'
// import ReactStars from 'react-rating-stars-component'
import ProfilePng from '../../images/Profile.png'
import { Rating } from "@material-ui/lab";

const ReviewCard = ({review}) => {
    const options ={
        value:review.rating,
        readOnly:true,
        precision:0.5,
        size:'large'
    }
    return (
        <div className="reviewCard">
            <img
            src={ProfilePng}
            alt="User"
            />
            <p>{review.name}</p>
            <Rating {...options}/>
            <span className="reviewCardComment">{review.comments}</span>
            
        </div>
    )
}

export default ReviewCard
