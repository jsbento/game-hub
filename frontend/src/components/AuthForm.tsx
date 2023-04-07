import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUserToken } from "../state/actions/Actions";
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
    username: Yup.string().trim().required( "Username is required" ),
    email: Yup.string().trim().email( "Invalid email" ).required( "Email is required" ),
    emailConfirm: Yup.string().trim().email( "Invalid email" ).required("Email confirmation is required").oneOf( [ Yup.ref( "email" )], "Emails must match" ),
    password: Yup.string().trim().required( "Password is required" ),
    passwordConfirm: Yup.string().trim().required( "Password confirmation is required" ).oneOf( [ Yup.ref( "password" )], "Passwords must match" ),
})

const AuthForm: React.FC = () => {
    const dispatch = useDispatch();
    const setAuth = useCallback(( userWithToken: UserWithToken ) => dispatch( setUserToken( userWithToken )), [ dispatch ]);

    const navigate = useNavigate();

    const [ isSignIn, setIsSignIn ] = useState<boolean>( true );
    const [ signInError, setSignInError ] = useState<string | null>( null );

    return (
        <div className="border w-1/2 rounded-lg shadow">
            <Formik
                initialValues={ isSignIn ? signInInitial : signUpInitial }
                validationSchema={ isSignIn ? SignInSchema : SignUpSchema }
                validateOnChange={ false }
                validateOnBlur={ false }
                onSubmit={ async (values, { setSubmitting }) => {
                    let body;
                    if( !isSignIn ) {
                        const { username, email, password } = values as SignUpValues;
                        body = JSON.stringify({ username, email, password });
                    } else {
                        const { username, password } = values as SignInValues;
                        body = JSON.stringify({ username, password });
                    }
                    const resp: UserWithToken = await fetch(`http://localhost:8080/users/${isSignIn ? "sign-in" : "sign-up"}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body,
                    })
                    .then( res => res.json() )
                    .catch( err => {
                        setSignInError( err.message );
                        setSubmitting( false );
                    });
                    setAuth( resp );
                    setSubmitting( false );
                    navigate( "/" );
                } }
            >
                { ({ isSubmitting }) => (
                    <>
                        <h2 className="text-2xl font-bold text-center">{ isSignIn ? "Sign In" : "Sign Up" }</h2>
                        <Form className="flex flex-col w-1/2 mx-auto">
                            <div className="flex flex-col">
                                <label htmlFor="username" className="font-semibold">Username</label>
                                <Field type="text" id="username" name="username" className="border rounded-md" />
                                <ErrorMessage name="username" render={ message => <FormError message={ message } /> } />
                            </div>
                            { !isSignIn && (
                                <>
                                    <div className="flex flex-col">
                                        <label htmlFor="email" className="font-semibold">Email</label>
                                        <Field type="email" id="email" name="email" className="border rounded-md" />
                                        <ErrorMessage name="email" render={ message => <FormError message={ message } /> } />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="emailConfirm" className="font-semibold">Confirm Email</label>
                                        <Field type="email" id="emailConfirm" name="emailConfirm" className="border rounded-md" />
                                        <ErrorMessage name="emailConfirm" render={ message => <FormError message={ message } /> } />
                                    </div>
                                </>
                            )}
                            <div className="flex flex-col">
                                <label htmlFor="password" className="font-semibold">Password</label>
                                <Field type="password" id="password" name="password" className="border rounded-md" />
                                <ErrorMessage name="password" render={ message => <FormError message={ message } /> } />
                            </div>
                            { !isSignIn && (
                                <div className="flex flex-col">
                                    <label htmlFor="passwordConfirm" className="font-semibold">Confirm Password</label>
                                    <Field type="password" id="passwordConfirm" name="passwordConfirm" className="border rounded-md" />
                                    <ErrorMessage name="passwordConfirm" render={ message => <FormError message={ message } /> } />
                                </div>
                            )}
                            <button type="submit" className="bg-emerald-600 text-white font-bold py-2 px-4 rounded my-4" disabled={ isSubmitting }>
                                { isSignIn ? "Sign In" : "Sign Up" }
                            </button>
                            <p className="my-4">
                                { isSignIn ? "Don't have an account? " : "Already have an account? " }
                                <button type="button" className="text-emerald-600 font-bold" onClick={ () => setIsSignIn(!isSignIn) }>
                                    { isSignIn ? "Sign Up" : "Sign In" }
                                </button>
                            </p>
                            { signInError && <div className="text-red-500 font-semibold text-sm">{ signInError }</div> }
                            { isSubmitting && <div className="animate-pulse font-semibold text-lg my-4">Loading...</div> }
                        </Form>
                    </>
                ) }
            </Formik>
        </div>
    )
}

interface FormErrorProps {
    message: string;
}
const FormError: React.FC<FormErrorProps> = ({ message }) => {
    return (
        <div className="text-red-500 font-semibold text-sm">
            { message }
        </div>
    )
}

export default AuthForm;