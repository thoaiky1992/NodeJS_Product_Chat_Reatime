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
ContactSchema.statics = {
    createNew(item){
        return this.create(item)
    },
    // tìm tất cả bản ghi liên quan tới UserID
    findAllByUser(userId){
        return this.find({
            $or : [
                {"userID":userId},
                {"contactID":userId}
                
            ]
        }).exec();
    }
}
module.exports = mongoose.model('contact',ContactSchema);