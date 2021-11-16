import React ,{Fragment, useState}from 'react'
import './Search.css'
import MetaData from '../layout/MetaData'

const Search = ({history}) => {
    const [keyword,setKeyword] = useState('');
    

    const searchSubmitHandler =(e)=>{
        e.preventDefault()
        if(keyword.trim()){
            history.push(`/products/${keyword}`)
        }else{
            history.push('/products')
        }
    }

    
    return (
    <Fragment>
        <MetaData title="SEARCH A PRODUCT -- ECOMMERCE" />
        <form className="searchBox" onSubmit={searchSubmitHandler}>
            <input 
            type="text" 
            placeholder="searchForProducts..."
            onChange={(e)=>setKeyword(e.target.value)}
            />
            <button className="submit" type="submit">Search</button>
        </form>
    </Fragment>
    )
}

export default Search
