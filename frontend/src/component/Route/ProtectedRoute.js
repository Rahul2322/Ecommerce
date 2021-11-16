import React,{Fragment} from 'react'
import { useSelector } from 'react-redux';
import { Redirect ,Route} from 'react-router';

const ProtectedRoute = ({isAdmin,component:Component ,...rest}) => {
const { loading, isAuthenticated, user } = useSelector((state) => state.user);
    return (
       <Fragment>
           {loading === false &&(
               <Route
               {...rest}
               render ={(props)=>{
                    if(isAuthenticated === false){
                        return <Redirect to="/login"/>
                    }

                    if(isAdmin === true && user.role!=="admin"){
                        return <Redirect to="/login"/>
                    }
                    return <Component {...props}/>
               }

               }/>
           )}
       </Fragment>
    )
}

export default ProtectedRoute

//rest are all the props like exact path 
//Instead of having a new React element created for you using the component prop, you can pass in a function to be called when the location matches. The render prop function has access to all the same route props (match, location and history) as the component render prop.