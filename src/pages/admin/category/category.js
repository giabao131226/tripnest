import { useCallback, useEffect, useState } from "react";
import Pagination from "../../../Component/Pagination/pagination";
import { Link, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { FaEye, FaEdit, FaLock, FaUnlock, FaTrash } from "react-icons/fa";
import SwalAlert from "../../../Component/SwalAlert/swal-alert";
import { RiHotelFill } from "react-icons/ri";
import TableManagement from "../../../Component/TableManagement/TableManagement";

export default function ManageCategory() {

    const [categories, setCategories] = useState([]);
    const [overview,setOverview] = useState({});
    const params = useParams();
    const [currentPage, setCurrentPage] = useState(params.page || 1);
    const [totalPage, setTotalPage] = useState(0);
    const [filterRole, setFilterRole] = useState("");
    const [search, setSearch] = useState("");
    const [status,setStatus] = useState("");
    const [reload, setReload] = useState(false);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    const handleRemove = useCallback((id) => {
        console.log(id);
        fetch(`${apiUrl}categories/delete/${id}`, {
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
    })

    const handleChangeStatus = useCallback((id, status) => {
        // fetch(`http://localhost:5000/admin/user/change-status/${status}/${id}`, {
        //     method: "PATCH",
        //     credentials: "include"
        // })
        //     .then(async res => {
        //         const data = await res.json();
        //         if(!res.ok) throw new Error(data.message);
        //         return data;
        //     })
        //     .then(data => {
        //         if (data.success) {
        //             SwalAlert("success",2000,"Cập nhật tài khoản thành công.");
        //             const newUsers = categories.map((item) => {
        //                 if (item._id == id) item.status = status;
        //                 return { ...item };
        //             })
        //             setUsers(newUsers);
        //         } 
        //     }).catch(ex => {
        //         SwalAlert("success",2000,ex);
        //     })
    }, [reload, categories])

    const onPageChange = useCallback((page) => {
        setCurrentPage(page);
    }, [currentPage])


    useEffect(() => {
        fetch(`${apiUrl}categories/all?status=${status}&search=${search}&page=${currentPage}`, {
            "credentials": "include"
        })
            .then(async res => {
                const data = res.json();
                if (!res.ok) throw new Error(data.message);
                return data;
            })
            .then(data => {
                if (data.success) {
                    setCategories(data.categories);
                    setCurrentPage(data.currentPage);
                    setTotalPage(data.totalPage);
                    setOverview(data.overview);
                }
            }).catch(ex => {
                SwalAlert("error", 2000, ex);
            })
    }, [reload, currentPage, search,status])

    return (
        <TableManagement
            data={categories}
            page={"category-manage"}
            currentPage={currentPage}
            totalPage={totalPage}
            user = {{}}
            overview = {overview}
            onPageChange={onPageChange}
            categories={categories}
            setSearch={setSearch}
            setReload={setReload}
            setStatus = {setStatus}
            setCategory={{}}
            handleRemove={handleRemove}
        />
    )
}