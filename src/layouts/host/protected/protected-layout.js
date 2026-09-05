import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

export default function ProtectedLayoutHost() {
    const navigate = useNavigate();
    const user = useSelector(state => state.auth).payload;
    if(user && user.role == "owner"){
        return <Outlet />
    }
    return navigate("/");
}