import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Service description is required']
    },
    category: {
        type: String,
        required: [true, 'Service category is required'],
        enum: [
            'pc-building',
            'gaming-coaching',
            'console-repair',
            'pc-optimization',
            'gaming-setup',
            'esports-training',
            'tournament-organization',
            'streaming-setup',
            'hardware-upgrade',
            'gaming-consultation'
        ]
    },
    basePrice: {
        type: Number,
        required: [true, 'Base price is required'],
        min: [0, 'Price cannot be negative']
    },
    duration: {
        type: Number, // in minutes
        required: [true, 'Service duration is required'],
        min: [15, 'Minimum duration is 15 minutes']
    },
    image: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    requirements: [{
        type: String,
        trim: true
    }],
    gameSpecific: {
        supportedGames: [{
            type: String // Game titles this service supports
        }],
        skillLevel: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'professional']
        }
    }
}, {
    timestamps: true
});

// Index for better search performance
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Service', serviceSchema);