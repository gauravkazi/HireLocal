const ristrictTo = (...roles)=>{
    return(req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(401).json({message:'Access denied Insufficient access'})
        }
        next();

    };
};
module.exports = { ristrictTo };