import {
    FaTag
} from "react-icons/fa";
import "../../../assets/css/client/khuyenmai/khuyenmai.css";
import { Outlet } from "react-router-dom";

export default function VoucherClient() {
    return (
        <>
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
                <Outlet />
            </div>
        </>
    )
}