import { useMemo, useState } from "react";
import {
    FaSearch,
    FaCopy,
    FaCalendarAlt,
    FaTag,
    FaClock,
    FaHotel,
    FaPlane,
    FaMapMarkerAlt,
    FaGift,
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";
import "../../../assets/css/client/khuyenmai/khuyenmai.css";

const vouchers = [
    {
        id: 1,
        code: "TRIP20",
        name: "Ưu đãi mùa thu",
        type: "percent",
        value: 20,
        description: "Giảm 20% cho đơn đặt phòng tại tất cả cơ sở lưu trú.",
        minOrder: 500000,
        maxDiscount: 200000,
        startDate: "01/09/2026",
        endDate: "30/09/2026",
        status: "active",
        scope: "Tất cả cơ sở lưu trú",
        color: "blue"
    },
    {
        id: 2,
        code: "TRIP100",
        name: "Du lịch cuối tuần",
        type: "fixed",
        value: 100000,
        description: "Giảm 100.000đ cho đơn đặt phòng từ 1.000.000đ.",
        minOrder: 1000000,
        maxDiscount: null,
        startDate: "01/09/2026",
        endDate: "05/10/2026",
        status: "active",
        scope: "Tất cả cơ sở lưu trú",
        color: "orange"
    },
    {
        id: 3,
        code: "SUMMER15",
        name: "Mùa hè rực rỡ",
        type: "percent",
        value: 15,
        description: "Giảm 15% cho các đặt phòng tại Resort và Villa.",
        minOrder: 700000,
        maxDiscount: 300000,
        startDate: "01/09/2026",
        endDate: "15/10/2026",
        status: "active",
        scope: "Resort, Villa",
        color: "green"
    },
    {
        id: 4,
        code: "HOLIDAY25",
        name: "Kỳ nghỉ lễ",
        type: "percent",
        value: 25,
        description: "Giảm 25% cho đơn đặt phòng từ 3 đêm trở lên.",
        minOrder: 1500000,
        maxDiscount: 500000,
        startDate: "20/09/2026",
        endDate: "30/09/2026",
        status: "expiring",
        scope: "Tất cả cơ sở lưu trú",
        color: "purple"
    }
];

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

const categories = [
    {
        icon: <FaHotel />,
        title: "Đặt phòng",
        description: "Giảm giá khi đặt phòng khách sạn, resort, homestay, villa.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=700&q=80"
    },
    {
        icon: <FaPlane />,
        title: "Trải nghiệm",
        description: "Ưu đãi cho các tour du lịch, vé tham quan, hoạt động thú vị.",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=80"
    },
    {
        icon: <FaHotel />,
        title: "Resort & Villa",
        description: "Giảm giá đặc biệt cho các khu nghỉ dưỡng cao cấp.",
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=700&q=80"
    },
    {
        icon: <FaMapMarkerAlt />,
        title: "Điểm đến hot",
        description: "Khuyến mãi dành riêng cho các điểm đến nổi tiếng.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80"
    }
];

export default function KhuyenMai() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [copiedCode, setCopiedCode] = useState("");

    const filteredVouchers = useMemo(() => {
        return vouchers.filter((voucher) => {
            const keyword = search.toLowerCase();

            const matchSearch =
                voucher.code.toLowerCase().includes(keyword) ||
                voucher.name.toLowerCase().includes(keyword);

            const matchFilter =
                filter === "all" ||
                (filter === "active" && voucher.status === "active") ||
                (filter === "expiring" && voucher.status === "expiring");

            return matchSearch && matchFilter;
        });
    }, [search, filter]);

    const handleCopy = async (code) => {
        await navigator.clipboard.writeText(code);
        setCopiedCode(code);

        setTimeout(() => {
            setCopiedCode("");
        }, 2000);
    };

    const formatMoney = (value) => {
        if (!value) return "";
        return value.toLocaleString("vi-VN") + "đ";
    };

    return (
        <div className="promotion-page">
            <section className="promotion-hero">
                <div className="promotion-hero__overlay">
                    <div className="promotion-container">
                        <div className="promotion-hero__content">
                            <div className="promotion-hero__label">
                                <FaTag />
                                <span>Khuyến mãi</span>
                            </div>

                            <h1>
                                Ưu đãi hấp dẫn,
                                <br />
                                du lịch tiết kiệm
                            </h1>

                            <p>
                                Khám phá các mã giảm giá và chương trình khuyến mãi
                                đặc biệt để tận hưởng chuyến đi tuyệt vời hơn cùng TripNest!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <main className="promotion-container">
                <section className="promotion-filter">
                    <div className="promotion-search">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Tìm kiếm mã khuyến mãi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="promotion-tabs">
                        <button
                            className={filter === "all" ? "active" : ""}
                            onClick={() => setFilter("all")}
                        >
                            Tất cả
                        </button>

                        <button
                            className={filter === "active" ? "active" : ""}
                            onClick={() => setFilter("active")}
                        >
                            Đang diễn ra
                        </button>

                        <button
                            className={filter === "expiring" ? "active" : ""}
                            onClick={() => setFilter("expiring")}
                        >
                            Sắp hết hạn
                        </button>
                    </div>
                </section>

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

                        <button className="promotion-view-all">
                            Xem tất cả
                            <FaChevronRight />
                        </button>
                    </div>

                    <div className="voucher-grid">
                        {filteredVouchers.map((voucher) => (
                            <div
                                className={`voucher-card voucher-card--${voucher.color}`}
                                key={voucher.id}
                            >
                                <div className="voucher-card__top">
                                    <div className="voucher-card__discount">
                                        <span>GIẢM</span>

                                        <strong>
                                            {voucher.type === "percent"
                                                ? `${voucher.value}%`
                                                : `${voucher.value / 1000}K`}
                                        </strong>
                                    </div>

                                    <div className="voucher-card__code">
                                        <span>{voucher.code}</span>

                                        <button
                                            onClick={() => handleCopy(voucher.code)}
                                            title="Sao chép mã"
                                        >
                                            <FaCopy />
                                        </button>
                                    </div>
                                </div>

                                <div className="voucher-card__content">
                                    <div className="voucher-status">
                                        {voucher.status === "expiring"
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
                                                    {formatMoney(voucher.minOrder)}
                                                </strong>
                                            </span>
                                        </div>

                                        {voucher.maxDiscount && (
                                            <div>
                                                <FaTag />
                                                <span>
                                                    Giảm tối đa:{" "}
                                                    <strong>
                                                        {formatMoney(
                                                            voucher.maxDiscount
                                                        )}
                                                    </strong>
                                                </span>
                                            </div>
                                        )}

                                        <div>
                                            <FaClock />
                                            <span>
                                                HSD:{" "}
                                                <strong>{voucher.endDate}</strong>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="voucher-card__bottom">
                                        <div className="voucher-scope">
                                            <FaGift />
                                            <span>{voucher.scope}</span>
                                        </div>

                                        <button
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
                        ))}
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
                    </div>

                    <div className="promotion-category-grid">
                        {categories.map((category, index) => (
                            <div className="promotion-category" key={index}>
                                <div className="promotion-category__image">
                                    <img
                                        src={category.image}
                                        alt={category.title}
                                    />
                                </div>

                                <div className="promotion-category__content">
                                    <div className="promotion-category__icon">
                                        {category.icon}
                                    </div>

                                    <div>
                                        <h3>{category.title}</h3>
                                        <p>{category.description}</p>

                                        <button>
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
        </div>
    );
}