const socket = io();


/**
 * Created by https://trungquandev.com's author on 25/02/2018.
 */
function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function nineScrollRight(divId) {
  $(`.right .chat[data-chat = ${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat = ${divId}]`).scrollTop($(`.right .chat[data-chat = ${divId}]`)[0].scrollHeight);
}

function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    recentEmojis: false,
    events: {
      keyup: function(editor, event) {
        // gán giá trị thay đổi vào thẻ input đã bị ẩn
        $(`#write-chat-${divId}`).val(this.getText());
      },
      click : function(){
        // bật lắng nghe DOM cho việc chat tin nhắn văn bản + emoji
        textAndEmojiChat(divId);
        // Bật chức năng người dùng đang gõ phím
        typingOn(divId);
      },
      blur : function(){
        // Tắt chức năng người dùng không gõ phím
        typingOff(divId);
      }
    },
  });
  $('.icon-chat').bind('click', function(event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('#loader').css('display', 'none');
}

function spinLoading() {
  $('#loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function() {
      spinLoading();
    })
    .ajaxStop(function() {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function() {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function() {
    $('#notifications').fadeToggle('fast', 'linear');
    // $('.noti_counter').fadeOut('slow');
    return false;
  });
  $(".main-content").click(function() {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $('.show-images').unbind('click').on('click',function(){
    let href = $(this).attr('href');
    let modalImagesId = href.replace("#","");
    let originDataImage = $(`#${modalImagesId}`).find("div.modal-body").html();
    let countRows = Math.ceil($(`#${modalImagesId}`).find('div.all-images>img').length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");
    $(`#${modalImagesId}`).find('div.all-images').photosetGrid({
      highresLinks: true,
      rel: 'withhearts-gallery',
      gutter: '2px',
      layout: layoutStr,
      onComplete: function() {
        $(`#${modalImagesId}`).find('.all-images').css({
          'visibility': 'visible'
        });
        $(`#${modalImagesId}`).find('.all-images a').colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: '90%',
          maxWidth: '90%'
        });
      }
    });

    // bắt sự kiện đóng modal
    $(`#${modalImagesId}`).on('hidden.bs.modal',function(){
      $(this).find('div.modal-body').html(originDataImage);
    })
  })
}

function flashMasterNotify(){
  let notify = $('.master-success-message').text();
  if(notify.length){
    alertify.notify(notify,"success",10);
  }
}
function changeTypeChat(){
  $("#select-type-chat").bind('change',function(){
    let optionSelected = $("option:selected",this);
    optionSelected.tab("show");
    if($(this).val() === 'user-chat'){
      $('.create-group-chat').hide();
    }else{
      $('.create-group-chat').show();
    }
  })
}
function changeScreenChat(){
  $('.room-chat').unbind('click').on('click',function(){
    let divId = $(this).find('li').data('chat');
    $('.person').removeClass('active');
    $(`.person[data-chat = ${divId}]`).addClass('active');
    $(this).tab('show');
    // cấu hình thanh cuộn bên box chat rightSide.ejs mỗi khi click chuột vào 1 cuộc trò chuyện
    nineScrollRight(divId);
    // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
    enableEmojioneArea(divId);
    // Bật lắng nghe DOM cho việc chat tin nhắn hình ảnh
    imageChat(divId);
    // Bật lắng nghe DOM cho việc tệp tin đính kèm
    attachmentChat(divId);

  })
}
function convertEmoji(){
  $(".convert-emoji").each(function() {
    var original = $(this).html();
    var converted = emojione.toImage(original);
    $(this).html(converted);
  });
}
function bufferToBase64(buffer){
  return  btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}
$(document).ready(function() {
  
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();

  

  // Icon loading khi chạy ajax
  ajaxLoading();

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // Flash message ở màn hình master
  flashMasterNotify();

  // Thay đổi kiểu trò chuyện
  changeTypeChat();

  // convert các unicode thành hình ảnh cảm xúc
  convertEmoji();

  //Thay đổi màn hình chát
  changeScreenChat();
  $('ul.people').find("a")[0].click(); //$('ul.people').find("li").first().click();
  
});

