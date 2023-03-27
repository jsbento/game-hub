import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "../state/actions/Actions";
import { Token, User, UserWithToken } from "../types/Users";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

type SignInValues = {
    username: string;
    password: string;
}

type SignUpValues = {
    username: string;
    email: string;
    emailConfirm: string;
    password: string;
    passwordConfirm: string;
}

const signInInitial: SignInValues = {
    username: "",
    password: "",
}

const SignInSchema = Yup.object().shape({
    username: Yup.string().trim().required("Username is required"),
    password: Yup.string().trim().required("Password is required"),
})

const signUpInitial: SignUpValues = {
    username: "",
    email: "",
    emailConfirm: "",
    password: "",
    passwordConfirm: "",
}

const SignUpSchema = Yup.object().shape({
    username: Yup.string().trim().required("Username is required"),
    email: Yup.string().trim().email("Invalid email").required("Email is required"),
    emailConfirm: Yup.string().trim().email("Invalid email").required("Email confirmation is required").oneOf([Yup.ref("email")], "Emails must match"),
    password: Yup.string().trim().required("Password is required"),
    passwordConfirm: Yup.string().trim().required("Password confirmation is required").oneOf([Yup.ref("password")], "Passwords must match"),
})

const AuthForm: React.FC = () => {
    const dispatch = useDispatch();
    const signIn = (user: User) => dispatch(setUser(user));
    const saveToken = (token: Token) => dispatch(setToken(token));

    const [ isSignIn, setIsSignIn ] = useState<boolean>(true);
    const [ username, setUsername ] = useState<string>("");
    const [ email, setEmail ] = useState<string>("");
    const [ emailConfirm, setEmailConfirm ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const [ passwordConfirm, setPasswordConfirm ] = useState<string>("");

    return (
        <div className="border w-1/2 rounded-lg shadow">
            <Formik
                initialValues={ isSignIn ? signInInitial : signUpInitial }
                validationSchema={ isSignIn ? SignInSchema : SignUpSchema }
                validateOnChange={ false }
                validateOnBlur={ false }
                onSubmit={ async (values, { setSubmitting, setErrors }) => {
                    if( !isSignIn ) {
                        const { username, email, password } = values as SignUpValues;
                        const user: UserWithToken = await fetch("http://localhost:8080/users/sign-up", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ username, email, password }),
                        })
                        .then( res => res.json() )
                        .catch( err => setErrors(err) );
                        saveToken(user.token);
                    }
                    const { username, password } = values as SignInValues;
                    const token: Token = await fetch("http://localhost:8080/users/sign-in", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, password }),
                    })
                    .then( res => res.json() )
                    .catch( err => setErrors(err) );
                    saveToken(token);
                    setSubmitting(false);
                } }
            >
                { ({ isSubmitting, errors }) => (
                    <>
                        <h2 className="text-2xl font-bold text-center">{ isSignIn ? "Sign In" : "Sign Up" }</h2>
                        <Form className="flex flex-col w-1/2 mx-auto">
                            <div className="flex flex-col">
                                <label htmlFor="username" className="font-semibold">Username</label>
                                <Field type="text" id="username" name="username" className="border rounded-md" />
                                <ErrorMessage name="username" component="div" />
                            </div>
                            { !isSignIn && (
                                <>
                                    <div className="flex flex-col">
                                        <label htmlFor="email" className="font-semibold">Email</label>
                                        <Field type="email" id="email" name="email" className="border rounded-md" />
                                        <ErrorMessage name="email" component="div" />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="emailConfirm" className="font-semibold">Confirm Email</label>
                                        <Field type="email" id="emailConfirm" name="emailConfirm" className="border rounded-md" />
                                        <ErrorMessage name="emailConfirm" component="div" />
                                    </div>
                                </>
                            )}
                            <div className="flex flex-col">
                                <label htmlFor="password" className="font-semibold">Password</label>
                                <Field type="password" id="password" name="password" className="border rounded-md" />
                                <ErrorMessage name="password" component="div" />
                            </div>
                            { !isSignIn && (
                                <div className="flex flex-col">
                                    <label htmlFor="passwordConfirm" className="font-semibold">Confirm Password</label>
                                    <Field type="password" id="passwordConfirm" name="passwordConfirm" className="border rounded-md" />
                                    <ErrorMessage name="passwordConfirm" component="div" />
                                </div>
                            )}
                            <button type="submit" className="bg-emerald-600 text-white font-bold py-2 px-4 rounded my-4" disabled={ isSubmitting }>
                                { isSignIn ? "Sign In" : "Sign Up" }
                            </button>
                            <p className="my-4">
                                { isSignIn && "Don't have an account?"} <button type="button" className="text-emerald-600 font-bold" onClick={ () => setIsSignIn(!isSignIn) }>{ isSignIn ? "Sign Up" : "Sign In" }</button>
                            </p>
                            { isSubmitting && <div className="animate-pulse font-semibold text-lg my-4">Loading...</div> }
                        </Form>
                    </>
                ) }
            </Formik>
        </div>
    )
}

export default AuthForm;