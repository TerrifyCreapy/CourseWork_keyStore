const {body} = require("express-validator");

export const regSchema = [
    body("email", "Incorrect email").isEmail(),
    body("password", "The length of password must be more than 4 and less then 8").isLength({min: 5, max: 7}),
]