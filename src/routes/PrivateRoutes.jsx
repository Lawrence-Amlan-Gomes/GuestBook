import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

import {Outlet, Navigate} from "react-router-dom";

const PrivateRoutes = () => {
    // eslint-disable-next-line no-unused-vars
    const [user, loading, error] = useAuthState(auth);
    if (loading) return <p>Loading user data...</p>

    return(
        <>
            {user ? <Outlet /> : <Navigate to="/login" />}
        </>
    )
}

export default PrivateRoutes;