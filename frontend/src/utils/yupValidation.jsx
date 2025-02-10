import * as yup from "yup";

const userRegisterSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(2, "Username must contain at least 2 letters"),
  email: yup.string().required("Email is required").email("Email is not valid"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must contain at least 8 letters")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain special letter"),
  confirmpassword: yup
    .string()
    .required("Please confirm Password")
    .oneOf(
      [yup.ref("password"), null],
      "Confirm Password does not match with Password"
    ),
  firstname: yup
    .string()
    .required("First Name is required")
    .min(2, "First Name must contain at least 2 letters"),
  lastname: yup
    .string()
    .required("Last Name is required")
    .min(2, "Last Name must contain at least 2 letters"),
  gender: yup
    .string()
    .required("Gender is required")
    .oneOf(["male", "female"], "Gender is not valid"),
  dob: yup.string().required("Date of birth is required"),
});

const userLoginSchema = yup.object({
  username: yup.string().required("Please enter username"),
  password: yup.string().required("Please enter password")
})

const resetPassSchema = yup.object({
  email: yup.string().required("Email is required").email("Email is not valid")
})

const postSchema = yup.object({
  content: yup.string().required("")
})

const searchSchema = yup.object({
  searchcontent: yup.string().required("Search is required")
})

export {userRegisterSchema, userLoginSchema, resetPassSchema, postSchema, searchSchema};
