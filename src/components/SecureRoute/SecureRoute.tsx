import { PropsWithChildren, useEffect, useState } from "react";
import LoginModal from "~/components/LoginModal/LoginModal";

export default function SecureRoute(props: PropsWithChildren) {
    const { children } = props;
    const [authorized, setAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const authorizationToken = localStorage.getItem("authorization_token");
        setAuthorized(!!authorizationToken);
    }, []);

    const handleLogin = () => {
        setAuthorized(true);
    };

    if (authorized === null) {
        return null;
    }

    return authorized ? (
        <>{children}</>
    ) : (
        <LoginModal onLogin={handleLogin} open />
    );
}