const mongoose = require('mongoose');
const variables = require('../utility/variables');

const rate = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rate: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true,
    },
});

const baseUser = mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        hashedPassword: {
            type: String,
            required: true,
        },
        provider: {
            type: String,
            enum: ['email', 'google', 'twitter'],
            default: 'email',
            required: true,
        },
        providerId: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            required: true,
        },
        createdEvents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Event',
            },
        ],
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        createdFunds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Fund',
            },
        ],
    },
    { toJSON: { virtuals: true } },
    { toObject: { virtuals: true } }
);

const user = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    // fullname: virtual property
    profileImage: {
        type: String,
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    preferredCities: [
        {
            type: String,
            enum: variables.CITIES,
        },
    ],
    interests: [
        {
            type: String,
            enum: variables.CATEGORIES,
            required: true,
        },
    ],
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },
    followedEvents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
        },
    ],
    followedFunds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Fund',
        },
    ],
    followedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    followedOrganizations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
        },
    ],
});

user.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

const organization = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    categories: [
        {
            type: String,
            enum: variables.CATEGORIES,
        },
    ],
    city: {
        type: String,
        required: true,
    },
    rates: [rate],
    // rate : virtual property
    websiteUrl: {
        type: String,
    },
});

organization.virtual('rate').get(function () {
    if (!this.rates.length) return 0;
    return (
        this.rates.reduce((acc, curr) => acc + curr.rate, 0) / this.rates.length
    );
});

const BaseUser = mongoose.model('BaseUser', baseUser);
const User = BaseUser.discriminator('User', user);
const Organization = BaseUser.discriminator('Organization', organization);

module.exports = {
    User,
    Organization,
};