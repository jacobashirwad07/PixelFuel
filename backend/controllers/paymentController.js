import razorpay from '../config/razorpay.js';
import Booking from '../models/Booking.js';
import crypto from 'crypto';

// Create Razorpay order
export const createPaymentOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;

        // Find booking
        const booking = await Booking.findById(bookingId)
            .populate('service', 'name')
            .populate('user', 'name email');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user owns this booking
        if (booking.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Check if booking is in correct status
        if (booking.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Booking is not in a payable state'
            });
        }

        // Check if already paid
        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already paid'
            });
        }

        // Check if we're in development mode with dummy keys
        const isDevelopment = process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy_key_id';
        
        let order;
        if (isDevelopment) {
            // Create a mock order for development
            order = {
                id: `order_${Date.now()}`,
                amount: booking.price.totalPrice * 100,
                currency: 'INR',
                status: 'created'
            };
        } else {
            // Create actual Razorpay order
            const options = {
                amount: booking.price.totalPrice * 100, // Amount in paise
                currency: 'INR',
                receipt: `booking_${booking._id}`,
                notes: {
                    bookingId: booking._id.toString(),
                    userId: booking.user._id.toString(),
                    serviceName: booking.service.name
                }
            };

            order = await razorpay.orders.create(options);
        }

        // Update booking with order details
        booking.paymentDetails.orderId = order.id;
        booking.paymentDetails.amount = booking.price.totalPrice;
        await booking.save();

        res.json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                isDevelopment,
                booking: {
                    id: booking._id,
                    bookingRef: booking.bookingRef,
                    serviceName: booking.service.name,
                    totalPrice: booking.price.totalPrice
                }
            }
        });

    } catch (error) {
        console.error('Create payment order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message
        });
    }
};

// Verify payment
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingId,
            isDevelopment
        } = req.body;

        // Find booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        let paymentVerified = false;

        if (isDevelopment || process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy_key_id') {
            // In development mode, automatically verify payment
            paymentVerified = true;
        } else {
            // Verify signature for production
            const body = razorpay_order_id + '|' + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');

            paymentVerified = expectedSignature === razorpay_signature;
        }

        if (!paymentVerified) {
            // Payment verification failed
            booking.paymentStatus = 'failed';
            booking.paymentDetails.paymentId = razorpay_payment_id || 'dev_payment_failed';
            booking.paymentDetails.signature = razorpay_signature || 'dev_signature';
            await booking.save();

            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        // Payment successful
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
        booking.paymentDetails.paymentId = razorpay_payment_id || `dev_payment_${Date.now()}`;
        booking.paymentDetails.signature = razorpay_signature || 'dev_signature';
        booking.paymentDetails.method = isDevelopment ? 'development' : 'razorpay';
        await booking.save();

        // Populate booking details for response
        await booking.populate([
            { path: 'service', select: 'name category' },
            { path: 'provider', populate: { path: 'user', select: 'name email phone' } }
        ]);

        res.json({
            success: true,
            message: 'Payment verified successfully',
            data: { booking }
        });

    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
};

// Handle payment failure
export const handlePaymentFailure = async (req, res) => {
    try {
        const { bookingId, error } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Update payment status
        booking.paymentStatus = 'failed';
        booking.notes.adminNotes = `Payment failed: ${error?.description || 'Unknown error'}`;
        await booking.save();

        res.json({
            success: true,
            message: 'Payment failure recorded'
        });

    } catch (error) {
        console.error('Handle payment failure error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to handle payment failure',
            error: error.message
        });
    }
};

// Get payment history
export const getPaymentHistory = async (req, res) => {
    try {
        const {
            status,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter
        const filter = { user: req.user._id };
        if (status) filter.paymentStatus = status;

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get payment history
        const payments = await Booking.find(filter)
            .populate('service', 'name category')
            .populate({
                path: 'provider',
                populate: { path: 'user', select: 'name' }
            })
            .select('paymentDetails price status paymentStatus createdAt bookingRef')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        // Get total count
        const total = await Booking.countDocuments(filter);

        res.json({
            success: true,
            data: {
                payments,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / limit),
                    totalPayments: total,
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment history',
            error: error.message
        });
    }
};

// Process refund
export const processRefund = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { refundAmount, reason } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking is eligible for refund
        if (booking.paymentStatus !== 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Booking payment is not in a refundable state'
            });
        }

        if (booking.status !== 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking must be cancelled before refund'
            });
        }

        // Process refund through Razorpay
        const refund = await razorpay.payments.refund(booking.paymentDetails.paymentId, {
            amount: refundAmount * 100, // Amount in paise
            notes: {
                reason: reason || 'Booking cancellation',
                bookingId: booking._id.toString()
            }
        });

        // Update booking
        booking.paymentStatus = 'refunded';
        booking.cancellation.refundAmount = refundAmount;
        booking.notes.adminNotes = `Refund processed: ₹${refundAmount}`;
        await booking.save();

        res.json({
            success: true,
            message: 'Refund processed successfully',
            data: {
                refundId: refund.id,
                refundAmount,
                booking
            }
        });

    } catch (error) {
        console.error('Process refund error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process refund',
            error: error.message
        });
    }
};