let dateTimeCurrent = (timezone) => {
    var d = new Date().toLocaleString("en-US", {timeZone:timezone });
    d = new Date(d);
    d.getDate();
    d.getDay();
    d.getFullYear();
    d.getYear();
    d.getHours();
    d.getMilliseconds();
    d.getMinutes();
    d.getMonth();
    d.getSeconds();
    d.getTime();
    var ngay = d.getDate();
    var thang = d.getMonth() + 1;
    var nam = d.getFullYear();
    var gio = d.getHours();
    var phut = d.getMinutes();
    var giay = d.getSeconds()
    if(ngay < 10)
        gay = "0"+ngay;
    if(thang < 10)
        thang = "0"+thang;
    if(gio < 10)
        gio = "0"+gio;
    if(phut < 10)
        phut = "0"+phut;
    if(giay < 10)
        giay = "0"+giay;
    return ngay+"-"+thang+"-"+nam+" "+gio+":"+phut+":"+giay;
}
module.exports = dateTimeCurrent;