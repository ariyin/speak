const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const speechSchema = new Schema({
    userId: String,
    currentStep: Number,
    rehearsals: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Rehearsal',
        },
    ],
});

const rehearsalSchema = new Schema({
    analysis: {
        type: String,
        required: true,
    },
    speech: {
        type: Schema.Types.ObjectId,
        ref: 'Speech',
    },
    currentStep: Number,
    videoUrl: {
        type: String,
        default: '',
    },
});

const Speech = mongoose.model('Speech', speechSchema, 'speeches');
const Rehearsal = mongoose.model('Rehearsal', rehearsalSchema, 'rehearsals');

module.exports = {
    Speech,
    Rehearsal,
};
