/**
 * Improved LoginPopup:
 * - Better login logic: checks all users in localStorage
 * - Enhanced OTP modal: checkmark on success, better UI
 * - Improved Login/Sign Up switcher styling
 */
import React, { useContext, useState, useEffect } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import { toast } from 'react-toastify'

const DUMMY_EMAIL = 'demo@demo.com';
const DUMMY_PASSWORD = 'demo1234';

const LoginPopup = ({ setShowLogin }) => {
    const { setToken, loadCartData } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({ name: "", email: DUMMY_EMAIL, password: DUMMY_PASSWORD })
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [enteredOtp, setEnteredOtp] = useState("");
    const [pendingToken, setPendingToken] = useState("");
    const [pendingUser, setPendingUser] = useState(null);
    const [otpSuccess, setOtpSuccess] = useState(false);

    useEffect(() => {
        if (currState === "Login") {
            setData({ name: "", email: DUMMY_EMAIL, password: DUMMY_PASSWORD });
        } else {
            setData({ name: "", email: "", password: "" });
        }
    }, [currState]);

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

    // Demo: Store users in localStorage
    const saveUser = (user) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    };
    const findUser = (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(u => u.email === email && u.password === password);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (currState === "Login") {
            // Check localStorage for user (including demo)
            const user = findUser(data.email, data.password);
            if (user || (data.email === DUMMY_EMAIL && data.password === DUMMY_PASSWORD)) {
                // OTP flow for login
                const generatedOtp = generateOtp();
                setOtp(generatedOtp);
                setShowOtpModal(true);
                setPendingToken((user ? user.email : data.email) + "-token");
            } else {
                toast.error("Invalid credentials or user not found.");
            }
        } else {
            // Sign Up: Save user, then OTP
            if (!data.name || !data.email || !data.password) {
                toast.error("Please fill all fields.");
                return;
            }
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => u.email === data.email)) {
                toast.error("User already exists. Please login.");
                return;
            }
            setPendingUser(data);
            const generatedOtp = generateOtp();
            setOtp(generatedOtp);
            setShowOtpModal(true);
        }
    }

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (enteredOtp === otp) {
            setOtpSuccess(true);
            setTimeout(() => {
                if (currState === "Login") {
                    setToken(pendingToken);
                    localStorage.setItem("token", pendingToken);
                    loadCartData({ token: pendingToken });
                    setShowLogin(false);
                } else {
                    // Save user and log in
                    saveUser(pendingUser);
                    setToken(pendingUser.email + "-token");
                    localStorage.setItem("token", pendingUser.email + "-token");
                    loadCartData({ token: pendingUser.email + "-token" });
                    setShowLogin(false);
                }
                setShowOtpModal(false);
                setEnteredOtp("");
                setOtp("");
                setPendingToken("");
                setPendingUser(null);
                setOtpSuccess(false);
            }, 1200);
        } else {
            toast.error("Invalid OTP. Please try again.");
        }
    };

    // Expose setShowLogin globally for Services login prompt
    useEffect(() => {
        window.setShowLogin = setShowLogin;
    }, [setShowLogin]);

    return (
        <div className='login-popup'>
            <form onSubmit={onSubmit} className="login-popup-container">
                <div className="login-popup-switcher">
                  <button type="button" className={currState === "Login" ? "active" : ""} onClick={() => setCurrState("Login")}>Login</button>
                  <button type="button" className={currState === "Sign Up" ? "active" : ""} onClick={() => setCurrState("Sign Up")}>Sign Up</button>
                </div>
                <div className="login-popup-title">
                    <h2>{currState}</h2> <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                {currState === "Login" && (
                  <div className="login-demo-credentials">
                    <p style={{color:'#FF4C24',marginBottom:8}}><b>Demo Login:</b></p>
                    <p style={{fontSize:'0.98rem',margin:0}}>Email: <b>{DUMMY_EMAIL}</b></p>
                    <p style={{fontSize:'0.98rem',margin:0}}>Password: <b>{DUMMY_PASSWORD}</b></p>
                  </div>
                )}
                <div className="login-popup-inputs">
                    {currState === "Sign Up" ? <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required /> : <></>}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                <button type="submit">{currState === "Login" ? "Login" : "Create account"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" name="" id="" required />
                    <p>By continuing, i agree to the terms of use & privacy policy.</p>
                </div>
            </form>
            {showOtpModal && (
                <div className="otp-modal-overlay">
                    <div className="otp-modal">
                        <h3>OTP Verification</h3>
                        <p>We have sent an OTP to your email.<br /><b>Demo OTP: {otp}</b></p>
                        {otpSuccess ? (
                          <div className="otp-success">
                            <span className="otp-check">✔️</span>
                            <p>Verified!</p>
                          </div>
                        ) : (
                        <form onSubmit={handleOtpSubmit} className="otp-form">
                            <input
                                type="text"
                                value={enteredOtp}
                                onChange={e => setEnteredOtp(e.target.value)}
                                placeholder="Enter OTP"
                                maxLength={6}
                                required
                            />
                            <button type="submit">Verify OTP</button>
                        </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default LoginPopup
