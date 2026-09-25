import { Navigate } from "react-router-dom";


function HomeRedirect() {

    const user =
        localStorage.getItem(
            "kathabook_user"
        );

    const accessToken =
        localStorage.getItem(
            "kathabook_access_token"
        );

    const refreshToken =
        localStorage.getItem(
            "kathabook_refresh_token"
        );


    if (
        user &&
        accessToken &&
        refreshToken
    ) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }


    return (
        <Navigate
            to="/login"
            replace
        />
    );
}


export default HomeRedirect;