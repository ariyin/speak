const { Speech, Rehearsal } = require('../models/speechRehearsalModel');

const type = async (req, res) => {
    const { analysis } = req.body;

    try {
        console.log('Received analysis:', analysis);
        const speech = await Speech.create({
            rehearsals: [],
        });
        const rehearsal = await Rehearsal.create({
            analysis,
            speech: speech._id,
            currentStep: 0,
        });
        speech.rehearsals.push(rehearsal._id);
        await speech.save();

        const rehearsalId = rehearsal._id;

        res.status(201).json({
            success: true,
            data: rehearsalId,
        });
    } catch (error) {
        console.error('Error creating speech:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = {
    type,
};
