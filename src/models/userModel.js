import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

const UserSchema  = new Schema({
    username    : String,
    gender      : {type: String , default : 'male'},
    phone       : {type: Number , default : null},
    address     : {type: String , default : null},
    avatar      : {type: String , default : 'avatar-default.jpg'},
    role        : {type: String , default : 'user'},
    local       : {
        email       : {type:String,trim : true},
        password    : String,
        isActive    : {type:Boolean,default:false},
        verifyToken : String
    },
    facebook : {
        uid     : String,
        token   : String,
        email   : {type:String,trim : true}
    },
    google  : {
        uid     : String,
        token   : String,
        email   : {type:String,trim : true}
    },
    createAt : {type:Number,default:Date.now},
    updateAt : {type:Number,default:null},
    deleteAt : {type:Number,default:null},
});
UserSchema.statics = { // UserSchema.statics : để tìm bản ghi và truy vấn
    createNew(item){
        return this.create(item)
    },
    findByEmail(email){
        return this.findOne({"local.email":email}).exec();
    },
    findUserById(id){
        return this.findById(id).exec();
    },
    removeById(id){
        return this.findByIdAndRemove(id).exec();
    },
    findByToken(token){
        return this.findOne({"local.verifyToken":token}).exec();
    },
    verify(token){
        return this.findOneAndUpdate(
            {"local.verifyToken":token},
            {"local.isActive" : true,"local.verifyToken":null}
        ).exec();
    },
    findByFacebookUid(uid){
        return this.findOne({"facebook.uid":uid}).exec();
    },
}
UserSchema.methods = { // UserSchema.methods: đã tìm được bản ghi và truy vấn trong bản ghi đó
    comparePassword(password){
        return bcrypt.compare(password,this.local.password); // return a Promise has result is true or false
    }
}
module.exports = mongoose.model("user",UserSchema);