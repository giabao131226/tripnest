import "./pagination.css";

export default function Pagination({ currentPage, totalPage, onPageChange }) {
    return (
        <nav>
            <ul className="pagination">
                {currentPage > 1 && (
                    <li className="page-item">
                        <button
                            type="button"
                            className="page-link"
                            onClick={() => onPageChange(currentPage - 1)}
                        >
                            Trang trước
                        </button>
                    </li>
                )}

                {Array.from({ length: totalPage }, (_, index) => {
                    const page = index + 1;

                    return (
                        <li
                            key={page}
                            className={`page-item ${
                                currentPage === page ? "active" : ""
                            }`}
                        >
                            <button
                                type="button"
                                className="page-link"
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </button>
                        </li>
                    );
                })}

                {currentPage < totalPage && (
                    <li className="page-item">
                        <button
                            type="button"
                            className="page-link"
                            onClick={() => onPageChange(currentPage + 1)}
                        >
                            Kế tiếp
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}