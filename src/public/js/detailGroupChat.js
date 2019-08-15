$(function(){
    $(document).on('click','.number-members',function(){
        let targetId = $(this).parent().parent().parent().data('chat');
        let groupName = $(this).parent().parent().parent().find('.name').text();
        $('#detailGroupModal').find('.modal-title').html(`Group : ${groupName}`);
        $.get(`/contact/user-in-group?targetId=${targetId}`,function(data){
            $('.contactListUserInGroup').html(data);
        })
    })
    $(document).on('click','.chat-to-user',function(){
        let targetId = $(this).data('uid');
        $('#contactsModal').modal('hide');
        $(`.person[data-chat = ${targetId}]`).on('kysmile.moveConversationToTheTop',function(){
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("kysmile.moveConversationToTheTop");
        })
        $(`.person[data-chat = ${targetId}]`).trigger('kysmile.moveConversationToTheTop');
        $('ul.people').find("a")[0].click();
        $('#detailGroupModal').modal('hide');
    })
})