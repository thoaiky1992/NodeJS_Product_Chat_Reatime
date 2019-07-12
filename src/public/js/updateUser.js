$(function(){
    let userAvatar = null;
    let userInfo = {};
    let originAvatarSrc = $('#user-modal-avatar').attr('src');
    let originUserInfo = {
        username : $('#input-change-username').val(),
        gender : ($('#input-change-gender-male').is(":checked") ? $('#input-change-gender-male').val() : $('#input-change-gender-female').val()),
        address : $('#input-change-address').val(),
        phone : $('#input-change-phone').val(),
    };
    function updateUserInfo(){
        $('#input-change-avatar').bind('change',function(){
            let fileData = $(this).prop('files')[0];
            let math = ['image/png','image/jpg','image/jpeg'];
            let limit = 1048576; // byte = 1MB
            if($.inArray(fileData.type,math) === -1){
                alertify.notify('Kiểu file không hợp lệ ! chỉ chấp nhận JPG - JNG - JPEG','error',7);
                $(this).val(null);
                return false;
            }
            if(fileData.size > limit){
                alertify.notify('Ảnh upload chỉ cho phép dưới 1MB','error',7);
                $(this).val(null);
                return false;
            }
            if(typeof (FileReader) != "undefined"){
                let imagePreview = $('#image-edit-profile');
                imagePreview.empty();
                let fileReader = new FileReader();
                fileReader.onload = function(element){
                    $('<img>',{
                        "src": element.target.result,
                        "class" : "avatar img-circle",
                        "id" : "user-modal-avatar",
                        "alt" : "avatar"
                    }).appendTo(imagePreview);
                };
                imagePreview.show();
                fileReader.readAsDataURL(fileData);
                // nếu ảnh hợp lệ
                let formData =  new FormData();
                formData.append('avatar',fileData);
                userAvatar = formData;
            }else{
                alertify.notify('Trình duyệt của bạn không hỗ trợ FileReader','error',7);
            }
        });
    }
    updateUserInfo();
    $('#input-change-username').bind('change',function(){
        userInfo.username = $(this).val();
    });
    $('#input-change-gender-male').bind('click',function(){
        userInfo.gender = $(this).val();
    });
    $('#input-change-gender-female').bind('click',function(){
        userInfo.gender = $(this).val();
    });
    $('#input-change-address').bind('change',function(){
        userInfo.address = $(this).val();
    });
    $('#input-change-phone').bind('change',function(){
        userInfo.phone = $(this).val();
    });
    $('#input-btn-update-user').bind('click',function(){
        if($.isEmptyObject(userInfo) && !userAvatar){
            alertify.notify('Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu !!!','error',7);
            return false;
        }
        $.ajax({
            url : '/user/update-avatar',
            type : 'put',
            cache : false,
            contentType : false,
            processData : false,
            data : userAvatar,
            success:function(result){
                //
            },
            error:function(error){
                //
            }
        });
        // console.log(userAvatar);
        // console.log(userInfo);
    });
    $('#input-btn-cancel-user').bind('click',function(){
        cuserAvatar = null;
        userInfo = {};
        $('#user-modal-avatar').attr('src',originAvatarSrc);
        $('#input-change-username').val(originUserInfo.username);
        (originUserInfo.gender === 'male') ? $('#input-change-gender-male').click() : $('#input-change-gender-female').click();
        $('#input-change-address').val(originUserInfo.address);
        $('#input-change-phone').val(originUserInfo.phone);
    });
});