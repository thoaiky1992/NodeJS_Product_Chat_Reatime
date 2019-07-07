import {validationResult} from 'express-validator/check';
import {auth} from '../services/index';
let loginRegister = (req,res) => {
    res.render('auth/master',{
        errors :req.flash('errors'),
        success:req.flash('success')
    }) ;
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
        req.flash('errors',errorArr);
        return res.redirect('/login-register')
    }
    auth.register(req.body.email,req.body.gender,req.body.password );
}
module.exports = {
    loginRegister,
    logout,
    postRegister
};