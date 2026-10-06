import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FaChevronLeft,
    FaChevronRight,
    FaCopy,
    FaBookmark,
    FaCalendarAlt,
    FaTicketAlt,
    FaTag,
    FaClock,
    FaGift
} from "react-icons/fa";
import SwalAlert from "../../../Component/SwalAlert/swal-alert";

export default function VoucherByCategory() {
    const { slug } = useParams();

    const [category, setCategory] = useState(null);
    const [vouchers, setVouchers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const [copiedCode, setCopiedCode] = useState("");
    const [savedVouchers, setSavedVouchers] = useState([]);

    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        fetch(`${apiUrl}vouchers/category/${slug}?page=${currentPage}`, {
            credentials: "include"
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error(data.message);
                }
                return data;
            })
            .then(data => {
                if(data.success){
                    console.log(data);
                    setCategory(data.category);
                    setVouchers(data.vouchers);
                    setCurrentPage(data.currentPage);
                    setTotalPage(data.totalPage);
                }
            })
            .catch(ex => {
                SwalAlert({
                    status: "error",
                    time: 2000,
                    message: ex.message
                });
            });
    }, [slug, currentPage]);

    const formatMoney = (value) => {
        return new Intl.NumberFormat("vi-VN").format(value) + "đ";
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("vi-VN");
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);

        setTimeout(() => {
            setCopiedCode("");
        }, 2000);
    };

    const handleSaveVoucher = (id) => {
        setSavedVouchers(prev => [...prev, id]);
    };

    const handleCancelSaveVoucher = (id) => {
        setSavedVouchers(prev =>
            prev.filter(item => item !== id)
        );
    };

    return (
        <main className="promotion-container">

            <section className="promotion-section">

                <div className="promotion-section__header">
                    <div>
                        <h2>
                            <span>
                                {category?.icon ? (
                                    <i className={category.icon}></i>
                                ) : (
                                    "🎁"
                                )}
                            </span>

                            Khuyến mãi {category?.title}
                        </h2>

                        <p>
                            {category?.description ||
                                "Những ưu đãi hấp dẫn dành cho danh mục này"}
                        </p>
                    </div>

                    <Link to="/khuyen-mai/danh-muc">
                        <button
                            type="button"
                            className="promotion-view-all"
                        >
                            <FaChevronLeft />
                            Tất cả danh mục
                        </button>
                    </Link>
                </div>

                <div className="voucher-grid">

                    {vouchers.map((voucher) => {

                        const now = new Date();
                        const endDate = new Date(voucher.end_date);

                        const isExpiring =
                            voucher.status === "active" &&
                            endDate > now &&
                            endDate <= new Date(
                                now.getTime() +
                                7 * 24 * 60 * 60 * 1000
                            );

                        return (
                            <div
                                className={`voucher-card voucher-card--${
                                    isExpiring ? "red" : "blue"
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
                                                Theo danh mục{" "}
                                                {category?.title}
                                            </span>
                                        </div>

                                        <div className="voucher-actions">

                                            <button
                                                type="button"
                                                className={`voucher-save ${
                                                    savedVouchers.includes(
                                                        voucher._id
                                                    )
                                                        ? "saved"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    savedVouchers.includes(
                                                        voucher._id
                                                    )
                                                        ? handleCancelSaveVoucher(
                                                              voucher._id
                                                          )
                                                        : handleSaveVoucher(
                                                              voucher._id
                                                          )
                                                }
                                            >
                                                <FaBookmark />

                                                {savedVouchers.includes(
                                                    voucher._id
                                                )
                                                    ? "Đã lưu"
                                                    : "Lưu"}
                                            </button>

                                            <button
                                                type="button"
                                                className="voucher-copy"
                                                onClick={() =>
                                                    handleCopy(
                                                        voucher.code
                                                    )
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
                        );
                    })}

                </div>

                {vouchers.length === 0 && (
                    <div className="promotion-empty">
                        <FaTag />

                        <h3>
                            Chưa có khuyến mãi
                        </h3>

                        <p>
                            Hiện tại chưa có voucher nào dành cho danh mục này.
                        </p>
                    </div>
                )}

            </section>

            {totalPage > 1 && (
                <div className="promotion-pagination">

                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage(currentPage - 1)
                        }
                    >
                        <FaChevronLeft />
                    </button>

                    {Array.from(
                        { length: totalPage },
                        (_, index) => index + 1
                    ).map(page => (
                        <button
                            key={page}
                            className={
                                currentPage === page
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setCurrentPage(page)
                            }
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPage}
                        onClick={() =>
                            setCurrentPage(currentPage + 1)
                        }
                    >
                        <FaChevronRight />
                    </button>

                </div>
            )}

        </main>
    );
}