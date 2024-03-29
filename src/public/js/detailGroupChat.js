$(document).ready(function(){
  $(document).on('click','.memberInGroup',function(){
    let targetId = $(this).parent().parent().parent().data('chat');
    let groupName = $(this).parent().parent().parent().find('.name').text();
    $('.contactListUserInGroup').html('');
    $('#detailGroupModal').attr('data-id',targetId);
    $('#detailGroupModal').find('.modal-title').html(`Group : ${groupName}`);
    $.get(`/contact/user-in-group?targetId=${targetId}`,function(data){
        $('.contactListUserInGroup').html(data);
        $(`#detailGroupModal[data-id = ${targetId}]`).niceScroll({
          smoothscroll: true,
          horizrailenabled: false,
          cursorcolor: '#ECECEC',
          cursorwidth: '7px',
          scrollspeed: 50
        });
        $("#detailGroupModal").modal('show');
    })
  })
  $(document).on('click','.chat-to-user',function(){
    let targetId = $(this).data('uid');
    let userName = $(this).parent().find('.user-name>p').text().trim();
    let address = $(this).parent().find('.user-address>span').text().trim();
    let avatar = $(this).parent().find('.user-avatar>img').attr('src');
    // khi 2 người đã là bạn bè
    if($(`#user-chat ul`).find(`.person[data-chat = ${targetId}]`).length){
      $('#contactsModal').modal('hide');
      $(`.person[data-chat = ${targetId}]`).on('kysmile.moveConversationToTheTop',function(){
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("kysmile.moveConversationToTheTop");
      })
      $(`.person[data-chat = ${targetId}]`).trigger('kysmile.moveConversationToTheTop');
      $('ul.people').find("a")[0].click();
      $('#detailGroupModal').modal('hide');
    }
    else{
      $.get(`/contact/check-friend?targetId=${targetId}`,function(data){
        // khi chưa là bạn bè
        if(!data){
          Swal.fire({
            title: `Bạn và "${userName}" vẫn chưa phải là bạn bè nên không thể trò chuyện được !!!`,
            text : `Bạn có muốn thêm "${userName}" vào danh sách bạn bè luôn không ???? `,      
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác Nhận',
            cancelButtonText: 'Huỷ Bỏ'
          }).then((result) => {
            if(!result.value){
                return false;
            }
          $.post('/contact/add-new',{uid : targetId},function(data){
              if(data.success){
                swal.fire({
                  title: `Bạn đã gửi thành công lời mời kết bạn tới "${userName}" !!!`,
                  text : 'Vui lòng chờ bạn ấy xác nhận nhé ...',
                  type: "success",
                  confirmButtonText: "OK",
                });
                increaseNumberNotification("noti_contact_counter",1); // js/caculateNotification
                increaseNumberNotiContact("count-request-contact-sent"); // js/caculateNotiContact
                // thêm ở modal tab đang chờ xác nhận
                let userInfoHtml = `<li class="_contactList" data-uid="${targetId}">
                    <div class="contactPanel">
                        <div class="user-avatar">
                            <img src="${avatar}" alt="">
                        </div>
                        <div class="user-name">
                            <p>
                                ${userName}
                            </p>
                        </div>
                        <br>
                        <div class="user-address">
                            <span>&nbsp ${address}</span>
                        </div>
                        <div class="user-add-new-contact" style="display:none;" data-uid="${targetId}">
                            Thêm vào danh sách liên lạc
                        </div>
                        <div class="user-remove-request-contact-sent action-danger" style="display:inline-block;" data-uid="${targetId}">
                            Hủy yêu cầu
                        </div>
                    </div>
                </li>`;
                $('#request-contact-sent').find('ul').prepend(userInfoHtml);
                removeRequestContactSent();
                socket.emit('add-new-contact' , {contactId : targetId});
              }
            })
          });
        }
        else{
            // đã kết bạn nhưng chưa người ấy chưa đồng ý 
            swal.fire({
                title: `"${userName}" vẫn chưa chấp nhận lời mời kết bạn !!!`,
                type: "warning",
                confirmButtonText: "OK",
            });
        }
      })  
    }
  })
  $(document).on('keyup','#input-find-users-add-to-group',function(e){
    let keySearch = $(this).val();
    let groupChatId = $('#detailGroupModal').attr('data-id'); 
    if(e.which == 13){
      if(keySearch == ''){
        alertify.notify('Bạn chưa nhập username hoặc mail cần tìm kiếm !!!' , 'error',7)
        return;
      }
      $.get(`/contact/search-user-not-in-group?keySearch=${keySearch}&groupChatId=${groupChatId}`,function(data){
        $('.contactListUserInGroupAfterSearch').html(data);
        $('#input-find-users-add-to-group').val('');
      })
    }
  });
  $(document).on('click','#btn-find-users-not-in-group',function(){
    let keySearch = $('#input-find-users-add-to-group').val();
    let groupChatId = $('#detailGroupModal').attr('data-id'); 
    if(keySearch == ''){
      alertify.notify('Bạn chưa nhập username hoặc mail cần tìm kiếm !!!' , 'error',7);
      return;
    }
    $.get(`/contact/search-user-not-in-group?keySearch=${keySearch}&groupChatId=${groupChatId}`,function(data){
      $('.contactListUserInGroupAfterSearch').html(data);
      $('#input-find-users-add-to-group').val('');
    })
  })
  $(document).on('click','.add-to-group',function(){
    let targetId = $(this).data('uid');
    let userName = $(this).parent().find('.user-name>p').text().trim();
    let groupChatId = $('#detailGroupModal').attr('data-id');
    Swal.fire({
      title: `Bạn có chắc chắn mún thêm "${userName}" vào Nhóm không ???`,     
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác Nhận',
      cancelButtonText: 'Huỷ Bỏ'
    }).then((result) => {
      if(!result.value){
          return false;
      }
      $.get(`/group-chat/add-user-to-group-chat?targetId=${targetId}&groupChatId=${groupChatId}`,function(data){
        let newUserAddToGroup = `<li class="listUserInGroup" data-uid="${data.addUserToGroupChat._id}">
            <div class="contactPanel">
                <div class="user-avatar">
                    <img src="images/users/${data.addUserToGroupChat.avatar}" alt="">
                </div>
                <div class="user-name">
                    <p>
                        ${data.addUserToGroupChat.username}
                    </p>
                </div>
                <br>
                <div class="user-address">
                    <span>&nbsp ${data.addUserToGroupChat.address}</span>
                </div>
                <div class="chat-to-user" data-uid="${data.addUserToGroupChat._id}">
                    Trò chuyện
                </div>
            </div>
        </li>`;
        $('.contactListUserInGroupAfterSearch').find(`li[data-uid = ${targetId}]`).remove();
        $('#userInGroup').find('ul').append(newUserAddToGroup);
        let totalUserInGroup = parseInt($('.show-number-members').html());
        $('.show-number-members').html(totalUserInGroup+1);
        socket.emit('add-new-user-to-group',{user : data.addUserToGroupChat ,groupChatId : groupChatId , rightSide : data.rightSide });
      });
    });
  })
  socket.on('response-add-new-user-to-group',function(data){
    let ModalGroupId = $('#detailGroupModal').attr('data-id');
    if(ModalGroupId == data.groupChatId){
      let newUserAddToGroup = `<li class="listUserInGroup" data-uid="${data.user._id}">
          <div class="contactPanel">
              <div class="user-avatar">
                  <img src="images/users/${data.user.avatar}" alt="">
              </div>
              <div class="user-name">
                  <p>
                      ${data.user.username}
                  </p>
              </div>
              <br>
              <div class="user-address">
                  <span>&nbsp ${data.user.address}</span>
              </div>
              <div class="chat-to-user" data-uid="${data.user._id}">
                  Trò chuyện
              </div>
          </div>
      </li>`;
      $('#userInGroup').find('ul').append(newUserAddToGroup);
      let totalUserInGroup = parseInt($('.show-number-members').html());
      $('.show-number-members').html(totalUserInGroup+1);
    }
    // Step 02 : handle leftside.ejs
    let subGroupChatName = data.groupChat.name;
    if(subGroupChatName.length > 15){
      subGroupChatName = subGroupChatName.substr(0,11)
    }
    let message = "";
    if(data.message.length){
      if(data.message[0].messageType == 'text'){
        message = emojione.toImage(data.message[0].text);
      }
      else if(data.message[0].messageType == 'image'){
        message = "Hình ảnh ...";
      }
      else{
        message = "Tệp đính kèm ...";
      }
    }
    let leftSideData = `<a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
        <li class="person" style="height:70px;" data-chat="${data.groupChat._id}">
            <div class="left-avatar">
                <img src="images/users/group-default.png" class="avatar-online" alt="">
            </div>
            <span class="name" style="font-weight:bold;">
                ${subGroupChatName.length < 10 ?  `${subGroupChatName}...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` : `${subGroupChatName}...`}
            </span>
            <span class="time">
              ${moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow()}
            </span>
            <span class="preview convert-emoji">
              ${message}
            </span>
        </li>
    </a>`;
    $('#all-chat').find("ul").prepend(leftSideData);
    $('#group-chat').find("ul").prepend(leftSideData);
    // Step 03 : hanle rightSide.ejs
    $('#screen-chat').prepend(`${emojione.toImage(data.rightSide)}`);
    // Step 04 : call function changeScreenChat
    changeScreenChat();
    // Step 05 : handle imageModal
    let imageModalData = `<div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">Những hình ảnh trong cuộc trò chuyện . </h4>
                  </div>
                  <div class="modal-body">
                      <div class="all-images" style="visibility: hidden;">
                      </div>
                  </div>
              </div>
          </div>
      </div>`;
      $('body').append(imageModalData);
      // Step 06 : call function gridPhotos
      gridPhotos(5);
      // Step 07 : handle attachmentModal
      let attachmentModalData = `<div class="modal fade" id="attachmentsModal_${data.groupChat._id}" role="dialog">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">All Attachs in this conversation.</h4>
                  </div>
                  <div class="modal-body">
                      <ul class="list-attachments">
                      </ul>
                  </div>
              </div>
          </div>
      </div>`;
    $('body').append(attachmentModalData);
    readMoreMessages();
  })
  $(document).on('click','#leave-group',function(){
    let groupChatId = $('#detailGroupModal').attr('data-id');
    Swal.fire({
      title: `Bạn có chắc chắn muốn rời khỏi nhóm không ???`,     
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác Nhận',
      cancelButtonText: 'Huỷ Bỏ'
    }).then((result) => { 
      if(!result.value){
        return false;
      }
      $.get(`/group-chat/leave-group?groupChatId=${groupChatId}`,function(data){
        if(data){
          $('#all-chat').find(`ul>a[href = "#uid_${groupChatId}"]`).remove();
          if($('ul.people').find("a").length){
            $('#detailGroupModal').modal('hide');
            $('ul.people').find("a")[0].click();
            socket.emit('leave-group',groupChatId);
          }
        }
      })
    }); 
  })
  socket.on('response-leave-group',function(data){
    let memberInGroup = parseInt($(`.right[data-chat = ${data}]`).find("span.show-number-members").html().trim());
    memberInGroup -= 1;
    $(`.right[data-chat = ${data}]`).find("span.show-number-members").html(memberInGroup);
  })
  $(document).keyup(function(e){
    if(e.which == 27){
      $('.close').trigger('click');
    }
  })
})
