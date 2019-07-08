export const transValidation = {
    email_incorrect : 'email phải có dạng example@gmail.com',
    gender_incorrect : 'Ủa ! tại sao trường giới tính lại bị sai',
    password_incorrect : 'Mật khẩu chứa ít nhất 8 kí tự , bao gồm chữ hoa , chữ thường và ký tự đặc biệt',
    password_confirmation_incorrect : 'Nhập lại mật khẩu chưa chính xác',
};
export const transErrors = {
    account_in_use : 'Email này đã được sử dụng !!!',
    account_not_active : 'Email đã được đăng ký nhưng chưa active tài khoản ! vui lòng kiểm tra Mail hoặc liên hệ với bộ phận hỗ trợ',
    account_removed : 'Tài khoản này đã bị xoá khỏi hệ thống',
    token_undefined : 'Token không tồn tại !!!'
}
export const transSuccess = {
    userCreated : (userEmail) => {
        return `Tài khoản <strong style="color:red;">${userEmail}</strong> đã được tạo , vui lòng kiểm tra email và active tài khoản trước khi đăng nhập`;
    },
    account_actived:'Kích hoạt tài khoản thành công ! Giờ bạn có thể login vào ứng dụng '
}
export const transMail = {
    subject : 'Xác nhận tài khoản',
    template : (linkVerify) => {
        return `
            <h2>Bạn nhận được Email này vì đã đăng kí tài khoản trên ứng dụng Chat Realtime - Kỳ Smile .</h2>
            <h3>Vui lòng click vào link dưới để xác nhận kích hoạt tài khoản .</h3>
            <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
            <h4>Chúc bạn có 1 ngày thật vui vẽ</h4>
        `;
    },
    send_failed : 'Có lỗi trong quá trình gửi email , vui lòng liên hệ lại với bộ phận hỗ trợ của chúng tôi .'
}