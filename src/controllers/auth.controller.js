import {validationResult} from 'express-validator/check'
let loginRegister = (req,res) => {
    res.render('auth/master') ;
}
let logout = (req,res) => {
    //do something
}
let postRegister = (req,res) => {
    let errorArr = [];
    const errorValidation = validationResult(req);
    if(!errorValidation.isEmpty()){
        let errors = Object.values(errorValidation.mapped()); // Object.values lấy tất cả các value bỏ vào mảng 
        errors.forEach(item => {
            errorArr.push(item.msg);
        })
        console.log(errorArr);
    }
    else{
        console.log(req.body);
    }
    // console.log(req.body);
}
module.exports = {
    loginRegister,
    logout,
    postRegister
};