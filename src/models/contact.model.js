import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

const ContactSchema = new Schema({
    userID      : String,
    contactID   : String,
    status      : {type:Boolean,default:false},
    createAt    : {type:Number,default:Date.now},
    updateAt    : {type:Number,default:null},
    deleteAt    : {type:Number,default:null},
});
module.export = mongoose.model('contact',ContactSchema);