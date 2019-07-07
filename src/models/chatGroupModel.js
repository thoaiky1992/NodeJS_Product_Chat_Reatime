import mongoose from 'mongoose';
const Schema =  mongoose.Schema;

const ChatGroupSchema = new Schema({
    name            : String,
    userAmount      : {type:Number,min:3,max:100},
    messageAmount   : {type:Number,default:0},
    userID          : String,
    members         : [
        {userID:String}
    ],
    createAt        : {type:Number,default:Date.now},
    updateAt        : {type:Number,default:null},
    deleteAt        : {type:Number,default:null},
});
module.export = mongoose.model('chat-group',ChatGroupSchema);