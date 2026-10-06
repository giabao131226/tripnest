
import { useEffect, useState, useCallback } from "react"
import { FaCopy, FaCalendarAlt, FaTicketAlt, FaTag, FaClock, FaGift } from "react-icons/fa"
import SwalAlert from "../../../Component/SwalAlert/swal-alert"
import Pagination from "../../../Component/Pagination/pagination"
import "../../../assets/css/client/khuyenmai/khuyenmai.css";

export default function MyVouchers() {
    const [myVouchers, setMyVouchers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [copiedCode, setCopiedCode] = useState("")
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        fetch(`${apiUrl}vouchers/my-voucher?page=${currentPage}`, {
            method: "GET",
            credentials: "include"
        }).then(async res => {
            const data = await res.json();
            if (!data.success || !res.ok) throw new Error(data.message);
            return data;
        }).then(data => {
            if (data.success) {
                setMyVouchers(data.vouchers);
                setCurrentPage(data.currentPage);
                setTotalPage(data.totalPage);
            }
        }).catch(ex => {
            SwalAlert({
                "status": "error",
                "time": 2000,
                "message": ex
            })
        })
    }, [currentPage])

    const onPageChange = useCallback((page) => {
        setCurrentPage(page);
    }, [currentPage]);

    const formatMoney = (value) => {
        if (!value) return "0đ"
        return new Intl.NumberFormat("vi-VN").format(value) + "đ"
    }

    const formatDate = (date) => {
        if (!date) return ""
        return new Date(date).toLocaleDateString("vi-VN")
    }

    const handleCopy = async (code) => {
        try {
            await navigator.clipboard.writeText(code)
            setCopiedCode(code)

            setTimeout(() => {
                setCopiedCode("")
            }, 2000)
        } catch (error) {
            console.log(error)
        }
    }

    const getVoucherStatus = (voucher) => {
        const now = new Date()
        const startDate = new Date(voucher.start_date)
        const endDate = new Date(voucher.end_date)

        if (endDate <= now) {
            return "expired"
        }

        if (startDate > now) {
            return "upcoming"
        }

        if (
            endDate <=
            new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        ) {
            return "expiring"
        }

        return "active"
    }

    return (

        <main className="promotion-container">
            <section className="promotion-section promotion-expiring">
                <div className="promotion-section__header">
                    <div>
                        <h2>
                            <span>🎟️</span>
                            Voucher của tôi
                        </h2>
                        <p>
                            Những voucher bạn đã lưu và có thể sử dụng.
                        </p>
                    </div>
                </div>

                {myVouchers.length > 0 ? (
                    <div className="voucher-grid">
                        {myVouchers.map((voucher) => {
                            const status = getVoucherStatus(voucher)

                            return (
                                <div
                                    className={`voucher-card voucher-card--${status === "expiring"
                                            ? "red"
                                            : status === "expired"
                                                ? "gray"
                                                : "blue"
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
                                            {status === "expired"
                                                ? "Đã hết hạn"
                                                : status === "upcoming"
                                                    ? "Sắp diễn ra"
                                                    : status === "expiring"
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
                                                    className="voucher-copy"
                                                    onClick={() =>
                                                        handleCopy(voucher.code)
                                                    }
                                                >
                                                    {copiedCode === voucher.code
                                                        ? "Đã sao chép"
                                                        : "Sao chép mã"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="promotion-empty">
                        <span>🎟️</span>
                        <h3>Chưa có voucher</h3>
                        <p>
                            Bạn chưa lưu voucher nào. Hãy khám phá các ưu đãi hấp dẫn
                            của TripNest.
                        </p>
                    </div>
                )}

                {totalPage > 1 && (
                    <div className="promotion-pagination">
                        <Pagination
                            currentPage={currentPage}
                            totalPage={totalPage}
                            onPageChange={onPageChange}
                        />
                    </div>
                )}
            </section>
        </main>
    )
}

