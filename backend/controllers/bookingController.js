import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Coach from '../models/Coach.js';
import User from '../models/User.js';
import razorpay from '../config/razorpay.js';

// Create new booking
export const createBooking = async (req, res) => {
    try {
        const {
            serviceId,
            providerId,
            scheduledDate,
            scheduledTime,
            gameDetails,
            serviceDetails,
            userNotes
        } = req.body;

        // Validation
        if (!serviceId || !providerId || !scheduledDate || !scheduledTime) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required booking details'
            });
        }

        // Verify service exists
        const service = await Service.findById(serviceId);
        if (!service || !service.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Service not found or not available'
            });
        }

        // Verify provider exists and is available
        const provider = await Coach.findById(providerId).populate('user');
        if (!provider || !provider.isVerified || !provider.isAvailable) {
            return res.status(404).json({
                success: false,
                message: 'Provider not found or not available'
            });
        }

        // Check if provider offers this service
        const providerService = provider.services.find(
            s => s.service.toString() === serviceId
        );
        if (!providerService) {
            return res.status(400).json({
                success: false,
                message: 'Provider does not offer this service'
            });
        }

        // Calculate pricing
        const basePrice = providerService.customPrice || service.basePrice;
        const taxes = Math.round(basePrice * 0.18); // 18% GST
        const totalPrice = basePrice + taxes;

        // Check for scheduling conflicts
        const conflictingBooking = await Booking.findOne({
            provider: providerId,
            scheduledDate: new Date(scheduledDate),
            status: { $in: ['pending', 'confirmed', 'in-progress'] },
            $or: [
                {
                    'scheduledTime.start': { $lt: scheduledTime.end },
                    'scheduledTime.end': { $gt: scheduledTime.start }
                }
            ]
        });

        if (conflictingBooking) {
            return res.status(400).json({
                success: false,
                message: 'Provider is not available at the selected time'
            });
        }

        // Create booking
        const booking = new Booking({
            user: req.user._id,
            service: serviceId,
            provider: providerId,
            bookingType: service.category === 'gaming-coaching' ? 'coaching' : 'service',
            scheduledDate: new Date(scheduledDate),
            scheduledTime,
            duration: service.duration,
            price: {
                basePrice,
                taxes,
                totalPrice
            },
            gameDetails: gameDetails || {},
            serviceDetails: serviceDetails || {},
            notes: {
                userNotes: userNotes || ''
            }
        });

        await booking.save();

        // Populate booking details for response
        await booking.populate([
            { path: 'service', select: 'name category duration' },
            { path: 'provider', populate: { path: 'user', select: 'name email phone' } },
            { path: 'user', select: 'name email phone' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: { booking }
        });

    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create booking',
            error: error.message
        });
    }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
    try {
        const {
            status,
            bookingType,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter
        const filter = { user: req.user._id };
        if (status) filter.status = status;
        if (bookingType) filter.bookingType = bookingType;

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get bookings
        const bookings = await Booking.find(filter)
            .populate('service', 'name category duration image')
            .populate({
                path: 'provider',
                populate: { path: 'user', select: 'name avatar' },
                select: 'rating completedSessions'
            })
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        // Get total count
        const total = await Booking.countDocuments(filter);

        res.json({
            success: true,
            data: {
                bookings,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / limit),
                    totalBookings: total,
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: error.message
        });
    }
};

