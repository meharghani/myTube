import * as Yup from "yup"
const passswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const errorMessage = "use lowercase, uppercasea and digits";

const loginSchema = Yup.object().shape({
    identifier:Yup.string().test(
        'is-email-or-username',
        'Must be a valid email or username',
        function(value){
            const email = Yup.string().email().isValidSync(value)
            const username =  /^[a-zA-Z0-9_]+$/.test(value)
            return email || username
        }
    ).required("Email or username is required"),
    password:Yup
    .string()
    .min(8,"Password must be atleast 8 characters")
    .max(20,"Password not greater then 20 characters")
    .matches(passswordPattern, { message: errorMessage })
    .required("Password is required")
})
export default loginSchema