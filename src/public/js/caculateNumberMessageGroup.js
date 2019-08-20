function increaseNumberMessageGroup(divId){
    let currentValue = parseInt($(`.right[data-chat = ${divId}]`).find("span.show-number-messages").html().trim());
    currentValue += 1;
    $(`.right[data-chat = ${divId}]`).find("span.show-number-messages").html(currentValue);
}