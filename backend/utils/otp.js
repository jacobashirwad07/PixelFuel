import nodemailer from 'nodemailer';

// Generate 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send OTP via email
export const sendOTPEmail = async (email, otp) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('Email configuration not found, skipping OTP email');
            return;
        }

        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Gaming Account - PixelFuel',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; border-radius: 20px; overflow: hidden;">
                    <div style="padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; font-size: 2.5rem; margin-bottom: 10px;">🎮 PixelFuel</h1>
                        <h2 style="color: #e3f2fd; margin-bottom: 30px;">Verify Your Gaming Account</h2>
                        <p style="font-size: 1.1rem; margin-bottom: 30px; opacity: 0.9;">Welcome to the ultimate gaming services marketplace!</p>
                        
                        <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 15px; margin: 30px 0; border: 2px solid rgba(0, 123, 255, 0.3);">
                            <p style="margin-bottom: 15px; font-size: 1rem;">Your verification code is:</p>
                            <h1 style="color: #007bff; font-size: 3rem; margin: 0; text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); letter-spacing: 5px;">${otp}</h1>
                        </div>
                        
                        <p style="margin-bottom: 20px; opacity: 0.8;">This code will expire in 10 minutes.</p>
                        <p style="font-size: 0.9rem; opacity: 0.7;">Ready to level up your gaming experience? Let's get started!</p>
                    </div>
                    
                    <div style="background: rgba(0, 0, 0, 0.2); padding: 20px; text-align: center;">
                        <p style="color: #999; font-size: 12px; margin: 0;">
                            This is an automated email from PixelFuel Gaming Services. Please do not reply to this message.
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Gaming OTP email sent successfully to:', email);
    } catch (error) {
        console.error('Failed to send gaming OTP email:', error.message);
        throw error;
    }
};