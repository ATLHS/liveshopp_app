const mongoose = require("mongoose")

const bannedSchema = new mongoose.Schema(
    {
        id: {type: String},
        firstname: {type: String},
        lastname: {type: String},
        profil: {type: String},
        phone: {type: String, default: ''},
        email: {type: String},
        company_name: {type: String, default: ''},
    },
    {timestamps: true},
)

const Banned = mongoose.model("Banned", bannedSchema)

module.exports = Banned
