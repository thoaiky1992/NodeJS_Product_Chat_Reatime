$(function(){
    var changeInfo = false;
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
            changeInfo = true;
            let fileData = $(this).prop('files')[0];
            let math = ['image/png','image/jpg','image/jpeg'];
            let limit = 1048576; // byte = 1MB
            // if($.inArray(fileData.type,math) === -1){
            //     alertify.notify('Kiểu file không hợp lệ ! chỉ chấp nhận JPG - JNG - JPEG','error',7);
            //     $(this).val(null);
            //     return false;
            // }
            // if(fileData.size > limit){
            //     alertify.notify('Ảnh upload chỉ cho phép dưới 1MB','error',7);
            //     $(this).val(null);
            //     return false;
            // }
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
    $('#input-change-username').bind('keyup',function(){
        username = $(this).val();
        let regexUsername = new RegExp("^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$");
        if(!regexUsername.test(username) || username.length < 3 || username.length > 17){
            alertify.notify('Username chỉ chứa khoảng 3-17 kí tự và méo được phép chứa kí tự đặc biệt','error',7),
            $(this).val(originUserInfo.username);
            delete userInfo.username;
            return false;
        }
        userInfo.username = $(this).val();
        changeInfo = true;
    });
    $('#input-change-gender-male').bind('click',function(){
        gender = $(this).val()
        if(gender !== 'male'){
            alertify.notify('Oh my god ! giới tính có vấn đề ...','error',7),
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }
        userInfo.gender = gender;
        changeInfo = true;
    });
    $('#input-change-gender-female').bind('click',function(){
        gender = $(this).val();
        if(gender !== 'female'){
            alertify.notify('Oh my god ! giới tính có vấn đề ...','error',7),
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }
        userInfo.gender = $(this).val();
        changeInfo = true;
    });
    $('#input-change-address').bind('keyup',function(){
        address = $(this).val();
        if( address.length < 3 || address.length > 80){
            alertify.notify('Địa chỉ giới hạn trong 3-30 kí tự','error',7),
            $(this).val(originUserInfo.address);
            delete userInfo.address;
            return false;
        }
        userInfo.address = $(this).val();
        changeInfo = true;
    });
    $('#input-change-phone').bind('change',function(){
        phone = $(this).val();
        let regexPhone = new RegExp("^(0)[0-9]{9,10}$");
        if(!regexPhone.test(phone)){
            alertify.notify('Số điện thoại phải bắt đầu bằng số 0 và giới hạn 10-11 kí tự số','error',7),
            $(this).val(originUserInfo.phone);
            delete userInfo.phone;
            changeInfo = true;
            return false;
        }
        userInfo.phone = $(this).val();
        changeInfo = true;
    });
    $('#input-btn-update-user').bind('click',function(){
        if(($.isEmptyObject(userInfo) && !userAvatar) || changeInfo === false){
            alertify.notify('Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu !!!','error',7);
            return false;
        }
        if(userAvatar){
            CallUpdateUserAvatar();
        }
        if(!$.isEmptyObject(userInfo)){
            CallUpdateUserInfo();
        }
    });
    $('#input-btn-cancel-user').bind('click',function(){
        cuserAvatar = null;
        userInfo = {};
        $('#input-change-avatar').val(null);
        $('#user-modal-avatar').attr('src',originAvatarSrc);
        $('#input-change-username').val(originUserInfo.username);
        (originUserInfo.gender === 'male') ? $('#input-change-gender-male').click() : $('#input-change-gender-female').click();
        $('#input-change-address').val(originUserInfo.address);
        $('#input-change-phone').val(originUserInfo.phone);
        changeInfo =  false;
    });
    function CallUpdateUserAvatar(){
        $.ajax({
            url : '/user/update-avatar',
            type : 'put',
            cache : false,
            contentType : false,
            processData : false,
            data : userAvatar,
            success:function(result){
                $('.user-modal-alert-success').find("span").text(result.message);
                $('.user-modal-alert-success').css({'display':'block'});
                setTimeout(function(){
                    $('.user-modal-alert-success').slideUp();
                },5000);
                $('#navbar-avatar').attr('src',result.imageSrc);
                originAvatarSrc = result.imageSrc;
                $('#input-btn-cancel-user').click();
                $('#input-change-avatar').val(null);
                changeInfo =  false;
            },
            error:function(error){
                $('.user-modal-alert-error').find("span").text(error.responseText);
                $('.user-modal-alert-error').css({'display':'block'});
                setTimeout(function(){
                    $('.user-modal-alert-error').slideUp();
                },5000);
                $('#input-btn-cancel-user').click();
                changeInfo = false;
            }
        });
    }
    function CallUpdateUserInfo(){
        console.log(userInfo)
        $.ajax({
            url : '/user/update-info',
            type : 'put',
            data : userInfo,
            success:function(result){
                $('.user-modal-alert-success').find("span").text(result.message);
                $('.user-modal-alert-success').css({'display':'block'});
                setTimeout(function(){
                    $('.user-modal-alert-success').slideUp();
                },5000);
                originUserInfo = Object.assign(originUserInfo,userInfo);
                $('#navbar-username').text(originUserInfo.username);
                $('#input-btn-cancel-user').click();
            },
            error:function(error){
                $('.user-modal-alert-error').find("span").text(error.responseText);
                $('.user-modal-alert-error').css({'display':'block'});
                setTimeout(function(){
                    $('.user-modal-alert-error').slideUp();
                },5000);
                $('#input-btn-cancel-user').click();
            }
        });
    }
});