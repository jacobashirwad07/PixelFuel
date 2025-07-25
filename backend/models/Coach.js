import mongoose from 'mongoose';

const coachSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    services: [{
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
        },
        customPrice: {
            type: Number,
            min: [0, 'Price cannot be negative']
        },
        experience: {
            type: Number, // in years
            min: [0, 'Experience cannot be negative'],
            default: 0
        }
    }],
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    gamingProfile: {
        mainGames: [{
            game: String,
            rank: String,
            hoursPlayed: Number
        }],
        specializations: [{
            type: String,
            enum: [
                'fps-coaching',
                'moba-coaching', 
                'strategy-coaching',
                'speedrun-coaching',
                'competitive-gaming',
                'casual-improvement',
                'team-coordination',
                'individual-skills'
            ]
        }],
        platforms: [{
            type: String,
            enum: ['pc', 'playstation', 'xbox', 'nintendo-switch', 'mobile']
        }],
        achievements: [{
            title: String,
            description: String,
            date: Date,
            game: String
        }]
    },
    skills: [{
        type: String,
        trim: true
    }],
    certifications: [{
        name: String,
        issuer: String,
        date: Date,
        image: String
    }],
    availability: {
        timezone: {
            type: String,
            default: 'UTC'
        },
        schedule: {
            monday: { start: String, end: String, available: { type: Boolean, default: true } },
            tuesday: { start: String, end: String, available: { type: Boolean, default: true } },
            wednesday: { start: String, end: String, available: { type: Boolean, default: true } },
            thursday: { start: String, end: String, available: { type: Boolean, default: true } },
            friday: { start: String, end: String, available: { type: Boolean, default: true } },
            saturday: { start: String, end: String, available: { type: Boolean, default: true } },
            sunday: { start: String, end: String, available: { type: Boolean, default: false } }
        }
    },
    serviceAreas: [{
        region: String,
        onlineOnly: { type: Boolean, default: true },
        localService: { type: Boolean, default: false }
    }],
    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 }
    },
    completedSessions: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    documents: {
        idProof: String,
        gamingCertificates: [String],
        portfolioImages: [String]
    },
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        accountHolderName: String
    },
    socialLinks: {
        twitch: String,
        youtube: String,
        discord: String,
        steam: String
    }
}, {
    timestamps: true
});

// Index for gaming-specific queries
coachSchema.index({ 'gamingProfile.mainGames.game': 1, isVerified: 1, isAvailable: 1 });
coachSchema.index({ 'services.service': 1 });
coachSchema.index({ 'gamingProfile.specializations': 1 });

export default mongoose.model('Coach', coachSchema);