import { useCallback, useEffect, useState } from "react"
import { FaCheck, FaHotel } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "../../../../Component/Pagination/pagination";
import "./index.css"
import { IoMdTime } from "react-icons/io";
import { FaTimesCircle } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { Link, useOutletContext } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import Swal from 'sweetalert2';
import SwalAlert from "../../../../Component/SwalAlert/swal-alert";
import TableManagement from "../../../../Component/TableManagement/TableManagement";


export default function QuanTri() {
    const { user } = useOutletContext();
    const [accommodations, setAccommodations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [overview, setOverview] = useState({});
    const [reload, setReload] = useState(false);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    const onPageChange = useCallback((page) => {
        setCurrentPage(page);
    }, [currentPage])

    const handleRemoveAccommodation = useCallback((id) => {
        fetch(`${apiUrl}host/accommodation/delete/${id}`, {
            method: "DELETE",
            credentials: "include"
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                return data;
            }).then(data => {
                if (data.success) {
                    SwalAlert({"status": "success",
                        "time": 2000,
                        "message": data.message});
                    setReload(reload => !reload);
                }
            }).catch(ex => {
                SwalAlert("error",2000,ex);
            })
    }, [])

    useEffect(() => {
        fetch(`${apiUrl}categories`, {
            "credentials": "include"
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                return data;
            })
            .then(data => {
                if (data.success) setCategories(data.categories);
            })
            .catch(ex => {
                console.log(ex);
            })
    }, [])

    useEffect(() => {
        fetch(`${apiUrl + (user.role === "admin" ? user.role : "host")}/accommodation/all?page=${currentPage}&search=${search}&category=${category}`, {
            "credentials": "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCurrentPage(data.currentPage);
                    setTotalPage(data.totalPage);
                    setAccommodations(data.accommodations);
                    setOverview(data.overview);
                }
            })
    }, [currentPage, search, category, reload])

    return (
        <>
            <TableManagement 
                data = {accommodations} 
                page = {"accommodation-manage"}
                currentPage={currentPage} 
                totalPage={totalPage} 
                user={user} 
                overview={overview}
                onPageChange={onPageChange}
                categories = {categories}
                setSearch={setSearch}
                setReload={setReload}
                setCategory={setCategory}
                handleRemove = {handleRemoveAccommodation}
                />
        </>
    )
}