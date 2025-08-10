import mongoose, { Document, Schema, Types } from "mongoose";
const schema = new Schema({
    chatId: { type: Schema.Types.ObjectId, required: true },
    sender: { type: String, required: true },
    text: { type: String },
    image: {
        url: { type: String },
        publicId: { type: String }
    },
    messageType: {
        type: String,
        enum: ["text", "image"],
        default: "text",
    },
    seen: {
        type: Boolean,
        default: false,
    },
    seenAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true
});
export default mongoose.model("Message", schema);
//# sourceMappingURL=Messages.js.map