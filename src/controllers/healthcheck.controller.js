import {APIresponse} from "../utils/api-response.js"
import {asyncHandler} from "../utils/asynchandler.js"


const healthcheck = asyncHandler(async(req,res) =>{
    res.status(200).json(
        new APIresponse(200,{message: 'server is running'})
    )
})
export {healthcheck}