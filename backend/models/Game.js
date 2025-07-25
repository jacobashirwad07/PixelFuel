import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Game title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Game description is required']
    },
    genre: {
        type: String,
        required: [true, 'Game genre is required'],
        enum: [
            'action',
            'adventure',
            'rpg',
            'strategy',
            'simulation',
            'sports',
            'racing',
            'puzzle',
            'horror',
            'mmo',
            'fps',
            'moba',
            'battle-royale',
            'indie'
        ]
    },
    platform: [{
        type: String,
        enum: ['pc', 'playstation', 'xbox', 'nintendo', 'mobile', 'vr']
    }],
    price: {
        type: Number,
        required: [true, 'Game price is required'],
        min: [0, 'Price cannot be negative']
    },
    discountPrice: {
        type: Number,
        min: [0, 'Discount price cannot be negative']
    },
    images: [{
        type: String
    }],
    trailer: {
        type: String
    },
    systemRequirements: {
        minimum: {
            os: String,
            processor: String,
            memory: String,
            graphics: String,
            storage: String
        },
        recommended: {
            os: String,
            processor: String,
            memory: String,
            graphics: String,
            storage: String
        }
    },
    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 }
    },
    tags: [{
        type: String,
        trim: true
    }],
    releaseDate: {
        type: Date
    },
    developer: {
        type: String,
        required: [true, 'Developer is required']
    },
    publisher: {
        type: String,
        required: [true, 'Publisher is required']
    },
    ageRating: {
        type: String,
        enum: ['E', 'E10+', 'T', 'M', 'AO', 'RP']
    },
    downloadSize: {
        type: String // e.g., "50 GB"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    salesCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for better search performance
gameSchema.index({ genre: 1, platform: 1, isActive: 1 });
gameSchema.index({ title: 'text', description: 'text', tags: 'text' });
gameSchema.index({ price: 1 });
gameSchema.index({ 'rating.average': -1 });

export default mongoose.model('Game', gameSchema);