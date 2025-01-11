const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        unique: true
    },
    goalKeeper: [
        {
            id: String,
            name: String,
            email: String,
            phone: String
        }
    ],
    defender: [
        {
            id: String,
            name: String,
            email: String,
            phone: String
        }
    ],
    winger: [
        {
            id: String,
            name: String,
            email: String,
            phone: String
        }
    ],
    forward: [
        {
            id: String,
            name: String,
            email: String,
            phone: String
        }
    ]
});

const Team = mongoose.model('teams', teamSchema);
module.exports = Team;
