import Razorpay from 'razorpay';

// Use dummy keys for development if real keys are not provided
const razorpayConfig = {
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret_for_development'
};

const razorpay = new Razorpay(razorpayConfig);

export default razorpay;