class ApiFeatures{
    constructor(query,queryStr){
        this.query = query
        this.queryStr = queryStr
    }

    search(){

        const keyword = this.queryStr.keyword?
        {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i"
            }
        }:
        {}
        console.log(keyword)
        this.query = this.query.find({...keyword})
        return this
    }

    filter(){

        const queryCopy = {...this.queryStr}  //copy and not reference
         console.log(queryCopy)

         //Here i am simply getting items based on category so removing all the other fields
         //removing some fields for category
        const removeFields = ['keyword','page','limit']

        removeFields.forEach(key=>delete queryCopy[key])
        console.log(queryCopy)

        // filter for price and rating
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`)

        this.query = this.query.find(JSON.parse(queryStr));

        console.log(queryStr)
        return this
    }

    pagination(resultPerPage){
        let currentPage = Number(this.queryStr.page) || 1
        let skip = resultPerPage *(currentPage-1)

        this.query = this.query.limit(resultPerPage).skip(skip)

        return this
    }
}

module.exports = ApiFeatures

/*
let query = {}
if(req.query.keyword){
    query.$or=[
        {"title":{$regex:req.query.keyword,options:"i"}},
        {"short_description":{$regex:req.query.keyword,options:"i"}}

    ]
}
await Product.find(query)
*/