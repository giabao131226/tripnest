import { useEffect, useMemo, useState } from "react";
import {
    FaSearch,
    FaCopy,
    FaCalendarAlt,
    FaTag,
    FaClock,
    FaGift,
    FaChevronLeft,
    FaChevronRight,
    FaTicketAlt,
    FaBookmark
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../../assets/css/client/khuyenmai/khuyenmai.css";
import SwalAlert from "../../../Component/SwalAlert/swal-alert";
import socket from "../../../socket/socket";
import { useSelector } from "react-redux";

const expiringVouchers = [
    {
        code: "FALL30",
        value: "30%",
        endDate: "28/09/2026",
        color: "red"
    },
    {
        code: "WEEKEND50",
        value: "50K",
        endDate: "27/09/2026",
        color: "blue"
    },
    {
        code: "BIDAY10",
        value: "10%",
        endDate: "26/09/2026",
        color: "purple"
    }
];

export default function KhuyenMai() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [copiedCode, setCopiedCode] = useState("");
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const [vouchers, setVouchers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [savedVouchers, setSavedVouchers] = useState([]);
    const user = useSelector(state => state.auth).payload;

    const filteredVouchers = useMemo(() => {
        const now = new Date();
        const sevenDaysLater = new Date();

        sevenDaysLater.setDate(now.getDate() + 7);

        return vouchers.filter((voucher) => {
            const keyword = search.toLowerCase();

            const matchSearch =
                voucher.code?.toLowerCase().includes(keyword) ||
                voucher.name?.toLowerCase().includes(keyword);

            const endDate = new Date(voucher.end_date);

            const isActive =
                voucher.status === "active" &&
                new Date(voucher.start_date) <= now &&
                endDate > now;

            const isExpiring =
                isActive &&
                endDate <= sevenDaysLater;

            const matchFilter =
                filter === "all" ||
                (filter === "active" && isActive) ||
                (filter === "expiring" && isExpiring);

            return matchSearch && matchFilter;
        });
    }, [vouchers, search, filter]);

    const [statusSaveButton, setStatusSaveButton] = useState(false);

    const handleSaveVoucher = (voucherId) => {
        setStatusSaveButton(true);
        setSavedVouchers([...savedVouchers, voucherId]);
        const data = {
            "userId": user._id,
            "voucherId": voucherId
        }
        socket.emit("CLIENT_SEND_REQUEST_SAVE_VOUCHER", data);
    };

    const handleCancelSaveVoucher = (voucherId) => {
        setStatusSaveButton(false);
        const newSavedVoucher = savedVouchers.filter((item) => item != voucherId);
        setSavedVouchers(newSavedVoucher);
        const data = {
            "userId": user._id,
            "voucherId": voucherId
        }
        socket.emit("CLIENT_SEND_REQUEST_CANCEL_SAVE_VOUCHER", data);
    }

    const handleCopy = async (code) => {
        await navigator.clipboard.writeText(code);
        setCopiedCode(code);

        setTimeout(() => {
            setCopiedCode("");
        }, 2000);
    };

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("vi-VN");
    };

    const formatMoney = (value) => {
        if (!value) return "";
        return value.toLocaleString("vi-VN") + "đ";
    };

    useEffect(() => {
        fetch(`${apiUrl}vouchers`, {
            credentials: "include"
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok || !data.success) throw new Error(data.message);
                return data;
            }).then(data => {
                if (data.success) {
                    setVouchers(data.vouchers);
                    setCategories(data.categories);
                }
            }).catch(ex => {
                SwalAlert({
                    "status": "error",
                    "time": 2000,
                    "message": ex
                });
            })
    }, [apiUrl])

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });

        socket.on("SERVER_RESPOND_REQUEST_SAVE_VOUCHER", (data) => {
            const index = vouchers.findIndex((voucher) => voucher._id == data.voucherId);
            const userId = document.querySelector("[user_id]").getAttribute("user_id");
            if (index < 0) return;
            if (data.userId == userId) {
                SwalAlert({
                    "status": data.success ? "success" : "error",
                    "time": 2000,
                    "message": data.message
                });
            }
            if (data.success) {
                const newVouchers = [...vouchers];
                newVouchers[index].quantity = data.newQuantity;
                setVouchers(newVouchers);
            }
        })

        socket.on("SERVER_RESPOND_REQUEST_CANCEL_SAVE_VOUCHER", (data) => {
            const index = vouchers.findIndex((voucher) => voucher._id == data.voucherId);
            const userId = document.querySelector("[user_id]").getAttribute("user_id");
            if (index < 0) return;
            if (data.userId == userId) {
                SwalAlert({
                    "status": data.success ? "success" : "error",
                    "time": 2000,
                    "message": data.message
                });
            }
            if (data.success) {
                const newVouchers = [...vouchers];
                newVouchers[index].quantity = data.newQuantity;
                setVouchers(newVouchers);
            }
        })

        return () => {
            socket.off("connect");
        };
    }, [vouchers]);

    return (
        <>
            <span user_id={user?._id}></span>
            <main className="promotion-container">

                <section className="promotion-section">
                    <div className="promotion-section__header">
                        <div>
                            <h2>
                                <span>🔥</span>
                                Khuyến mãi nổi bật
                            </h2>

                            <p>
                                Những ưu đãi hấp dẫn dành cho chuyến đi của bạn
                            </p>
                        </div>

                        <Link to={"noi-bat"}>
                            <button className="promotion-view-all">
                                Xem tất cả
                                <FaChevronRight />
                            </button>
                        </Link>
                    </div>

                    <div className="voucher-grid">

                        {filteredVouchers.map((voucher) => {
                            const now = new Date();
                            const endDate = new Date(voucher.end_date);

                            const isExpiring =
                                voucher.status === "active" &&
                                endDate > now &&
                                endDate <=
                                new Date(
                                    now.getTime() +
                                    7 * 24 * 60 * 60 * 1000
                                );

                            return (
                                <div
                                    className={`voucher-card voucher-card--${isExpiring ? "red" : "blue"
                                        }`}
                                    key={voucher._id}
                                >
                                    <div className="voucher-card__top">
                                        <div className="voucher-card__discount">
                                            <span>GIẢM</span>

                                            <strong>
                                                {voucher.discount_type === "percent"
                                                    ? `${voucher.discount_value}%`
                                                    : `${voucher.discount_value / 1000}K`}
                                            </strong>
                                        </div>

                                        <div className="voucher-card__code">
                                            <span>{voucher.code}</span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleCopy(voucher.code)
                                                }
                                                title="Sao chép mã"
                                            >
                                                <FaCopy />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="voucher-card__content">
                                        <div className="voucher-status">
                                            {isExpiring
                                                ? "Sắp hết hạn"
                                                : "Đang diễn ra"}
                                        </div>

                                        <h3>{voucher.name}</h3>

                                        <p className="voucher-description">
                                            {voucher.description}
                                        </p>

                                        <div className="voucher-info">
                                            <div>
                                                <FaCalendarAlt />

                                                <span>
                                                    Đơn tối thiểu:{" "}
                                                    <strong>
                                                        {formatMoney(
                                                            voucher.min_order_value
                                                        )}
                                                    </strong>
                                                </span>
                                            </div>

                                            <div>
                                                <FaTicketAlt />

                                                <span>
                                                    Còn lại:{" "}
                                                    <strong>
                                                        {voucher.quantity} voucher
                                                    </strong>
                                                </span>
                                            </div>

                                            {voucher.max_discount !== null && (
                                                <div>
                                                    <FaTag />

                                                    <span>
                                                        Giảm tối đa:{" "}
                                                        <strong>
                                                            {formatMoney(
                                                                voucher.max_discount
                                                            )}
                                                        </strong>
                                                    </span>
                                                </div>
                                            )}

                                            <div>
                                                <FaClock />

                                                <span>
                                                    HSD:{" "}
                                                    <strong>
                                                        {formatDate(
                                                            voucher.end_date
                                                        )}
                                                    </strong>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="voucher-card__bottom">
                                            <div className="voucher-scope">
                                                <FaGift />

                                                <span>
                                                    {voucher.apply_scope === "all"
                                                        ? "Tất cả thành viên"
                                                        : "Thành viên được chọn"}
                                                </span>
                                            </div>

                                            <div className="voucher-actions">
                                                <button
                                                    type="button"
                                                    className={`voucher-save ${savedVouchers.includes(voucher._id)
                                                        ? "saved"
                                                        : ""
                                                        }`}
                                                    onClick={() => statusSaveButton === false ? handleSaveVoucher(voucher._id) : handleCancelSaveVoucher(voucher._id)}
                                                >
                                                    <FaBookmark />

                                                    {savedVouchers.includes(voucher._id)
                                                        ? "Đã lưu"
                                                        : "Lưu"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="voucher-copy"
                                                    onClick={() => handleCopy(voucher.code)}
                                                >
                                                    {copiedCode === voucher.code
                                                        ? "Đã sao chép"
                                                        : "Sao chép mã"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredVouchers.length === 0 && (
                        <div className="promotion-empty">
                            <FaTag />
                            <h3>Không tìm thấy khuyến mãi</h3>
                            <p>
                                Hãy thử tìm kiếm với mã hoặc tên khuyến mãi khác.
                            </p>
                        </div>
                    )}
                </section>

                <section className="promotion-section">
                    <div className="promotion-section__header">
                        <div>
                            <h2>
                                <span>🎁</span>
                                Ưu đãi theo danh mục
                            </h2>

                            <p>
                                Khám phá các khuyến mãi phù hợp với nhu cầu của bạn
                            </p>
                        </div>

                        <Link to={"danh-muc"}>
                            <button
                                type="button"
                                className="promotion-view-all"
                            >
                                Xem tất cả
                                <FaChevronRight />
                            </button>
                        </Link>
                    </div>

                    <div className="promotion-category-grid">
                        {categories.map((category) => (
                            <div
                                className="promotion-category"
                                key={category._id}
                            >
                                <div className="promotion-category__content">
                                    <div className="promotion-category__icon">
                                        <i className={category.icon}></i>
                                    </div>

                                    <div>
                                        <h3>{category.title}</h3>

                                        <p>{category.description}</p>

                                        <button type="button">
                                            Xem khuyến mãi
                                            <FaChevronRight />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="promotion-section promotion-expiring">
                    <div className="promotion-section__header">
                        <div>
                            <h2>
                                <span>⏰</span>
                                Sắp hết hạn
                            </h2>

                            <p>
                                Nhanh tay sử dụng trước khi ưu đãi kết thúc!
                            </p>
                        </div>

                        <button className="promotion-view-all">
                            Xem tất cả
                            <FaChevronRight />
                        </button>
                    </div>

                    <div className="expiring-list">
                        {expiringVouchers.map((voucher) => (
                            <div
                                className={`expiring-card expiring-card--${voucher.color}`}
                                key={voucher.code}
                            >
                                <div className="expiring-card__discount">
                                    <span>GIẢM</span>
                                    <strong>{voucher.value}</strong>
                                </div>

                                <div className="expiring-card__info">
                                    <strong>{voucher.code}</strong>
                                    <span>HSD: {voucher.endDate}</span>
                                </div>

                                <button
                                    onClick={() => handleCopy(voucher.code)}
                                >
                                    {copiedCode === voucher.code ? (
                                        "Đã sao chép"
                                    ) : (
                                        <FaCopy />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="promotion-pagination">
                    <button>
                        <FaChevronLeft />
                    </button>

                    <button className="active">1</button>
                    <button>2</button>
                    <button>3</button>

                    <button>
                        <FaChevronRight />
                    </button>
                </div>
            </main>
        </>
    );
}