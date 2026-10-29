
import { useEffect, useState, useCallback } from "react";
import { Avatar, Tag, Image, Modal, Empty, Tooltip } from "antd";
import {
    FaUserCheck,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaEye,
    FaBuilding,
    FaEnvelope,
    FaPhone,
    FaIdCard,
    FaUniversity,
    FaCalendarAlt,
    FaFileAlt,
    FaCheck,
    FaTimes
} from "react-icons/fa";
import Swal from "sweetalert2";
import "../../../assets/css/admin/users/upgrade-request-management.css";
import SwalAlert from "../../../Component/SwalAlert/swal-alert";
import Pagination from "../../../Component/Pagination/pagination";

const statusConfig = {
    pending: { label: "Chờ duyệt", color: "orange" },
    approved: { label: "Đã duyệt", color: "green" },
    rejected: { label: "Đã từ chối", color: "red" }
};

export default function UpgradeRequestManagement() {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [upgradeRequests, setUpgradeRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [overview, setOverview] = useState({});
    const [status, setStatus] = useState("all");
    const [search, setSearch] = useState("");
    const [reload, setReload] = useState(false);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    const formatDate = date => new Date(date).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const handleReview = async (request, newStatus) => {
        const isApproved = newStatus === "approved";

        const result = await Swal.fire({
            title: isApproved ? "Phê duyệt yêu cầu?" : "Từ chối yêu cầu?",
            text: isApproved
                ? `Xác nhận nâng cấp tài khoản của ${request.account_id?.username} thành Chủ cơ sở?`
                : `Bạn có chắc muốn từ chối yêu cầu của ${request.account_id?.username}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: isApproved ? "Phê duyệt" : "Từ chối",
            cancelButtonText: "Hủy",
            confirmButtonColor: isApproved ? "#16a34a" : "#dc2626"
        });

        if (!result.isConfirmed) return;

        // TODO: Thay bằng API xét duyệt khi đã có endpoint.
        setUpgradeRequests(prev => prev.map(item =>
            item._id === request._id
                ? { ...item, status: newStatus }
                : item
        ));

        setSelectedRequest(prev =>
            prev?._id === request._id
                ? { ...prev, status: newStatus }
                : prev
        );

        await Swal.fire({
            title: "Thành công",
            text: isApproved
                ? "Đã phê duyệt yêu cầu nâng cấp."
                : "Đã từ chối yêu cầu nâng cấp.",
            icon: "success",
            confirmButtonColor: "#6758FF"
        });
    };

    const openDetail = request => {
        setSelectedRequest(request);
        setDetailOpen(true);
    };

    const onPageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    useEffect(() => {
        fetch(`${apiUrl}admin/request-upgrade?page=${currentPage}&status=${status}&search=${encodeURIComponent(search)}`, {
            credentials: "include"
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error(data.message || "Không thể tải danh sách yêu cầu.");
                }
                return data;
            })
            .then(data => {
                setUpgradeRequests(data.upgradeRequests || []);
                setCurrentPage(data.currentPage);
                setTotalPage(data.totalPage);
                setOverview(data.overview || {});
            })
            .catch(ex => {
                SwalAlert({
                    status: "error",
                    message: ex.message || "Có lỗi xảy ra.",
                    time: 2000
                });
            });
    }, [apiUrl, currentPage, status, search, reload]);

    return (
        <main className="user-management">
            <div className="user-header">
                <div>
                    <h1>Kiểm duyệt yêu cầu nâng cấp tài khoản</h1>
                    <p>
                        Kiểm tra hồ sơ và xét duyệt tài khoản trở thành Chủ cơ sở.
                    </p>
                </div>

                <div className="urm-header-icon">
                    <FaUserCheck />
                </div>
            </div>

            <div className="user-statistics">
                <div className="user-stat-card">
                    <div className="stat-icon blue">
                        <FaFileAlt />
                    </div>
                    <div>
                        <span>Tổng yêu cầu</span>
                        <strong>{overview.totalUR ?? 0}</strong>
                    </div>
                </div>

                <div className="user-stat-card">
                    <div className="stat-icon orange">
                        <FaClock />
                    </div>
                    <div>
                        <span>Chờ duyệt</span>
                        <strong>{overview.totalPending ?? 0}</strong>
                    </div>
                </div>

                <div className="user-stat-card">
                    <div className="stat-icon green">
                        <FaCheckCircle />
                    </div>
                    <div>
                        <span>Đã duyệt</span>
                        <strong>{overview.totalApproved ?? 0}</strong>
                    </div>
                </div>

                <div className="user-stat-card">
                    <div className="stat-icon red">
                        <FaTimesCircle />
                    </div>
                    <div>
                        <span>Đã từ chối</span>
                        <strong>{overview.totalReject ?? 0}</strong>
                    </div>
                </div>
            </div>

            <div className="user-table-container">
                <div className="urm-panel-heading">
                    <div>
                        <h2>Danh sách yêu cầu</h2>
                        <p>Quản lý và xử lý hồ sơ đăng ký đối tác.</p>
                    </div>

                    <span className="urm-count">
                        {upgradeRequests.length} yêu cầu
                    </span>
                </div>

                <div className="user-filter">
                    <div className="user-search">
                        <span>⌕</span>
                        <input
                            type="text"
                            name="search"
                            placeholder="Tìm theo tên, email, số điện thoại..."
                            value={search}
                            onChange={e => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    <select
                        name="status"
                        value={status}
                        onChange={e => {
                            setStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Đã từ chối</option>
                    </select>
                </div>

                {upgradeRequests.length === 0 ? (
                    <div className="urm-empty">
                        <Empty description="Hiện chưa có yêu cầu nâng cấp tài khoản nào" />
                    </div>
                ) : (
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Người đăng ký</th>
                                <th>Ngày gửi</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {upgradeRequests.map((request, index) => (
                                <tr key={request._id}>
                                    <td>
                                        {(currentPage - 1) * 10 + index + 1}
                                    </td>

                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                <Avatar
                                                    src={request.account_id?.avatar || undefined}
                                                    size={44}
                                                >
                                                    {request.account_id?.username?.charAt(0) || "U"}
                                                </Avatar>
                                            </div>

                                            <div>
                                                <strong>
                                                    {request.account_id?.username || "Chưa cập nhật"}
                                                </strong>
                                                <small>
                                                    {request.account_id?.email || "Chưa có email"}
                                                </small>
                                                <small>
                                                    {request.account_id?.phone || "Chưa có số điện thoại"}
                                                </small>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="urm-date">
                                            <FaCalendarAlt />
                                            <span>{formatDate(request.createdAt)}</span>
                                        </div>
                                    </td>

                                    <td>
                                        <Tag color={statusConfig[request.status]?.color || "default"}>
                                            {statusConfig[request.status]?.label || request.status}
                                        </Tag>
                                    </td>

                                    <td>
                                        <div className="user-actions">
                                            <Tooltip title="Xem hồ sơ">
                                                <button
                                                    title="Xem hồ sơ"
                                                    onClick={() => openDetail(request)}
                                                >
                                                    <FaEye />
                                                </button>
                                            </Tooltip>

                                            {request.status === "pending" && (
                                                <>
                                                    <Tooltip title="Phê duyệt">
                                                        <button
                                                            className="urm-approve-action"
                                                            title="Phê duyệt"
                                                            onClick={() => handleReview(request, "approved")}
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                    </Tooltip>

                                                    <Tooltip title="Từ chối">
                                                        <button
                                                            className="urm-reject-action"
                                                            title="Từ chối"
                                                            onClick={() => handleReview(request, "rejected")}
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="user-pagination">
                    <span>
                        Hiển thị{" "}
                        {upgradeRequests.length > 0
                            ? (currentPage - 1) * 10 + 1
                            : 0}
                        –
                        {(currentPage - 1) * 10 + upgradeRequests.length}
                        {" "}trong {overview.totalUR ?? 0} yêu cầu
                    </span>

                    <Pagination
                        currentPage={currentPage}
                        totalPage={totalPage}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>

            <Modal
                title="Chi tiết hồ sơ nâng cấp"
                open={detailOpen}
                onCancel={() => setDetailOpen(false)}
                footer={null}
                width={720}
                destroyOnClose
            >
                {selectedRequest && (
                    <div className="urm-detail">
                        <div className="urm-detail-user">
                            <Avatar
                                size={64}
                                src={selectedRequest.account_id?.avatar || undefined}
                            >
                                {selectedRequest.account_id?.username?.charAt(0) || "U"}
                            </Avatar>

                            <div>
                                <h3>
                                    {selectedRequest.account_id?.username || "Chưa cập nhật"}
                                </h3>

                                <Tag color={statusConfig[selectedRequest.status]?.color || "default"}>
                                    {statusConfig[selectedRequest.status]?.label || selectedRequest.status}
                                </Tag>

                                <p>Gửi lúc {formatDate(selectedRequest.createdAt)}</p>
                            </div>
                        </div>

                        <div className="urm-detail-grid">
                            <div className="urm-detail-item">
                                <FaEnvelope />
                                <div>
                                    <span>Email</span>
                                    <strong>
                                        {selectedRequest.account_id?.email || "Chưa cung cấp"}
                                    </strong>
                                </div>
                            </div>

                            <div className="urm-detail-item">
                                <FaPhone />
                                <div>
                                    <span>Số điện thoại</span>
                                    <strong>
                                        {selectedRequest.account_id?.phone || "Chưa cung cấp"}
                                    </strong>
                                </div>
                            </div>

                            <div className="urm-detail-item">
                                <FaIdCard />
                                <div>
                                    <span>Mã số thuế</span>
                                    <strong>
                                        {selectedRequest.tax_code || "Chưa cung cấp"}
                                    </strong>
                                </div>
                            </div>

                            <div className="urm-detail-item">
                                <FaUniversity />
                                <div>
                                    <span>Tài khoản ngân hàng</span>
                                    <strong>
                                        {selectedRequest.stk || "Chưa cung cấp"}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="urm-license">
                            <h4>
                                <FaBuilding /> Giấy phép kinh doanh
                            </h4>

                            {selectedRequest.business_lisence ? (
                                <Image
                                    src={selectedRequest.business_lisence}
                                    alt="Giấy phép kinh doanh"
                                    className="urm-license-image"
                                />
                            ) : (
                                <Empty description="Chưa có giấy phép kinh doanh" />
                            )}
                        </div>

                        {selectedRequest.status === "pending" && (
                            <div className="urm-detail-actions">
                                <button
                                    className="urm-reject-button"
                                    onClick={() => handleReview(selectedRequest, "rejected")}
                                >
                                    <FaTimes /> Từ chối
                                </button>

                                <button
                                    className="urm-approve-button"
                                    onClick={() => handleReview(selectedRequest, "approved")}
                                >
                                    <FaCheck /> Phê duyệt yêu cầu
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </main>
    );
}
