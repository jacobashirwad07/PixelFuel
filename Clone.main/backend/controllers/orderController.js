import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import razorpay from "../config/razorpay.js";

//config variables
const currency = "INR";
const deliveryCharge = 50;
const frontend_URL = 'https://mern-tomato-full-stack-food-delivery-0k15.onrender.com';

// Placing User Order for Frontend using Razorpay
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const totalAmount = req.body.amount + deliveryCharge;
        const options = {
            amount: totalAmount * 100, // amount in the smallest currency unit
            currency: currency,
            receipt: `order_rcptid_${newOrder._id}`,
            notes: {
                orderId: newOrder._id.toString(),
                userId: req.body.userId
            }
        };
        const order = await razorpay.orders.create(options);
        res.json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency, razorpayOrder: order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Placing User Order for Frontend using COD (no change)
const placeOrderCod = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }

}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        res.json({ success: false, message: "Not  Verified" })
    }

}

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod }
