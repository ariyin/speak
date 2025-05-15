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

const video = async (req, res) => {
    const { rehearsalId, videoUrl } = req.body;

    try {
        const rehearsal = await Rehearsal.findOneAndUpdate(
            { _id: rehearsalId },
            { videoUrl: videoUrl },
            { new: true }
        );
        if (!rehearsal) {
            return res.status(404).json({
                success: false,
                message: 'Rehearsal not found',
            });
        }

        const link = rehearsal.videoUrl;
        console.log('Video URL:', rehearsal);
        res.status(200).json({
            success: true,
            videoUrl: link,
        });
    } catch (error) {
        console.error('Error updating rehearsal:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = {
    type,
    video,
};
