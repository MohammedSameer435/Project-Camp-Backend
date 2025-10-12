import {body} from "express-validator"
const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
    
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLowercase()
        .withMessage("Username must be in lowercase")
        .isLength({min:3})
        .withMessage("Username must be atleast 3 charecters long"),
    
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Passwprd is required"),
    
    body("fullName")
        .optional()
        .trim()
        

    ]
}

const userloginvalidator= () => {
    return [
        body("email")
             .optional()
             .isEmail()
             .withMessage("Email is invalid"),
            
        body("password")
            .notEmpty()
            .withMessage("Password is required")
            
    ]
}

const userChangeCUrrentPasswordValidator = () => {
    return [
        body("oldPassword").notEmpty().withMessage("Old password is required"),
        body("newPassword").notEmpty().withMessage("Onew password is required")
    ]
}
const forgotpasswordvalidator = () =>{
    return [
        body("email")
          .notEmpty()
          .withMessage("Email is required")
          .isEmail()
          .withMessage("Email is invalid")
    ]
}

const userresetforgotpasswordvalidator =() => {
    body("newPassword")
      .notEmpty()
      .withMessage("Password is required")
}
export {
    userRegisterValidator, userloginvalidator, userChangeCUrrentPasswordValidator, forgotpasswordvalidator, userresetforgotpasswordvalidator
}