import { LoginFormFields } from "~/components/LoginForm/LoginForm";
import { AUTHORIZATION_TOKEN } from "~/constants/login";

export const useLogin = () => {
    const login = (creds: LoginFormFields) => {
        localStorage.setItem(
            AUTHORIZATION_TOKEN,
            btoa(`${creds.username}:${creds.password}`)
        );
    };

    return { login };
};