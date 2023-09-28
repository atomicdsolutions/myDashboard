const { Schema } = require("mongoose");
const { mongoose } = require(".");

module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            name: {
                type: String,
                unique: true
            },
            published: { type: String },
            showCount: { type: Number },
            apiKey: { type: String },
            podApiKey: { type: String },
            email: { type: String },
            website: { type: String },
            instance: { type: String },
            type: { type: String },
            user: { type: String },
            agency: { type: Number },
            awsApikey: { type: String },
            awsApiUsagePlan: { type: String },
            imported: { type: Boolean }
        },
        { timestamps: true }
    );
    schema.method("toJSON", function () {
        const { __v, _id, ...Object } = this.toObject();
        Object.id = _id;
        return Object;
    });
    const Publisher = mongoose.model("publisher", schema);
    return Publisher;
};