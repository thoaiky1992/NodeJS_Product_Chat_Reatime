import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

const Messagechema = new Schema({
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
    text        : String,
    file        : {data:Buffer,contentType:String,fileName:String},
    createAt    : {type:Number,default:Date.now},
    updateAt    : {type:Number,default:null},
    deleteAt    : {type:Number,default:null},
});
module.export = mongoose.model('message',Messagechema);