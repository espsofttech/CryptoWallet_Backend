const {body , check}= require('express-validator')

exports.registerUserSchema=[

check('email')
.not().isEmpty()
.withMessage('email is required')
.isEmail()
.withMessage("please write a valid email"),
check('password')
.not().isEmpty()
.withMessage('password is required')
.notEmpty()
.isLength({min:5})
.withMessage("password must contain minimum 5 characters"),
check("confirm_password")
.not().isEmpty()
.custom((value,{req})=>value ===req.body.password)
.withMessage('password and confirm password does not match')

];

exports.loginUserSchema = [
    check('email')
        .not().isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid email'),
    check('password')
        .not().isEmpty()
        .withMessage('Password is required')
];

 exports.forgetPasswordSchema=[
    check('email')
    .not().isEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage("please enter a valid email")
 ]

 exports.changePasswordSchema=[
    check("old_password")
    .not().isEmpty()
    .withMessage(" old_password is required"),
    check('password')
    .not().isEmpty()
    .withMessage("password is required")
    .notEmpty()
    .isLength({min:5})
    .withMessage("password should have minimun 5 characters"),
    check("confirm_password")
    .not().isEmpty()
    .custom((value,{req})=>value ===req.body.password)
    .withMessage('password and confirm password does not match')


 ]

 exports.resetPasswordSchema=[
    check('password')
    .not().isEmpty()
    .withMessage("password is required")
    .notEmpty()
    .isLength({min:5})
    .withMessage("password should have minimun 5 characters")
 ]