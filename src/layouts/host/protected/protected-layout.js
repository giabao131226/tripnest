import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function ProtectedLayoutHost() {
    const navigate = useNavigate();
    const [loading,setLoading] = useState(true);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth).payload;
    
    useEffect(() => {
        fetch(`${apiUrl}account/auth`,{
            credentials: "include"
        })
            .then(async res => {
                const data = res.json();
                if(!res.ok) throw new Error(data.message);
                return data;
            }).then(data => {
                dispatch({type: "UPDATE","payload": data.user});
            }).catch(ex => {
            }).finally(() => setLoading(false))
    },[])

    if(loading == true){
        return <h1>Đang loading</h1>
    }

    if(user && user?.role == "owner"){
        return <Outlet />
    }else navigate("/");
}