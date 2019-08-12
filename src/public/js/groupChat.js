function callSearchFriends(element){
    if(element.which === 13 || element.type === 'click' ){
        let keyword = $('#input-search-friends-to-add-group-chat').val();
        let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
        if(!keyword.length){
            alertify.notify('Chưa nhập nội dung ! tìm kiếm bằng niềm tin à ...','error',7);
            return false;
        }
        if(!regexKeyword.test(keyword)){
            alertify.notify('Lỗi từ khoá ! User cần tìm kiếm chỉ cho phép chữ cái , chữ số .','error',7);
            return false;
        }
        $.get(`/contact/search-friends/${keyword}`,function(data){
            $('ul#group-chat-friends').html(data);
            
        })
    }
}
function callCreateGroupChat(){

}
$(function(){
    $('#input-search-friends-to-add-group-chat').bind('keypress',callSearchFriends);
    $('#btn-search-friends-to-add-group-chat').bind('click',callSearchFriends);
})