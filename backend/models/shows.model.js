const { Schema } = require("mongoose");
const { mongoose } = require("../models");

module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            name: { type: String },
            showCount: { type: Number },
            awCollectionId: { type: String, unique: true },
            published: { type: String },
            publisherId: { type: String },
            rssFeed: { type: String },
            image_url: { type: String }
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...Object } = this.toObject();
        Object.id = _id;
        return Object;
    });
    const Show = mongoose.model("show", schema);
    return Show;
};