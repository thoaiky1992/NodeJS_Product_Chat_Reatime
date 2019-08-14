$(function(){
    $(document).on('click','.user-talk',function(){
        let targetId = $(this).data('uid');
        $('#contactsModal').modal('hide');
        $(`.person[data-chat = ${targetId}]`).on('kysmile.moveConversationToTheTop',function(){
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("kysmile.moveConversationToTheTop");
        })
        $(`.person[data-chat = ${targetId}]`).trigger('kysmile.moveConversationToTheTop');
        $('ul.people').find("a")[0].click();
    })
})