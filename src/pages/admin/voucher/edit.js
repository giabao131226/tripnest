
import { useState, useEffect, useCallback } from "react";
import SwalAlert from "../../../Component/SwalAlert/swal-alert";
import { useNavigate, useParams } from "react-router-dom";
import "../../../assets/css/admin/category/create.css";
import "../../../assets/css/admin/vouchers/create.css";
import { validateVoucher } from "../../../helper/validatedVoucher";
import { FaSearch } from "react-icons/fa";
import Pagination from "../../../Component/Pagination/pagination";

export default function EditVoucher() {

    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();
    const params = useParams();

    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [search, setSearch] = useState("");

    const [data, setData] = useState({
        code: "",
        name: "",
        description: "",
        discount_type: "percent",
        discount_value: "",
        max_discount: "",
        min_order_value: 0,
        quantity: "",
        apply_scope: "all",
        user_ids: [],
        start_date: "",
        end_date: "",
        status: "active"
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === "apply_scope" && value === "specific_users") {
            setCurrentPage(1);
        }
    }, []);

    const handleUserChange = useCallback((e) => {
        const { value, checked } = e.target;

        setData(prev => ({
            ...prev,
            user_ids: checked
                ? prev.user_ids.includes(value)
                    ? prev.user_ids
                    : [...prev.user_ids, value]
                : prev.user_ids.filter(id => id !== value)
        }));
    }, []);

    const onPageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    const handleSearch = useCallback((e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    }, []);

    const formatDateTimeLocal = useCallback((date) => {
        if (!date) return "";

        const value = new Date(date);

        if (Number.isNaN(value.getTime())) {
            return "";
        }

        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, "0");
        const day = String(value.getDate()).padStart(2, "0");
        const hours = String(value.getHours()).padStart(2, "0");
        const minutes = String(value.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        const error = validateVoucher(data);

        if (error) {
            SwalAlert({
                status: "error",
                time: 2000,
                message: error
            });
            return;
        }

        const payload = {
            code: data.code.trim().toUpperCase(),
            name: data.name.trim(),
            description: data.description?.trim(),
            discount_type: data.discount_type,
            discount_value: Number(data.discount_value),
            max_discount: data.max_discount === ""
                ? null
                : Number(data.max_discount),
            min_order_value: Number(data.min_order_value),
            quantity: Number(data.quantity),
            apply_scope: data.apply_scope,
            user_ids: data.apply_scope === "specific_users"
                ? data.user_ids
                : [],
            start_date: data.start_date,
            end_date: data.end_date,
            status: data.status
        };

        fetch(`${apiUrl}admin/vouchers/edit/${params.id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(async res => {
                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.message);
                }

                return result;
            })
            .then(result => {
                if (result.success) {
                    SwalAlert({
                        status: "success",
                        time: 2000,
                        message: result.message
                    });
                    navigate(-1);
                }
            })
            .catch(ex => {
                SwalAlert({
                    status: "error",
                    time: 2000,
                    message: ex.message
                });
            });
    }, [apiUrl, data, navigate, params.id]);

    useEffect(() => {
        fetch(`${apiUrl}admin/vouchers/detail/${params.id}`, {
            credentials: "include"
        })
            .then(async res => {
                const result = await res.json();

                if (!res.ok || result.success === false) {
                    throw new Error(result.message);
                }

                return result;
            })
            .then(result => {
                console.log(result);
                if (result.success) {
                    const voucher = result.detail;

                    setData({
                        code: voucher.code || "",
                        name: voucher.name || "",
                        description: voucher.description || "",
                        discount_type: voucher.discount_type || "percent",
                        discount_value: voucher.discount_value ?? "",
                        max_discount: voucher.max_discount ?? "",
                        min_order_value: voucher.min_order_value ?? 0,
                        quantity: voucher.quantity ?? "",
                        apply_scope: voucher.apply_scope || "all",
                        user_ids: Array.isArray(voucher.user_ids)
                            ? voucher.user_ids.map(id =>
                                typeof id === "object" ? id._id : id
                            )
                            : [],
                        start_date: formatDateTimeLocal(voucher.start_date),
                        end_date: formatDateTimeLocal(voucher.end_date),
                        status: voucher.status || "active"
                    });
                }
            })
            .catch(ex => {
                SwalAlert({
                    status: "error",
                    time: 2000,
                    message: ex.message
                });
            });
    }, [apiUrl, params.id, formatDateTimeLocal]);

    useEffect(() => {
        if (data.apply_scope !== "specific_users") {
            return;
        }

        fetch(`${apiUrl}admin/user/all?page=${currentPage}&search=${search}`, {
            credentials: "include"
        })
            .then(async res => {
                const result = await res.json();

                if (!res.ok || result.success === false) {
                    throw new Error(result.message);
                }

                return result;
            })
            .then(result => {
                if (result.success) {
                    setUsers(result.users);
                    setCurrentPage(result.currentPage);
                    setTotalPage(result.totalPage);
                }
            })
            .catch(ex => {
                SwalAlert({
                    status: "error",
                    time: 2000,
                    message: ex.message
                });
            });
    }, [apiUrl, currentPage, search, data.apply_scope]);

    return (
        <>
            <div className="category-create">
                <div className="category-create__container">
                    <div className="category-create__header">
                        <div>
                            <h1>Chỉnh sửa Voucher</h1>
                            <p>Cập nhật thông tin voucher trên TripNest</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="category-create__content">

                            <div className="category-create__section">
                                <div className="category-create__section-header">
                                    <h2>Thông Tin Voucher</h2>
                                    <p>Thông tin cơ bản của voucher</p>
                                </div>

                                <div className="category-create__form">
                                    <div className="category-create__form-group">
                                        <label>
                                            Mã Voucher <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="code"
                                            value={data.code}
                                            onChange={handleChange}
                                            placeholder="Ví dụ: TRIPNEST20"
                                        />

                                        <small>
                                            Mã voucher được sử dụng khi đặt phòng
                                        </small>
                                    </div>

                                    <div className="category-create__form-group">
                                        <label>
                                            Tên Voucher <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            onChange={handleChange}
                                            placeholder="Ví dụ: Giảm 20% kỳ nghỉ"
                                        />
                                    </div>

                                    <div className="category-create__form-group">
                                        <label>Mô tả</label>

                                        <textarea
                                            name="description"
                                            value={data.description}
                                            onChange={handleChange}
                                            placeholder="Nhập mô tả cho voucher..."
                                            rows="4"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="category-create__section">
                                <div className="category-create__section-header">
                                    <h2>Thông Tin Giảm Giá</h2>
                                    <p>Cấu hình giá trị và điều kiện giảm giá</p>
                                </div>

                                <div className="category-create__form category-create__form--grid">

                                    <div className="category-create__form-group">
                                        <label>
                                            Loại giảm giá <span>*</span>
                                        </label>

                                        <select
                                            name="discount_type"
                                            value={data.discount_type}
                                            onChange={handleChange}
                                        >
                                            <option value="percent">
                                                Giảm theo phần trăm
                                            </option>

                                            <option value="fixed">
                                                Giảm số tiền cố định
                                            </option>
                                        </select>
                                    </div>

                                    <div className="category-create__form-group">
                                        <label>
                                            Giá trị giảm <span>*</span>
                                        </label>

                                        <div className="category-create__input-unit">
                                            <input
                                                type="number"
                                                name="discount_value"
                                                value={data.discount_value}
                                                onChange={handleChange}
                                                placeholder="Nhập giá trị"
                                                min="0"
                                            />

                                            <span>
                                                {data.discount_type === "percent"
                                                    ? "%"
                                                    : "VNĐ"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="category-create__form-group">
                                        <label>Giảm tối đa</label>

                                        <div className="category-create__input-unit">
                                            <input
                                                type="number"
                                                name="max_discount"
                                                value={data.max_discount}
                                                onChange={handleChange}
                                                placeholder="Không giới hạn"
                                                min="0"
                                            />

                                            <span>VNĐ</span>
                                        </div>

                                        <small>
                                            Áp dụng khi voucher giảm theo phần trăm
                                        </small>
                                    </div>

                                    <div className="category-create__form-group">
                                        <label>Giá trị đơn hàng tối thiểu</label>

                                        <div className="category-create__input-unit">
                                            <input
                                                type="number"
                                                name="min_order_value"
                                                value={data.min_order_value}
                                                onChange={handleChange}
                                                placeholder="0"
                                                min="0"
                                            />

                                            <span>VNĐ</span>
                                        </div>
                                    </div>

                                    <div className="category-create__form-group">
                                        <label>
                                            Số lượng voucher <span>*</span>
                                        </label>

                                        <input
                                            type="number"
                                            name="quantity"
                                            value={data.quantity}
                                            onChange={handleChange}
                                            placeholder="Nhập số lượng"
                                            min="1"
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="category-create__section">
                                <div className="category-create__section-header">
                                    <h2>Phạm Vi Áp Dụng</h2>
                                    <p>Xác định những thành viên được sử dụng voucher</p>
                                </div>

                                <div className="category-create__form">

                                    <div className="category-create__form-group">
                                        <label>
                                            Đối tượng áp dụng <span>*</span>
                                        </label>

                                        <div className="category-create__radio-group">

                                            <label className="category-create__radio">
                                                <input
                                                    type="radio"
                                                    name="apply_scope"
                                                    value="all"
                                                    checked={data.apply_scope === "all"}
                                                    onChange={handleChange}
                                                />

                                                <div>
                                                    <strong>Tất cả thành viên</strong>

                                                    <span>
                                                        Voucher có thể được sử dụng bởi tất
                                                        cả thành viên
                                                    </span>
                                                </div>
                                            </label>

                                            <label className="category-create__radio">
                                                <input
                                                    type="radio"
                                                    name="apply_scope"
                                                    value="specific_users"
                                                    checked={
                                                        data.apply_scope === "specific_users"
                                                    }
                                                    onChange={handleChange}
                                                />

                                                <div>
                                                    <strong>Thành viên được chọn</strong>

                                                    <span>
                                                        Chỉ những thành viên được chỉ định
                                                        mới có thể sử dụng voucher
                                                    </span>
                                                </div>
                                            </label>

                                        </div>
                                    </div>

                                    {data.apply_scope === "specific_users" && (
                                        <div className="voucher-add-user">

                                            <div className="tool-search">
                                                <FaSearch />

                                                <input
                                                    className="col-10"
                                                    name="search-user"
                                                    value={search}
                                                    placeholder="Nhập email, username"
                                                    onChange={handleSearch}
                                                />
                                            </div>

                                            <div className="voucher-user-selection">

                                                <div className="voucher-user-list">

                                                    <div className="voucher-user-list__header">
                                                        <span>
                                                            Danh sách thành viên
                                                        </span>

                                                        <span>
                                                            {users.length} thành viên
                                                        </span>
                                                    </div>

                                                    <div className="voucher-user-list__content">

                                                        {users.map((item) => (
                                                            <div
                                                                className="voucher-user-item"
                                                                key={item._id}
                                                            >

                                                                <div className="voucher-user-item__info">

                                                                    <div className="vien-img">
                                                                        <img
                                                                            src={item.avatar}
                                                                            alt={item.username}
                                                                        />
                                                                    </div>

                                                                    <div className="voucher-user-item__text">

                                                                        <span className="font-bold">
                                                                            {item.username}
                                                                        </span>

                                                                        <small>
                                                                            {item.email}
                                                                        </small>

                                                                    </div>

                                                                </div>

                                                                <input
                                                                    type="checkbox"
                                                                    name="user_ids"
                                                                    value={item._id}
                                                                    checked={data.user_ids.includes(
                                                                        item._id
                                                                    )}
                                                                    onChange={handleUserChange}
                                                                />

                                                            </div>
                                                        ))}

                                                    </div>

                                                </div>

                                                <div className="voucher-selected-user">

                                                    <div className="voucher-selected-user__header">

                                                        <span>
                                                            Thành viên đã chọn
                                                        </span>

                                                        <span>
                                                            {data.user_ids.length}
                                                        </span>

                                                    </div>

                                                    <div className="voucher-selected-user__content">

                                                        {data.user_ids.length > 0 ? (

                                                            data.user_ids.map((userId) => {

                                                                const user = users.find(
                                                                    item => item._id === userId
                                                                );

                                                                if (!user) {
                                                                    return null;
                                                                }

                                                                return (
                                                                    <div
                                                                        className="voucher-selected-user__item"
                                                                        key={user._id}
                                                                    >

                                                                        <div className="voucher-user-item__info">

                                                                            <div className="vien-img">
                                                                                <img
                                                                                    src={user.avatar}
                                                                                    alt={user.username}
                                                                                />
                                                                            </div>

                                                                            <div className="voucher-user-item__text">

                                                                                <span className="font-bold">
                                                                                    {user.username}
                                                                                </span>

                                                                                <small>
                                                                                    {user.email}
                                                                                </small>

                                                                            </div>

                                                                        </div>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setData(prev => ({
                                                                                    ...prev,
                                                                                    user_ids: prev.user_ids.filter(
                                                                                        id => id !== user._id
                                                                                    )
                                                                                }));

                                                                                const input =
                                                                                    document.querySelector(
                                                                                        `input[name='user_ids'][value='${user._id}']`
                                                                                    );

                                                                                if (input) {
                                                                                    input.checked = false;
                                                                                }
                                                                            }}
                                                                        >
                                                                            ×
                                                                        </button>

                                                                    </div>
                                                                );
                                                            })

                                                        ) : (

                                                            <div className="voucher-selected-user__empty">
                                                                <span>
                                                                    Chưa có thành viên nào được chọn
                                                                </span>
                                                            </div>

                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                            <div className="d-flex justify-center">
                                                <Pagination
                                                    currentPage={currentPage}
                                                    totalPage={totalPage}
                                                    onPageChange={onPageChange}
                                                />
                                            </div>

                                        </div>
                                    )}

                                </div>
                            </div>

                            <div className="category-create__section">

                                <div className="category-create__section-header">
                                    <h2>Thời Gian Áp Dụng</h2>
                                    <p>Thiết lập thời gian voucher có hiệu lực</p>
                                </div>

                                <div className="category-create__form category-create__form--grid">

                                    <div className="category-create__form-group">
                                        <label>
                                            Ngày bắt đầu <span>*</span>
                                        </label>

                                        <input
                                            type="datetime-local"
                                            name="start_date"
                                            value={data.start_date}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="category-create__form-group">
                                        <label>
                                            Ngày kết thúc <span>*</span>
                                        </label>

                                        <input
                                            type="datetime-local"
                                            name="end_date"
                                            value={data.end_date}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="category-create__form-group">
                                        <label>Trạng thái</label>

                                        <select
                                            name="status"
                                            value={data.status}
                                            onChange={handleChange}
                                        >
                                            <option value="active">
                                                Hoạt động
                                            </option>

                                            <option value="inactive">
                                                Bị khóa
                                            </option>
                                        </select>
                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="category-create__footer">

                            <button
                                type="button"
                                className="category-create__btn category-create__btn--cancel"
                                onClick={() => navigate(-1)}
                            >
                                Hủy
                            </button>

                            <button
                                type="submit"
                                className="category-create__btn category-create__btn--submit"
                            >
                                Cập nhật Voucher
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </>
    );
}
