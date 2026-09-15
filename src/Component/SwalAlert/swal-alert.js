import Swal from 'sweetalert2';

export default function SwalAlert({ status, time, message }) {
    if (status == "success") {
        return Swal.fire({
            icon: "success",
            title: "🎉 Thành công!",
            text: message,
            showConfirmButton: false,
            timer: time,
            timerProgressBar: true,
            background: "#ffffff",
            color: "#333",
            iconColor: "#22c55e",
            toast: true,
            position: "top-end"
        });
    } else {
        return Swal.fire({
            icon: "error",
            title: "❌ Có lỗi xảy ra!",
            text: message,
            showConfirmButton: false,
            timer: time,
            timerProgressBar: true,
            background: "#ffffff",
            color: "#333",
            iconColor: "#ef4444",
            toast: true,
            position: "top-end"
        });
    }
}