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
import { useSelector } from "react-redux";
import { FaRegEye } from "react-icons/fa";


export default function QuanTri() {

    const user = useSelector(state => state.authAdmin);
    const [accommodations, setAccommodations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [search, setSearch] = useState("");
    const [category,setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [overview,setOverview] = useState({});
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    const handleChangeTool = useCallback((e) => {
        const { name, value } = e.target;
        if (name == "search") setSearch(value);
        else setCategory(value);
    }, [])

    const getAccommodationAtt = useCallback((att) => {
        if (att === "active") {
            return <span className="accommodation-status status-active">Hoạt Động</span>;
        }

        if (att === "inactive") {
            return <span className="accommodation-status status-inactive">Không hoạt động</span>;
        }

        if (att === "pending") {
            return <span className="accommodation-status status-pending">Đang chờ kiểm duyệt</span>;
        }

        return <span className="accommodation-status status-rejected">Bị Từ Chối</span>;
    }, []);

    const onPageChange = useCallback((page) => {
        setCurrentPage(page);
    }, [currentPage])

    useEffect(() => {
        fetch(`${apiUrl}categories`, {
            "credentials": "include"
        })
            .then(async res => {
                const data = await res.json();
                if(!res.ok) throw new Error(data.message);
                return data;
            })
            .then(data => {
                if(data.success) setCategories(data.categories);
            })
            .catch(ex => {
                console.log(ex);
            })
    }, [])

    useEffect(() => {
        fetch(`${apiUrl}admin/accommodation/all?page=${currentPage}&search=${search}&category=${category}`, {
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
    }, [currentPage, search,category])

    return (
        <>
            <div className="accommodation-manage container-fluid">
                <div className="main">
                    <div className="accommodation-overview">
                        <div className="overview-header">
                            <div>
                                <p className="overview-title">Thông Tin Tổng Quan</p>
                                <p className="overview-description">Tổng quan tình trạng các cơ sở lưu trú</p>
                            </div>
                        </div>
                        <div className="overview-cards">
                            <div className="overview-card">
                                <div className="overview-icon active"><FaCheck /></div>
                                <div className="overview-info">
                                    <span className="overview-number">{overview.totalActive}</span>
                                    <span className="overview-label">Đang Hoạt Động</span>
                                </div>
                            </div>
                            <div className="overview-card">
                                <div className="overview-icon inactive"><FaToggleOff /></div>
                                <div className="overview-info">
                                    <span className="overview-number">{overview.totalInActive}</span>
                                    <span className="overview-label">Không Hoạt Động</span>
                                </div>
                            </div>
                            <div className="overview-card">
                                <div className="overview-icon pending"><IoMdTime /></div>
                                <div className="overview-info">
                                    <span className="overview-number">{overview.totalPending}</span>
                                    <span className="overview-label">Chờ Kiểm Duyệt</span>
                                </div>
                            </div>
                            <div className="overview-card">
                                <div className="overview-icon denied"><FaTimesCircle /></div>
                                <div className="overview-info">
                                    <span className="overview-number">{overview.totalDenided}</span>
                                    <span className="overview-label">Bị Từ Chối</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accommodation-list">
                        <div className="list-header">
                            <div className="d-flex items-center gap-x-3">
                                <div>
                                    <p className="list-title">Danh Sách Cơ Sở Lưu Trú</p>
                                    <p className="list-description">Quản lý và theo dõi các cơ sở lưu trú</p>
                                </div>
                                <div className="list-total">
                                    <span>Tổng số</span>
                                    <strong>{overview.total}</strong>
                                </div>
                            </div>
                            <div className="tool">
                                <div className="tool-search d-flex items-center gap-x-3">
                                    <FaSearch />
                                    <input
                                        placeholder="Tìm theo tên, địa chỉ.."
                                        name="search"
                                        onChange={handleChangeTool}
                                    ></input>
                                </div>
                                <select name="category" onChange={handleChangeTool}>
                                    <option value={"all"}>Tất cả loại hình</option>
                                    {categories?.length > 0 ? categories.map((item) => 
                                        <option value = {item._id}>{item.title}</option>
                                    ) : <></>}
                                </select>
                                {user.role == "owner" ? <button>+ Thêm Mới Cơ Sở Lưu Trú</button> : <></>}
                            </div>
                        </div>
                        <div className="table-wrapper">
                            <table className="accommodation-table">
                                <thead>
                                    <tr>
                                        <th>Tên Cơ Sở Lưu Trú</th>
                                        <th>Loại hình</th>
                                        <th>Chủ Cơ Sở</th>
                                        <th>Trạng Thái</th>
                                        <th className="action-column">Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accommodations.map((item, index) => (
                                        <tr key={item._id || index}>
                                            <td>
                                                <div className="accommodation-name">
                                                    <div className="accommodation-name-icon"><FaHotel /></div>
                                                    <span>{item.name}</span>
                                                </div>
                                            </td>
                                            <td>{item.category_id ? item.category_id.title : "Chưa Cập Nhật"}</td>
                                            <td>
                                                <div className="owner-info">
                                                    <div className="owner-avatar">{item.ownerId?.username?.charAt(0)?.toUpperCase()}</div>
                                                    <span>{item.ownerId?.username || "Chưa cập nhật"}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="status-wrapper">{getAccommodationAtt(item.status)}</div>
                                            </td>
                                            <td>
                                                <div className="accommodation-actions">
                                                    <button type="button" className="accommodation-btn accommodation-btn-view" title="Xem chi tiết"><FaRegEye /></button>
                                                    <button type="button" className="accommodation-btn accommodation-btn-flag" title="Kiểm duyệt"><FaFlag /></button>
                                                    <button type="button" className="accommodation-btn accommodation-btn-delete" title="Xóa"><MdDelete /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="accommodation-pagination">
                            <Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={onPageChange} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}