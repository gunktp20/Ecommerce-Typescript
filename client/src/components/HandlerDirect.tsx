import { useAppSelector } from "../app/hook"
import { Navigate } from "react-router-dom";

interface IProp {
    children: string | JSX.Element
}

const HandlerDirect = ({ children }: IProp) => {
    const { user, token } = useAppSelector(state => state.auth);
    if (user && token) {
        return <Navigate to="/home" />;
    }
    return children;
};

export default HandlerDirect;