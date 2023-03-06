import React, { useState } from "react";

type SignUpProps = {
    visible: boolean;
}

const SignUpForm: React.FC<SignUpProps> = ({ visible }) => {
    const [ username, setUsername ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const [ passwordConfirm, setPasswordConfirm ] = useState<string>("");
    const [ email, setEmail ] = useState<string>("");
    const [ emailConfirm, setEmailConfirm ] = useState<string>("");

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

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submit");
    }

    return visible ? (
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
        </div>
    ) : null;
}