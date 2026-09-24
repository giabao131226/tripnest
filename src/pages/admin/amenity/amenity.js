import { Outlet } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SwalAlert from "../../../Component/SwalAlert/swal-alert";

export default function ManageAmenity(){
    const [amenities, setAmenities] = useState([]);
    const [overview,setOverview] = useState({});
    const params = useParams();
    const [currentPage, setCurrentPage] = useState(params.page || 1);
    const [totalPage, setTotalPage] = useState(0);
    const [search, setSearch] = useState("");
    const [status,setStatus] = useState("");
    const [reload, setReload] = useState(false);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    const handleRemove = useCallback((id) => {
        fetch(`${apiUrl}amenities/delete/${id}`, {
            method: "DELETE",
            credentials: "include"
        })
            .then(async res => {
                const data = res.json();
                if (!res.ok) throw new Error(data.message || "Có lỗi xảy ra");
                return data;
            })
            .then(data => {
                if (data.success) {
                    SwalAlert({
                        "status": "success",
                        "time": 2000,
                        "message": data.message
                    })
                    setReload(reload => !reload);
                }
            }).catch(error => {
                SwalAlert({
                        "status": "error",
                        "time": 2000,
                        "message": error
                    })
            })
    },[search,status])

    const handleChangeStatus = useCallback((id, status) => {
        fetch(`${apiUrl}amenities/change-status/${status}/${id}`, {
            method: "PATCH",
            credentials: "include"
        })
            .then(async res => {
                const data = await res.json();
                if(!res.ok) throw new Error(data.message);
                return data;
            })
            .then(data => {
                if (data.success) {
                    SwalAlert({
                        "status": "success",
                        "time": 2000,
                        "message": data.message
                    });
                    const newAmenities = amenities.map((item) => {
                        if (item._id == id) item.status = status;
                        return { ...item };
                    })
                    setAmenities(newAmenities);
                } 
            }).catch(ex => {
                SwalAlert("error",2000,ex);
            })
    }, [reload, amenities])

    const onPageChange = useCallback((page) => {
        setCurrentPage(page);
    }, [currentPage])


    useEffect(() => {
        fetch(`${apiUrl}amenities/all?status=${status}&search=${search}&page=${currentPage}`, {
            "credentials": "include"
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                return data;
            })
            .then(data => {
                if (data.success) {
                    setAmenities(data.amenities);
                    setCurrentPage(data.currentPage);
                    setTotalPage(data.totalPage);
                    setOverview(data.overview);
                }
            }).catch(ex => {
                SwalAlert("error", 2000, ex);
            })
    }, [reload, currentPage, search,status])
    return (
        <Outlet context={{
            "data": amenities,
            "overview": overview,
            "currentPage": currentPage,
            "totalPage": totalPage,
            "onPageChange": onPageChange,
            "handleChangeStatus": handleChangeStatus,
            "handleRemove": handleRemove,
            "setSearch": setSearch,
            "setStatus": setStatus
        }} />
    )
}