$(document).on('keyup','.searchBox',function(){
    let keySearch = $(this).val();
    if(keySearch != ""){
        $('#search-results').slideDown();
        $.get(`/contact/search-conversations?keySearch=${keySearch}`,function(data){
            data.forEach(function(item){
                if(item.members){
                    $('#search-results ul').append(`<li class="searchConversation" data-id="${item._id}">${item.name}</li>`)
                }
                else{
                    $('#search-results ul').append(`<li class="searchConversation" data-id="${item._id}">${item.username}</li>`)
                }
            })
        })  
    }
    else{
        $('#search-results').slideUp();
    }
})