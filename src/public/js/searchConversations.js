function convertEng(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "a");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "o");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "u");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "y");
    str = str.replace(/A/g, "a");
    str = str.replace(/B/g, "b");
    str = str.replace(/C/g, "c");
    str = str.replace(/D/g, "d");
    str = str.replace(/E/g, "e");
    str = str.replace(/F/g, "f");
    str = str.replace(/G/g, "g");
    str = str.replace(/H/g, "h");
    str = str.replace(/I/g, "i");
    str = str.replace(/J/g, "j");
    str = str.replace(/K/g, "k");
    str = str.replace(/L/g, "l");
    str = str.replace(/M/g, "m");
    str = str.replace(/N/g, "n");
    str = str.replace(/O/g, "o");
    str = str.replace(/P/g, "p");
    str = str.replace(/Q/g, "q");
    str = str.replace(/R/g, "r");
    str = str.replace(/S/g, "s");
    str = str.replace(/T/g, "t");
    str = str.replace(/U/g, "u");
    str = str.replace(/V/g, "v");
    str = str.replace(/W/g, "w");
    str = str.replace(/X/g, "x");
    str = str.replace(/Y/g, "y");
    str = str.replace(/Z/g, "z");
    return str;
}
$(document).on('keyup','.searchBox',function(){
    let keySearch = $(this).val();
    if(keySearch != ""){
        $('#search-results').slideDown();
        $.get(`/contact/search-conversations?keySearch=${keySearch}`,function(data){
            $('#search-results ul').html('');
            let conversations = data.filter(function(item){
                if(item.members){
                    if(convertEng(item.name).indexOf(convertEng(keySearch)) != -1){
                        return item;
                    }
                }
                else{
                    if(convertEng(item.username).indexOf(convertEng(keySearch)) != -1){
                        return item;
                    }
                }
            })
            if(conversations.length == 0){
                $('#search-results ul').append(`<li>không tìm thấy tên cuộc trò chuyện này !!!</li>`);
                return;
            }
            conversations.forEach(function(item){
                if(item.members){
                    $('#search-results ul').append(`<li class="searchConversation" data-id="${item._id}">${item.name}</li>`);
                }
                else{
                    $('#search-results ul').append(`<li class="searchConversation" data-id="${item._id}">${item.username}</li>`);
                }
            })
            $('.search_content').niceScroll({
                smoothscroll: true,
                horizrailenabled: false,
                cursorcolor: '#ECECEC',
                cursorwidth: '7px',
                scrollspeed: 50
            });
        })  
    }
    else{
        $('#search-results').slideUp();
    }
})
$(document).on('click','.icon-close',function(){
    $('#search-results').fadeOut(100);
    $('#search-results ul').html('');
    $('.searchBox').val('');
})
$(document).on('click','.searchConversation',function(){
    let targetId = $(this).data('id');
    $('.searchBox').val('');
    $('#search-results').fadeOut();
    $(`.person[data-chat = ${targetId}]`).on('kysmile.moveConversationToTheTop',function(){
        let dataToMove = $(this).parent();
        $(this).closest("ul").prepend(dataToMove);
        $(this).off("kysmile.moveConversationToTheTop");
    })
    $(`.person[data-chat = ${targetId}]`).trigger('kysmile.moveConversationToTheTop');
    $('ul.people').find("a")[0].click();
})