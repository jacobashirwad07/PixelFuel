import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach',
        required: true
    },
    bookingType: {
        type: String,
        enum: ['service', 'coaching'],
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    scheduledTime: {
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        }
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    price: {
        basePrice: {
            type: Number,
            required: true
        },
        taxes: {
            type: Number,
            default: 0
        },
        totalPrice: {
            type: Number,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'refunded'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentDetails: {
        paymentId: String,
        orderId: String,
        signature: String,
        method: String,
        amount: Number
    },
    gameDetails: {
        gameName: String,
        platform: String,
        currentRank: String,
        targetRank: String,
        specialRequests: String
    },
    serviceDetails: {
        description: String,
        requirements: [String],
        location: {
            type: String,
            enum: ['online', 'home-visit', 'service-center'],
            default: 'online'
        },
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String
        }
    },
    notes: {
        userNotes: String,
        providerNotes: String,
        adminNotes: String
    },
    rating: {
        score: {
            type: Number,
            min: 1,
            max: 5
        },
        review: String,
        ratedAt: Date
    },
    cancellation: {
        cancelledBy: {
            type: String,
            enum: ['user', 'provider', 'admin']
        },
        reason: String,
        cancelledAt: Date,
        refundAmount: Number
    }
}, {
    timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ provider: 1, status: 1 });
bookingSchema.index({ scheduledDate: 1, status: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for booking reference number
bookingSchema.virtual('bookingRef').get(function() {
    return `PF${this._id.toString().slice(-8).toUpperCase()}`;
});

// Ensure virtual fields are serialized
bookingSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Booking', bookingSchema);