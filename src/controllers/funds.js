/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const Funds = require('../models/fund');

async function getOneFund(req, res) {
    try {
        const requiredUserField = [
            'id',
            'firstName',
            'lastName',
            'email',
            'profileImage',
        ];

        const fund = await Funds.findById(req.params.id).populate(
            'publisherId',
            requiredUserField.join(' ')
        );
        if (!fund) {
            return res.status(404).json({
                message: 'Not found',
            });
        }
        return res.status(200).json(fund);
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}
async function getFunds(req, res) {
    try {
        const requiredUserField = [
            'id',
            'firstName',
            'lastName',
            'email',
            'profileImage',
        ];
        const { category, publisherId, lastDate, currentDate } = req.query;
        const filter = {};
        if (category) {
            filter.category = { $in: category };
        }
        if (publisherId) {
            filter.publisherId = mongoose.Types.ObjectId(publisherId);
        }
        if (lastDate && currentDate) {
            filter.createdAt = { $gte: currentDate, $lte: lastDate };
        }
        const filteredItem = await Funds.find(filter).populate(
            'publisherId',
            requiredUserField.join(' ')
        );
        res.status(200).json(filteredItem);
    } catch (err) {
        return res.sendStatus(500);
    }
}

module.exports = {
    getFunds,
    getOneFund,
};
