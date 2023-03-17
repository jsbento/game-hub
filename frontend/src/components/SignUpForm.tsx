import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { setUser } from "../state/actions/Actions";
import { User } from "../types/Users";

const SignUpForm: React.FC = () => {
    const dispatch = useDispatch();
    const signIn = (user: User) => dispatch(setUser(user));

    const [ username, setUsername ] = useState<string>("");
    const [ email, setEmail ] = useState<string>("");
    const [ emailConfirm, setEmailConfirm ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const [ passwordConfirm, setPasswordConfirm ] = useState<string>("");
    const [ errors, setErrors ] = useState<string[]>([]);

    const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const onChangePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordConfirm(e.target.value);
    }

    const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const onChangeEmailConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailConfirm(e.target.value);
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        validateInput();
        if( errors.length > 0 ) return;
        
        await fetch("http://localhost:8080/users/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password,
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                signIn(data.user);
            } else {
                setErrors([...errors, data.message]);
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    const validateInput = () => {
        if( username === "" )
            setErrors([...errors, "Username is required"])
        else if( email === "" )
            setErrors([...errors, "Email is required"])
        else if( emailConfirm === "" )
            setErrors([...errors, "Confirm Email is required"])
        else if( password === "" )
            setErrors([...errors, "Password is required"])
        else if( passwordConfirm === "" )
            setErrors([...errors, "Confirm Password is required"])
        else if( email !== emailConfirm )
            setErrors([...errors, "Emails do not match"])
        else if( password !== passwordConfirm )
            setErrors([...errors, "Passwords do not match"])
        else
            setErrors([]);
    }

    return(
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={ onSubmit }>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" value={ username } onChange={ onChangeUsername } />

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={ password } onChange={ onChangePassword } />

                    <label htmlFor="passwordConfirm">Confirm Password</label>
                    <input type="password" id="passwordConfirm" name="passwordConfirm" value={ passwordConfirm } onChange={ onChangePasswordConfirm } />

                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={ email } onChange={ onChangeEmail } />

                    <label htmlFor="emailConfirm">Confirm Email</label>
                    <input type="email" id="emailConfirm" name="emailConfirm" value={ emailConfirm } onChange={ onChangeEmailConfirm } />

                    <button type="submit">Sign Up</button>
                </div>
            </form>
            { errors.length !== 0 && errors.map((error, index) => <p key={ index }>{ error }</p>) }
        </div>
    );
}

export default SignUpForm;