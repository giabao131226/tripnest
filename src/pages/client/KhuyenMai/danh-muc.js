
import { useEffect, useState, useCallback } from "react";
import SwalAlert from "../../../Component/SwalAlert/swal-alert";
import "../../../assets/css/client/khuyenmai/khuyenmai.css";
import { FaChevronRight, FaTag } from "react-icons/fa";
import Pagination from "../../../Component/Pagination/pagination";
import { Link } from "react-router-dom";

export default function VoucherCategory() {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    const onPageChange = useCallback((page) => {
        setCurrentPage(page);
    }, [currentPage]);

    useEffect(() => {
        fetch(`${apiUrl}categories/all?page=${currentPage}`, {
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
                if (data.success) {
                    setCategories(data.categories);
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
    }, [currentPage]);

    return (
        <main className="promotion-container">
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

                                    <p>
                                        {category.description}
                                    </p>

                                    <Link to = {`/khuyen-mai/${category.slug}`} >
                                        <button type="button">
                                            Xem khuyến mãi
                                            <FaChevronRight />
                                        </button></Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="promotion-empty">
                        <FaTag />
                        <h3>Chưa có danh mục</h3>
                        <p>
                            Hiện tại chưa có danh mục khuyến mãi nào.
                        </p>
                    </div>
                )}
            </section>

            {totalPage > 1 && (
                <div className="promotion-pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        <FaChevronRight />
                    </button>

                    {Array.from({ length: totalPage }, (_, index) => (
                        <button
                            key={index + 1}
                            className={currentPage === index + 1 ? "active" : ""}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPage}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            )}
            <Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={onPageChange} />
        </main>
    );
}