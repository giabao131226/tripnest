
export const validateVoucher = (data) => {
    const code = data.code.trim();
    const name = data.name.trim();
    const description = data.description.trim();
    const discountValue = Number(data.discount_value);
    const maxDiscount = data.max_discount === "" ? null : Number(data.max_discount);
    const minOrderValue = Number(data.min_order_value);
    const quantity = Number(data.quantity);

    if (!code) {
        return "Vui lòng nhập mã voucher";
    }

    if (!/^[A-Za-z0-9]+$/.test(code)) {
        return "Mã voucher chỉ được chứa chữ và số";
    }

    if (!name) {
        return "Vui lòng nhập tên voucher";
    }

    if (!data.discount_type) {
        return "Vui lòng chọn loại giảm giá";
    }

    if (!data.discount_value || Number.isNaN(discountValue) || discountValue <= 0) {
        return "Giá trị giảm phải lớn hơn 0";
    }

    if (data.discount_type === "percent" && discountValue > 100) {
        return "Giá trị giảm theo phần trăm không được vượt quá 100%";
    }

    if (data.discount_type === "fixed" && !Number.isInteger(discountValue)) {
        return "Số tiền giảm phải là số nguyên";
    }

    if (maxDiscount !== null && (Number.isNaN(maxDiscount) || maxDiscount < 0)) {
        return "Mức giảm tối đa không hợp lệ";
    }

    if (data.discount_type === "fixed" && maxDiscount !== null) {
        return "Voucher giảm số tiền cố định không cần nhập mức giảm tối đa";
    }

    if (Number.isNaN(minOrderValue) || minOrderValue < 0) {
        return "Giá trị đơn hàng tối thiểu không hợp lệ";
    }

    if (!data.quantity || Number.isNaN(quantity) || quantity < 1) {
        return "Số lượng voucher phải lớn hơn hoặc bằng 1";
    }

    if (!Number.isInteger(quantity)) {
        return "Số lượng voucher phải là số nguyên";
    }

    if (!data.apply_scope) {
        return "Vui lòng chọn phạm vi áp dụng";
    }

    if (
        data.apply_scope === "specific_users" &&
        (!data.user_ids || data.user_ids.length === 0)
    ) {
        return "Vui lòng chọn ít nhất một thành viên";
    }

    if (!data.start_date) {
        return "Vui lòng chọn ngày bắt đầu";
    }

    if (!data.end_date) {
        return "Vui lòng chọn ngày kết thúc";
    }

    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return "Ngày bắt đầu hoặc ngày kết thúc không hợp lệ";
    }

    if (endDate <= startDate) {
        return "Ngày kết thúc phải sau ngày bắt đầu";
    }

    return null;
};