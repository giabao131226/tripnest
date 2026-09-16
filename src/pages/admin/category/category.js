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
    const params = useParams();
    const [currentPage, setCurrentPage] = useState(params.page || 1);
    const [totalPage, setTotalPage] = useState(0);
    const [filterRole, setFilterRole] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [search, setSearch] = useState("");
    const [reload, setReload] = useState(false);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == "role") {
            setFilterRole(value);
        } else if (name == "status") {
            setFilterStatus(value);
        }
        setSearch(value);
    }

    const handleRemove = useCallback((id) => {
        fetch(`${apiUrl}admin/user/delete/${id}`, {
            method: "DELETE"
        })
            .then(async res => {
                const data = res.json();
                if (!res.ok) throw new Error(data.message || "Có lỗi xảy ra");
                return data;
            })
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "🎉 Thành công!",
                        text: `${data.message}`,
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        background: "#ffffff",
                        color: "#333",
                        iconColor: "#22c55e",
                        toast: true,
                        position: "top-end"
                    });
                    setReload(reload => !reload);
                }
            }).catch(error => {
                Swal.fire({
                    icon: "error",
                    title: "❌ Có lỗi xảy ra!",
                    text: `${error.message}`,
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    background: "#ffffff",
                    color: "#333",
                    iconColor: "#ef4444",
                    toast: true,
                    position: "top-end"
                });
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
        fetch(`${apiUrl}categories/all`, {
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
                }
            }).catch(ex => {
                SwalAlert("error", 2000, ex);
            })
    }, [reload, currentPage, filterRole, filterStatus, search])

    return (
        <TableManagement
            data={categories}
            page={"category-manage"}
            currentPage={currentPage}
            totalPage={totalPage}
            onPageChange={onPageChange}
            categories={categories}
            setSearch={setSearch}
            setReload={setReload}
            handleRemove={handleRemove}
        />
    )
}