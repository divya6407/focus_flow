const error =(err,req,res,next)=>{
    console.log(err.stack);
    res.status(err.status|| 500).json({
        sucess:false,
        msg:err.mes || "internal error"
    })
}
export default error;