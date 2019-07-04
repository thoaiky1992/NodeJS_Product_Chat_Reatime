import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

const NotificationSchema = new Schema({
    sender : {
        id          : String,
        username    : String,
        avatar      : String
    },
    receiver : {
        id          : String,
        username    : String,
        avatar      : String
    },
    type            : String,
    content         : String,
    isRead          : {type:Boolean,default:false},
    file            : {data:Buffer,contentType:String,fileName:String},
    createAt        : {type:Number,default:Date.now}, 
});
module.export = mongoose.model('notification',NotificationSchema);