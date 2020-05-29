const {Schema, model} = require("mongoose");
const friendSchema = new Schema({
    relationId: {
      type: String,
      index: true,
      required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createTime: {
        type: Date,
        default: Date.now()
    },
    status: {//0：未操作，1：同意，2：拒绝
        type: Number,
        default: 0,
        required: true
    }
})

module.exports = model("Friend", friendSchema);
