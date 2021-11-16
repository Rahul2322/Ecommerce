import React from 'react'
import Button from '@material-ui/core/Button'
import "./Contact.css"

const Contact = () => {
    return (
        <div className="contactContainer">
            <a className="mailBtn" href="mailto:rohitmsingh86@gmail.com">
                <Button>Contact:myEmailIdContact</Button>
            </a>
        </div>
    )
}

export default Contact
