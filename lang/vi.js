export const transValidation = {
    email_incorrect : 'email phải có dạng example@gmail.com',
    gender_incorrect : 'Ủa ! tại sao trường giới tính lại bị sai',
    password_incorrect : 'Mật khẩu chứa ít nhất 8 kí tự , bao gồm chữ hoa , chữ thường và ký tự đặc biệt',
    password_confirmation_incorrect : 'Nhập lại mật khẩu chưa chính xác',
    update_username : 'Username chỉ chứa khoảng 3-17 kí tự và méo được phép chứa kí tự đặc biệt',
    update_gender : 'Oh my god ! giới tính có vấn đề ... ',
    update_address : 'Địa chỉ giới hạn trong 3-80 kí tự',
    update_phone : 'Số điện thoại phải bắt đầu bằng số 0 và giới hạn 10-11 kí tự số'
};
export const transErrors = {
    account_in_use : 'Email này đã được sử dụng !!!',
    account_not_active : 'Email đã được đăng ký nhưng chưa active tài khoản ! vui lòng kiểm tra Mail hoặc liên hệ với bộ phận hỗ trợ',
    account_removed : 'Tài khoản này đã bị xoá khỏi hệ thống',
    account_undefined : 'Tài khoản này không tồn tại',
    user_current_password_failed : 'Mật khẩu này không tồn tại !!!',
    token_undefined : 'Token không tồn tại !!!',
    login_failed : ' Sai tài khoản hoặc mật khẩu',
    server_error : 'Có lỗi ở phía server trong quá trình đăng nhập ! xin vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi để xử lý , xin cảm ơn',
    avatar_type : 'Kiểu file không hợp lệ ! chỉ chấp nhận JPG - JNG - JPEG',
    avatar_size : 'File không được vượt quá 1MB .'
}
export const transSuccess = {
    userCreated : (userEmail) => {
        return `Tài khoản <strong style="color:red;">${userEmail}</strong> đã được tạo , vui lòng kiểm tra email và active tài khoản trước khi đăng nhập`;
    },
    account_actived:'Kích hoạt tài khoản thành công ! Giờ bạn có thể login vào ứng dụng ',
    loginSuccess : (username) => {
        return `Xin chào ${username} , chúc bạn có 1 ngày thật vui vẽ và tốt lành ...`;
    },
    logout_success : 'Đăng xuất tài khoản thành cmn công nhé ',
    user_info_or_avatar_updated : 'Cập nhập thông tin thành cmn công .',
    user_password_updated : 'Cập nhật mật khẩu thành cmn công nhé !!',
    
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