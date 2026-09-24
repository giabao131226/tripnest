import { useOutletContext } from "react-router-dom"
import { useCallback} from "react"
import { FaCheck, FaHotel, FaHome, FaBuilding, FaUmbrellaBeach, FaBed } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "../../../Component/Pagination/pagination";
import { IoMdTime } from "react-icons/io";
import { FaTimesCircle } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";

export default function TableManageAmenity() {
    const titleAmenityPage = [
        {
            title: "#",
            class: ""
        },
        {
            title: "Tiện Ích",
            class: ""
        },
        {
            title: "Ngày Tạo",
            class: ""
        },
        {
            title: "Trạng Thái",
            class: ""
        },
        {
            title: "Hành Động",
            class: "action-column"
        }
    ]
    const handleChangeTool = useCallback((e) => {
        const { name, value } = e.target;
        if (name == "search") setSearch(value);
        else if (name == "status") setStatus(value);
    }, [])

    const { 
        data,
        overview,
        currentPage,
        totalPage ,
        onPageChange,
        handleChangeStatus,
        handleRemove,
        setSearch,
        setStatus
    } = useOutletContext();
    return (
        <>
            <div className="accommodation-manage container-fluid">
                <div className="main">
                    <div className="accommodation-overview">
                        <div className="overview-header">
                            <div>
                                <p className="overview-title">
                                    Thông Tin Tiện Ích
                                </p>
                                <p className="overview-description">
                                    Tổng Quan Tình Trạng Tiện Ích
                                </p>
                            </div>
                        </div>

                        <div className={`overview-cards overview-cards--category`}>
                            <div className="overview-card">
                                <div className="overview-icon active">
                                    <FaCheck />
                                </div>
                                <div className="overview-info">
                                    <span className="overview-number">
                                        {overview?.totalActive}
                                    </span>
                                    <span className="overview-label">
                                        Đang Hoạt Động
                                    </span>
                                </div>
                            </div>

                            <div className="overview-card">
                                <div className="overview-icon inactive">
                                    <FaToggleOff />
                                </div>
                                <div className="overview-info">
                                    <span className="overview-number">
                                        {overview?.totalInActive}
                                    </span>
                                    <span className="overview-label">
                                        Bị Khóa
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="accommodation-list">
                        <div className="list-header">
                            <div className="d-flex items-center gap-x-3">
                                <div>
                                    <p className="list-title">
                                        Danh Sách Tiện Ích
                                    </p>

                                    <p className="list-description">
                                        Quản lý các tiện ích
                                    </p>
                                </div>

                                <div className="list-total">
                                    <span>Tổng số</span>
                                    <strong>{overview?.total}</strong>
                                </div>
                            </div>

                            <div className="tool">
                                <div className="tool-search d-flex items-center gap-x-3">
                                    <FaSearch />
                                    <input
                                        placeholder="Tìm theo tên tiện ích"
                                        name="search"
                                        onChange={handleChangeTool}
                                    />
                                </div>


                                <select
                                    name="status"
                                    className="amenity-status-filter"
                                    onChange={handleChangeTool}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Bị khóa</option>
                                </select>


                                <Link to="create">
                                    <button>+ Thêm Tiện Ích</button>
                                </Link>

                            </div>
                        </div>
                        <div className="table-wrapper">
                            <table className="accommodation-table">
                                <thead>
                                    <tr>
                                        {titleAmenityPage.map((item, index) => (
                                            <th key={index} className={item.class}>
                                                {item.title}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.map((amenity, index) => (
                                        <tr key={amenity._id || index}>
                                            <td>{index + 1}</td>

                                            <td>
                                                <div className="amenity-name">
                                                    <div className="amenity-name-icon">
                                                        <i className={`${amenity.icon}`}></i>
                                                    </div>
                                                    <span>{amenity.name}</span>
                                                </div>
                                            </td>

                                            <td>
                                                {amenity.createdAt
                                                    ? new Date(amenity.createdAt).toLocaleString("vi-VN")
                                                    : "Chưa cập nhật"}
                                            </td>


                                            <td>
                                                <div className="status-wrapper">
                                                    {amenity.status === "inactive" ? (
                                                        <span className="status-locked">
                                                            <i></i>
                                                            Không hoạt động
                                                        </span>
                                                    ) : (
                                                        <span className="status-active">
                                                            <i></i>
                                                            Hoạt động
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="accommodation-actions">
                                                    <Link to={`detail/${amenity._id}`}>
                                                        <button
                                                            type="button"
                                                            className="accommodation-btn accommodation-btn-view"
                                                            title="Xem chi tiết"
                                                        >
                                                            <FaRegEye />
                                                        </button>
                                                    </Link>


                                                    <button
                                                        type="button"
                                                        className="accommodation-btn accommodation-btn-flag"
                                                        title="Thay đổi trạng thái"
                                                        onClick={() => { handleChangeStatus(amenity._id, (amenity.status == "active" ? "inactive" : "active")) }}
                                                    >
                                                        {amenity.status == "active" ? <FaLock /> : <FaLockOpen />}
                                                    </button>

                                                    <Link to={`edit/${amenity._id}`}>
                                                        <button
                                                            type="button"
                                                            className="accommodation-btn accommodation-btn-flag"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className="accommodation-btn accommodation-btn-delete"
                                                        title="Xóa"
                                                        onClick={() => {
                                                            handleRemove(amenity._id);
                                                        }}
                                                    >
                                                        <MdDelete />
                                                    </button>
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