// Get provider bookings
export const getProviderBookings = async (req, res) => {
    try {
        // Find provider profile for current user
        const provider = await Coach.findOne({ user: req.user._id });
        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider profile not found'
            });
        }

        const {
            status,
            page = 1,
            limit = 10,
            sortBy = 'scheduledDate',
            sortOrder = 'asc'
        } = req.query;

        // Build filter
        const filter = { provider: provider._id };
        if (status) filter.status = status;

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get bookings
        const bookings = await Booking.find(filter)
            .populate('service', 'name category duration')
            .populate('user', 'name email phone avatar')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        // Get total count
        const total = await Booking.countDocuments(filter);

        res.json({
            success: true,
            data: {
                bookings,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / limit),
                    totalBookings: total,
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get provider bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch provider bookings',
            error: error.message
        });
    }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id)
            .populate('service')
            .populate({
                path: 'provider',
                populate: { path: 'user', select: 'name email phone avatar' }
            })
            .populate('user', 'name email phone avatar');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user has access to this booking
        const isUser = booking.user._id.toString() === req.user._id.toString();
        const provider = await Coach.findOne({ user: req.user._id });
        const isProvider = provider && booking.provider._id.toString() === provider._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isUser && !isProvider && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            data: { booking }
        });

    } catch (error) {
        console.error('Get booking by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking details',
            error: error.message
        });
    }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check permissions
        const provider = await Coach.findOne({ user: req.user._id });
        const isProvider = provider && booking.provider.toString() === provider._id.toString();
        const isUser = booking.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isProvider && !isUser && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Validate status transitions
        const validTransitions = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['in-progress', 'cancelled'],
            'in-progress': ['completed', 'cancelled'],
            'completed': [],
            'cancelled': ['refunded'],
            'refunded': []
        };

        if (!validTransitions[booking.status].includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot change status from ${booking.status} to ${status}`
            });
        }

        // Update booking
        booking.status = status;
        if (notes) {
            if (isProvider) {
                booking.notes.providerNotes = notes;
            } else if (isAdmin) {
                booking.notes.adminNotes = notes;
            }
        }

        await booking.save();

        // Update provider stats if booking completed
        if (status === 'completed' && provider) {
            provider.completedSessions += 1;
            await provider.save();
        }

        res.json({
            success: true,
            message: 'Booking status updated successfully',
            data: { booking }
        });

    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update booking status',
            error: error.message
        });
    }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking can be cancelled
        if (!['pending', 'confirmed'].includes(booking.status)) {
            return res.status(400).json({
                success: false,
                message: 'Booking cannot be cancelled at this stage'
            });
        }

        // Check permissions
        const provider = await Coach.findOne({ user: req.user._id });
        const isProvider = provider && booking.provider.toString() === provider._id.toString();
        const isUser = booking.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isProvider && !isUser && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Determine who cancelled
        let cancelledBy = 'admin';
        if (isUser) cancelledBy = 'user';
        else if (isProvider) cancelledBy = 'provider';

        // Calculate refund amount based on cancellation policy
        const now = new Date();
        const scheduledDateTime = new Date(booking.scheduledDate);
        const hoursUntilBooking = (scheduledDateTime - now) / (1000 * 60 * 60);

        let refundAmount = 0;
        if (hoursUntilBooking > 24) {
            refundAmount = booking.price.totalPrice; // Full refund
        } else if (hoursUntilBooking > 2) {
            refundAmount = booking.price.totalPrice * 0.5; // 50% refund
        }
        // No refund if less than 2 hours

        // Update booking
        booking.status = 'cancelled';
        booking.cancellation = {
            cancelledBy,
            reason: reason || 'No reason provided',
            cancelledAt: new Date(),
            refundAmount
        };

        await booking.save();

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            data: {
                booking,
                refundAmount
            }
        });

    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel booking',
            error: error.message
        });
    }
};

// Rate and review booking
export const rateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, review } = req.body;

        // Validation
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid rating (1-5)'
            });
        }

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user can rate this booking
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only rate your own bookings'
            });
        }

        // Check if booking is completed
        if (booking.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'You can only rate completed bookings'
            });
        }

        // Check if already rated
        if (booking.rating.score) {
            return res.status(400).json({
                success: false,
                message: 'Booking has already been rated'
            });
        }

        // Update booking rating
        booking.rating = {
            score: rating,
            review: review || '',
            ratedAt: new Date()
        };

        await booking.save();

        // Update provider's overall rating
        const provider = await Coach.findById(booking.provider);
        if (provider) {
            const allRatings = await Booking.find({
                provider: provider._id,
                'rating.score': { $exists: true }
            }).select('rating.score');

            const totalRatings = allRatings.length;
            const averageRating = allRatings.reduce((sum, b) => sum + b.rating.score, 0) / totalRatings;

            provider.rating = {
                average: Math.round(averageRating * 10) / 10,
                count: totalRatings
            };

            await provider.save();
        }

        res.json({
            success: true,
            message: 'Rating submitted successfully',
            data: { booking }
        });

    } catch (error) {
        console.error('Rate booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit rating',
            error: error.message
        });
    }
};