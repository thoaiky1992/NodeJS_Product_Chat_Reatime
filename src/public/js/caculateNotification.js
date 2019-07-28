function increaseNumberNotification(className,number){
    let currentValue = $(`.${className}`).text();
    if(currentValue == ''){
        ifcurrentValue = 0;
    }else{
        currentValue = parseInt(currentValue);
    }
    currentValue += number;
    if(currentValue === 0){
        $(`.${className}`).css({'display':'none'}).html("");
    }else{
        $(`.${className}`).css({'display':'block'}).html(currentValue);
    }
}
function decreaseNumberNotification(className,number){
    let currentValue = parseInt($(`.${className}`).text());
    currentValue -= number;
    if(currentValue === 0){
        $(`.${className}`).css({'display':'none'}).html("");
    }else{
        $(`.${className}`).css({'display':'block'}).html(currentValue);
    }
}