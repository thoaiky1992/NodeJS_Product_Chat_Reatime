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
let postRegister = async (req,res) => {
    let errorArr   = [];
    let successArr = [];
    const errorValidation = validationResult(req);
    if(!errorValidation.isEmpty()){
        let errors = Object.values(errorValidation.mapped()); // Object.values lấy tất cả các value bỏ vào mảng 
        errors.forEach(item => {
            errorArr.push(item.msg);
        })
        req.flash('errors',errorArr);
        return res.redirect('/login-register')
    }
    try {
        let userCreateSuccess = await auth.register(req.body.email,req.body.gender,req.body.password,req.protocol,req.get("host"));
        successArr.push(userCreateSuccess);
        req.flash('success',successArr);
        return res.redirect('/login-register')
    } catch (error) {
        errorArr.push(error);
        req.flash('errors',errorArr);
        return res.redirect('/login-register');
    }
};
let verifyAccount = async (req,res) => {
    let errorArr   = [];
    let successArr = [];
    try {
        let verifySuccess = await auth.verifyAccount(req.params.token);
        successArr.push(verifySuccess);
        req.flash('success',successArr);
        return res.redirect('/login-register')
    } catch (error) {
        errorArr.push(error);
        req.flash('errors',errorArr);
        return res.redirect('/login-register');
    }
}
module.exports = {
    loginRegister,
    logout,
    postRegister,
    verifyAccount
};