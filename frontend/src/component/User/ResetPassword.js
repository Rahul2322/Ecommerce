import React, { Fragment, useState, useEffect } from "react";
import "./ResetPassword.css";
import Loader from "../layout/Loader/Loader";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword, clearErrors } from "../../actions/userAction";
import { useAlert } from 'react-alert'
import MetaData from '../layout/MetaData'

const ResetPassword = ({history,match}) => {
    const dispatch = useDispatch();
    const alert = useAlert();


    const { success, loading, error } = useSelector(state => state.forgotPassword)

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");



    const resetPasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();
      
        myForm.set("password", password);
        myForm.set("confirmPassword", confirmPassword);
        dispatch(resetPassword(match.params.token,myForm));
    };

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors)
        }

        if (success) {
            alert.success("Password Reseted Successfully")

            history.push('/login')

           
        }
    }, [dispatch, error, alert ,history ,success])
    return (
        <Fragment>
            {loading ? (<Loader />) : (
                <Fragment>
                    <MetaData title="Change Password" />
                    <div className="resetPasswordContainer">
                        <div className="resetPasswordBox">
                            <h2 className="resetPasswordHeading">Reset Password</h2>
                            <form
                                className="resetPasswordForm"
                                encType="multipart/form-data"
                                onSubmit={resetPasswordSubmit}
                            >
                                <div className="loginPassword">
                                    <LockOpenIcon />
                                    <input
                                        type="password"
                                        placeholder="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="loginPassword">
                                    <LockIcon />
                                    <input
                                        type="password"
                                        placeholder="confirmPassword"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>




                                <input type="submit" value="Reset" className="resetPasswordBtn" />
                            </form>
                        </div>
                    </div>
                </Fragment>)}
        </Fragment>

    )
}

export default ResetPassword
