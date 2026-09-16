import { useCallback, useEffect, useState } from "react"
import { FaCheck, FaHotel } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "../../Component/Pagination/pagination";
import { IoMdTime } from "react-icons/io";
import { FaTimesCircle } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import SwalAlert from "../../Component/SwalAlert/swal-alert";
import { MdCategory } from "react-icons/md";
import "./TableManagement.css"

export default function TableManagement({ data, page, currentPage, totalPage, user, overview, onPageChange, categories, setSearch, setReload, setCategory, handleRemove }) {
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const titleAccommodationPage = [
        {
            title: "Tên Cơ Sở Lưu Trú",
            class: ""
        },
        {
            title: "Loại hình",
            class: ""
        },
        {
            title: "Chủ Cơ Sở",
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
    ];

    const titleCategoryPage = [
        {
            title: "#",
            class: ""
        },
        {
            title: "Tên Danh Mục",
            class: ""
        },
        {
            title: "Trạng Thái",
            class: ""
        },
        {
            title: "Chỗ ở liên kết",
            class: "category-accommodation-column"
        },
        {
            title: "Ngày Tạo",
            class: ""
        },
        {
            title: "Thao Tác",
            class: "action-column"
        }
    ];


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

    const handleChangeTool = useCallback((e) => {
        const { name, value } = e.target;
        if (name == "search") setSearch(value);
        else setCategory(value);
    }, [])

    return (
        <>
            <div className="accommodation-manage container-fluid">
                <div className="main">
                    {page == "accommodation-manage" ? <div className="accommodation-overview">
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
                                    <span className="overview-number">{overview?.totalActive}</span>
                                    <span className="overview-label">Đang Hoạt Động</span>
                                </div>
                            </div>
                            <div className="overview-card">
                                <div className="overview-icon inactive"><FaToggleOff /></div>
                                <div className="overview-info">
                                    <span className="overview-number">{overview?.totalInActive}</span>
                                    <span className="overview-label">Không Hoạt Động</span>
                                </div>
                            </div>
                            <div className="overview-card">
                                <div className="overview-icon pending"><IoMdTime /></div>
                                <div className="overview-info">
                                    <span className="overview-number">{overview?.totalPending}</span>
                                    <span className="overview-label">Chờ Kiểm Duyệt</span>
                                </div>
                            </div>
                            <div className="overview-card">
                                <div className="overview-icon denied"><FaTimesCircle /></div>
                                <div className="overview-info">
                                    <span className="overview-number">{overview?.totalDenided}</span>
                                    <span className="overview-label">Bị Từ Chối</span>
                                </div>
                            </div>
                        </div>
                    </div> : <></>}
                    <div className="accommodation-list">
                        <div className="list-header">
                            <div className="d-flex items-center gap-x-3">
                                <div>
                                    <p className="list-title">
                                        {page === "accommodation-manage"
                                            ? "Danh Sách Cơ Sở Lưu Trú"
                                            : "Danh Sách Danh Mục"}
                                    </p>

                                    <p className="list-description">
                                        {page === "accommodation-manage"
                                            ? "Quản lý và theo dõi các cơ sở lưu trú"
                                            : "Quản lý các danh mục cơ sở lưu trú"}
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
                                        placeholder={
                                            page === "accommodation-manage"
                                                ? "Tìm theo tên, địa chỉ.."
                                                : "Tìm theo tên danh mục.."
                                        }
                                        name="search"
                                        onChange={handleChangeTool}
                                    />
                                </div>

                                {page === "accommodation-manage" && (
                                    <select name="category" onChange={handleChangeTool}>
                                        <option value="all">Tất cả loại hình</option>

                                        {categories?.length > 0 &&
                                            categories.map(item => (
                                                <option key={item._id} value={item._id}>
                                                    {item.title}
                                                </option>
                                            ))}
                                    </select>
                                )}

                                {page === "accommodation-manage" && user.role === "owner" && (
                                    <Link to="create">
                                        <button>+ Thêm Mới Cơ Sở Lưu Trú</button>
                                    </Link>
                                )}

                                {page === "category-manage" && (
                                    <Link to="create">
                                        <button>+ Thêm Danh Mục</button>
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="table-wrapper">
                            {page === "accommodation-manage" ? (
                                <table className="accommodation-table category-table">
                                    <thead>
                                        <tr>
                                            {titleCategoryPage.map((item, index) => (
                                                <th key={index} className={`category-table__header ${item.class}`}>
                                                    {item.title}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((category, index) => (
                                            <tr className="category-table__row" key={category._id || index}>
                                                <td className="category-table__index">
                                                    {index + 1}
                                                </td>

                                                <td className="category-table__name-cell">
                                                    <div className="category-name">
                                                        <div className="category-name-icon">
                                                            <MdCategory />
                                                        </div>
                                                        <span>{category.title}</span>
                                                    </div>
                                                </td>

                                                <td className="category-table__status-cell">
                                                    <div className="status-wrapper">
                                                        {category.status === "banned" ? (
                                                            <span className="status-locked">
                                                                <i></i>
                                                                Bị khóa
                                                            </span>
                                                        ) : (
                                                            <span className="status-active">
                                                                <i></i>
                                                                Hoạt động
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="category-table__accommodation-cell">
                                                    <div className="category-accommodation">
                                                        <FaHotel className="category-accommodation__icon" />
                                                        <span className="category-accommodation__quantity">
                                                            {category.quantityAccLinkTo || 0}
                                                        </span>
                                                        <span className="category-accommodation__label">
                                                            Chỗ ở
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="category-table__date-cell">
                                                    {category.createdAt
                                                        ? new Date(category.createdAt).toLocaleString("vi-VN")
                                                        : "Chưa cập nhật"}
                                                </td>

                                                <td className="category-table__action-cell">
                                                    <div className="category-actions">
                                                        <Link to={`detail/${category._id}`}>
                                                            <button
                                                                type="button"
                                                                className="category-action-btn category-action-btn--view"
                                                                title="Xem chi tiết"
                                                            >
                                                                <FaRegEye />
                                                            </button>
                                                        </Link>

                                                        <Link to={`edit/${category._id}`}>
                                                            <button
                                                                type="button"
                                                                className="category-action-btn category-action-btn--edit"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            className="category-action-btn category-action-btn--delete"
                                                            title="Xóa"
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : page === "category-manage" ? (
                                <table className="accommodation-table">
                                    <thead>
                                        <tr>
                                            {titleCategoryPage.map((item, index) => (
                                                <th key={index} className={item.class}>
                                                    {item.title}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {data.map((category, index) => (
                                            <tr key={category._id || index}>
                                                <td>{index + 1}</td>

                                                <td>
                                                    <div className="category-name">
                                                        <div className="category-name-icon">
                                                            <FaHotel />
                                                        </div>
                                                        <span>{category.title}</span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="status-wrapper">
                                                        {category.status === "banned" ? (
                                                            <span className="status-locked">
                                                                <i></i>
                                                                Bị khóa
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
                                                    <div className="category-accommodation">
                                                        <FaHotel className="category-accommodation__icon" />
                                                        <span className="category-accommodation__quantity">
                                                            {category.quantityAccLinkTo || 0}
                                                        </span>
                                                        <span className="category-accommodation__label">
                                                            Chỗ ở
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    {category.createdAt
                                                        ? new Date(category.createdAt).toLocaleString("vi-VN")
                                                        : "Chưa cập nhật"}
                                                </td>

                                                <td>
                                                    <div className="accommodation-actions">
                                                        <Link to={`detail/${category._id}`}>
                                                            <button
                                                                type="button"
                                                                className="accommodation-btn accommodation-btn-view"
                                                                title="Xem chi tiết"
                                                            >
                                                                <FaRegEye />
                                                            </button>
                                                        </Link>

                                                        <Link to={`edit/${category._id}`}>
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
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : null}
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