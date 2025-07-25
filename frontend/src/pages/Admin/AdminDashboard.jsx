import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBookings: 0,
        totalRevenue: 0,
        activeServices: 0,
        pendingBookings: 0,
        completedBookings: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch dashboard stats (mock data for now)
            const mockStats = {
                totalUsers: 1250,
                totalBookings: 485,
                totalRevenue: 125000,
                activeServices: 8,
                pendingBookings: 23,
                completedBookings: 412
            };

            const mockRecentBookings = [
                {
                    _id: '1',
                    bookingRef: 'PF001234',
                    service: { name: 'Valorant Coaching', category: 'gaming-coaching' },
                    user: { name: 'Arjun Sharma' },
                    provider: { user: { name: 'Pro Gamer Coach' } },
                    scheduledDate: new Date().toISOString(),
                    price: { totalPrice: 1500 },
                    status: 'confirmed',
                    createdAt: new Date().toISOString()
                },
                {
                    _id: '2',
                    bookingRef: 'PF001235',
                    service: { name: 'Custom PC Build', category: 'pc-building' },
                    user: { name: 'Rahul Patel' },
                    provider: { user: { name: 'PC Builder Pro' } },
                    scheduledDate: new Date().toISOString(),
                    price: { totalPrice: 5000 },
                    status: 'pending',
                    createdAt: new Date().toISOString()
                },
                {
                    _id: '3',
                    bookingRef: 'PF001236',
                    service: { name: 'Console Repair', category: 'console-repair' },
                    user: { name: 'Priya Singh' },
                    provider: { user: { name: 'Console Expert' } },
                    scheduledDate: new Date().toISOString(),
                    price: { totalPrice: 2500 },
                    status: 'completed',
                    createdAt: new Date().toISOString()
                }
            ];

            setStats(mockStats);
            setRecentBookings(mockRecentBookings);

        } catch (error) {
            console.error('Fetch dashboard data error:', error);
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': '#ffc107',
            'confirmed': '#007bff',
            'in-progress': '#17a2b8',
            'completed': '#28a745',
            'cancelled': '#dc3545'
        };
        return colors[status] || '#6c757d';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <h1>🎮 Admin Dashboard</h1>
                    <p>PixelFuel Gaming Services Management</p>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <h3>{stats.totalUsers.toLocaleString()}</h3>
                            <p>Total Users</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-content">
                            <h3>{stats.totalBookings.toLocaleString()}</h3>
                            <p>Total Bookings</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-content">
                            <h3>{formatCurrency(stats.totalRevenue)}</h3>
                            <p>Total Revenue</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🎮</div>
                        <div className="stat-content">
                            <h3>{stats.activeServices}</h3>
                            <p>Active Services</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-content">
                            <h3>{stats.pendingBookings}</h3>
                            <p>Pending Bookings</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <h3>{stats.completedBookings}</h3>
                            <p>Completed Bookings</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="dashboard-content">
                    <div className="recent-bookings">
                        <div className="section-header">
                            <h2>Recent Bookings</h2>
                            <button className="btn btn-outline">View All</button>
                        </div>

                        <div className="bookings-table">
                            <div className="table-header">
                                <div className="header-cell">Booking</div>
                                <div className="header-cell">Service</div>
                                <div className="header-cell">Customer</div>
                                <div className="header-cell">Provider</div>
                                <div className="header-cell">Amount</div>
                                <div className="header-cell">Status</div>
                                <div className="header-cell">Date</div>
                            </div>

                            {recentBookings.map(booking => (
                                <div key={booking._id} className="table-row">
                                    <div className="table-cell">
                                        <div className="booking-ref">#{booking.bookingRef}</div>
                                    </div>
                                    <div className="table-cell">
                                        <div className="service-info">
                                            <div className="service-name">{booking.service.name}</div>
                                            <div className="service-category">
                                                {booking.service.category.replace('-', ' ')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-cell">
                                        <div className="user-name">{booking.user.name}</div>
                                    </div>
                                    <div className="table-cell">
                                        <div className="provider-name">{booking.provider.user.name}</div>
                                    </div>
                                    <div className="table-cell">
                                        <div className="amount">{formatCurrency(booking.price.totalPrice)}</div>
                                    </div>
                                    <div className="table-cell">
                                        <div
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(booking.status) }}
                                        >
                                            {booking.status.replace('-', ' ').toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="table-cell">
                                        <div className="date">{formatDate(booking.createdAt)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <h2>Quick Actions</h2>

                        <div className="action-buttons">
                            <button className="action-btn">
                                <div className="action-icon">➕</div>
                                <div className="action-text">
                                    <h4>Add Service</h4>
                                    <p>Create new gaming service</p>
                                </div>
                            </button>

                            <button className="action-btn">
                                <div className="action-icon">👨‍💻</div>
                                <div className="action-text">
                                    <h4>Manage Providers</h4>
                                    <p>View and verify providers</p>
                                </div>
                            </button>

                            <button className="action-btn">
                                <div className="action-icon">📊</div>
                                <div className="action-text">
                                    <h4>View Reports</h4>
                                    <p>Analytics and insights</p>
                                </div>
                            </button>

                            <button className="action-btn">
                                <div className="action-icon">⚙️</div>
                                <div className="action-text">
                                    <h4>Settings</h4>
                                    <p>Platform configuration</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="performance-section">
                    <h2>Performance Overview</h2>

                    <div className="metrics-grid">
                        <div className="metric-card">
                            <h4>Booking Success Rate</h4>
                            <div className="metric-value">94.2%</div>
                            <div className="metric-trend positive">+2.1% from last month</div>
                        </div>

                        <div className="metric-card">
                            <h4>Average Rating</h4>
                            <div className="metric-value">4.7⭐</div>
                            <div className="metric-trend positive">+0.2 from last month</div>
                        </div>

                        <div className="metric-card">
                            <h4>Provider Response Time</h4>
                            <div className="metric-value">2.3 hrs</div>
                            <div className="metric-trend negative">+0.5 hrs from last month</div>
                        </div>

                        <div className="metric-card">
                            <h4>Customer Satisfaction</h4>
                            <div className="metric-value">96.8%</div>
                            <div className="metric-trend positive">+1.4% from last month</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;