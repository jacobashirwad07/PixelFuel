import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy data
const services = [
    {
        _id: '1',
        name: '1v1 Gaming Coaching',
        description: 'Personalized gaming coaching to improve your skills',
        basePrice: 1500,
        duration: 60,
        category: 'gaming-coaching',
        tags: ['coaching', 'skill-improvement', 'personalized'],
        availableProviders: 5,
        image: 'https://via.placeholder.com/300x200?text=Gaming+Coaching'
    },
    {
        _id: '2',
        name: 'Custom PC Build',
        description: 'Professional custom gaming PC assembly and setup',
        basePrice: 5000,
        duration: 180,
        category: 'pc-building',
        tags: ['custom-build', 'assembly', 'setup'],
        availableProviders: 3,
        image: 'https://via.placeholder.com/300x200?text=PC+Build'
    },
    {
        _id: '3',
        name: 'Console Repair Service',
        description: 'Expert repair for PlayStation, Xbox, and other consoles',
        basePrice: 2000,
        duration: 120,
        category: 'console-repair',
        tags: ['repair', 'console', 'hardware'],
        availableProviders: 4,
        image: 'https://via.placeholder.com/300x200?text=Console+Repair'
    },
    {
        _id: '4',
        name: 'Streaming Setup',
        description: 'Complete streaming setup with OBS and equipment configuration',
        basePrice: 3000,
        duration: 90,
        category: 'streaming-setup',
        tags: ['streaming', 'obs', 'setup'],
        availableProviders: 2,
        image: 'https://via.placeholder.com/300x200?text=Streaming+Setup'
    },
    {
        _id: '5',
        name: 'Gaming Performance Optimization',
        description: 'Optimize your PC for maximum gaming performance',
        basePrice: 1200,
        duration: 45,
        category: 'pc-optimization',
        tags: ['optimization', 'performance', 'fps'],
        availableProviders: 6,
        image: 'https://via.placeholder.com/300x200?text=PC+Optimization'
    },
    {
        _id: '6',
        name: 'Tournament Organization',
        description: 'Professional esports tournament planning and management',
        basePrice: 10000,
        duration: 480,
        category: 'tournament-organization',
        tags: ['tournament', 'esports', 'management'],
        availableProviders: 2,
        image: 'https://via.placeholder.com/300x200?text=Tournament'
    }
];

const coaches = [
    {
        _id: 'coach1',
        name: 'Alex "ProGamer" Johnson',
        specialization: 'FPS Games',
        experience: '5 years',
        rating: 4.9,
        hourlyRate: 2000,
        games: ['Valorant', 'CS:GO', 'Apex Legends'],
        bio: 'Former professional esports player with tournament wins',
        image: 'https://via.placeholder.com/150x150?text=Alex',
        availability: 'Mon-Fri 6PM-10PM'
    },
    {
        _id: 'coach2',
        name: 'Sarah "StratMaster" Chen',
        specialization: 'MOBA Games',
        experience: '4 years',
        rating: 4.8,
        hourlyRate: 1800,
        games: ['League of Legends', 'Dota 2', 'Heroes of the Storm'],
        bio: 'Strategic gameplay expert and team coordination specialist',
        image: 'https://via.placeholder.com/150x150?text=Sarah',
        availability: 'Tue-Thu 7PM-11PM'
    },
    {
        _id: 'coach3',
        name: 'Mike "RankClimber" Rodriguez',
        specialization: 'Battle Royale',
        experience: '3 years',
        rating: 4.7,
        hourlyRate: 1500,
        games: ['Fortnite', 'PUBG', 'Warzone'],
        bio: 'Specializes in helping players climb competitive ranks',
        image: 'https://via.placeholder.com/150x150?text=Mike',
        availability: 'Daily 8PM-12AM'
    },
    {
        _id: 'coach4',
        name: 'Emma "TechGuru" Wilson',
        specialization: 'PC Optimization',
        experience: '6 years',
        rating: 4.9,
        hourlyRate: 2200,
        games: ['Hardware Setup', 'Performance Tuning', 'Streaming'],
        bio: 'Hardware and software optimization expert',
        image: 'https://via.placeholder.com/150x150?text=Emma',
        availability: 'Mon-Wed 5PM-9PM'
    }
];

// In-memory cart storage (in production, use database)
const userCarts = {};

// Test users for login
const testUsers = [
    {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        phone: '1234567890',
        role: 'user'
    },
    {
        email: 'admin@pixelfuel.com',
        password: 'admin123',
        name: 'Admin User',
        phone: '9876543210',
        role: 'admin'
    },
    {
        email: 'coach@pixelfuel.com',
        password: 'coach123',
        name: 'Gaming Coach',
        phone: '5555555555',
        role: 'coach'
    },
    {
        email: 'gamer@example.com',
        password: 'gamer123',
        name: 'Pro Gamer',
        phone: '1111111111',
        role: 'user'
    }
];

// Test routes
app.get('/api/health', (req, res) => {
    res.json({ message: 'PixelFuel Gaming Services API is running!' });
});

app.post('/api/auth/register', (req, res) => {
    console.log('Register request body:', req.body);
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
        });
    }

    res.status(201).json({
        success: true,
        message: 'User registered successfully (test mode)',
        data: {
            user: { name, email, phone, role: 'user' },
            token: 'test-token-123'
        }
    });
});

app.post('/api/auth/login', (req, res) => {
    console.log('Login request body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email and password'
        });
    }

    console.log('Looking for user with email:', email);
    console.log('Available test users:', testUsers.map(u => u.email));

    // Check if user exists in test users
    const user = testUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
        console.log('User not found or password incorrect');
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password. Try: test@example.com / password123'
        });
    }

    console.log('Login successful for user:', user.name);
    res.json({
        success: true,
        message: 'Login successful (test mode)',
        data: {
            user: { 
                name: user.name,
                email: user.email, 
                phone: user.phone,
                role: user.role 
            },
            token: 'test-token-123'
        }
    });
});

// Services routes
app.get('/api/services', (req, res) => {
    const { category, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    let filteredServices = [...services];

    // Filter by category
    if (category && category !== 'all') {
        filteredServices = filteredServices.filter(service => service.category === category);
    }

    // Filter by search
    if (search) {
        filteredServices = filteredServices.filter(service => 
            service.name.toLowerCase().includes(search.toLowerCase()) ||
            service.description.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Filter by price range
    if (minPrice) {
        filteredServices = filteredServices.filter(service => service.basePrice >= parseInt(minPrice));
    }
    if (maxPrice) {
        filteredServices = filteredServices.filter(service => service.basePrice <= parseInt(maxPrice));
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedServices = filteredServices.slice(startIndex, endIndex);

    res.json({
        success: true,
        data: {
            services: paginatedServices,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(filteredServices.length / limit),
                totalServices: filteredServices.length,
                hasNext: endIndex < filteredServices.length,
                hasPrev: page > 1
            }
        }
    });
});

app.get('/api/services/:id', (req, res) => {
    const service = services.find(s => s._id === req.params.id);
    if (!service) {
        return res.status(404).json({
            success: false,
            message: 'Service not found'
        });
    }
    res.json({
        success: true,
        data: service
    });
});

// Coaches routes
app.get('/api/coaches', (req, res) => {
    const { specialization, minRate, maxRate } = req.query;
    let filteredCoaches = [...coaches];

    if (specialization) {
        filteredCoaches = filteredCoaches.filter(coach => 
            coach.specialization.toLowerCase().includes(specialization.toLowerCase())
        );
    }

    if (minRate) {
        filteredCoaches = filteredCoaches.filter(coach => coach.hourlyRate >= parseInt(minRate));
    }

    if (maxRate) {
        filteredCoaches = filteredCoaches.filter(coach => coach.hourlyRate <= parseInt(maxRate));
    }

    res.json({
        success: true,
        data: filteredCoaches
    });
});

app.get('/api/coaches/:id', (req, res) => {
    const coach = coaches.find(c => c._id === req.params.id);
    if (!coach) {
        return res.status(404).json({
            success: false,
            message: 'Coach not found'
        });
    }
    res.json({
        success: true,
        data: coach
    });
});

// Cart routes
app.get('/api/cart/:userId', (req, res) => {
    const { userId } = req.params;
    const cart = userCarts[userId] || { items: [], total: 0 };
    res.json({
        success: true,
        data: cart
    });
});

app.post('/api/cart/:userId/add', (req, res) => {
    const { userId } = req.params;
    const { serviceId, coachId, quantity = 1 } = req.body;

    if (!userCarts[userId]) {
        userCarts[userId] = { items: [], total: 0 };
    }

    let item;
    if (serviceId) {
        const service = services.find(s => s._id === serviceId);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }
        item = {
            id: serviceId,
            type: 'service',
            name: service.name,
            price: service.basePrice,
            quantity,
            image: service.image
        };
    } else if (coachId) {
        const coach = coaches.find(c => c._id === coachId);
        if (!coach) {
            return res.status(404).json({
                success: false,
                message: 'Coach not found'
            });
        }
        item = {
            id: coachId,
            type: 'coaching',
            name: `Coaching with ${coach.name}`,
            price: coach.hourlyRate,
            quantity,
            image: coach.image
        };
    }

    // Check if item already exists
    const existingItemIndex = userCarts[userId].items.findIndex(
        cartItem => cartItem.id === item.id && cartItem.type === item.type
    );

    if (existingItemIndex > -1) {
        userCarts[userId].items[existingItemIndex].quantity += quantity;
    } else {
        userCarts[userId].items.push(item);
    }

    // Recalculate total
    userCarts[userId].total = userCarts[userId].items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
    );

    res.json({
        success: true,
        message: 'Item added to cart',
        data: userCarts[userId]
    });
});

app.delete('/api/cart/:userId/remove/:itemId', (req, res) => {
    const { userId, itemId } = req.params;
    const { type } = req.query;

    if (!userCarts[userId]) {
        return res.status(404).json({
            success: false,
            message: 'Cart not found'
        });
    }

    userCarts[userId].items = userCarts[userId].items.filter(
        item => !(item.id === itemId && item.type === type)
    );

    // Recalculate total
    userCarts[userId].total = userCarts[userId].items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
    );

    res.json({
        success: true,
        message: 'Item removed from cart',
        data: userCarts[userId]
    });
});

app.post('/api/cart/:userId/checkout', (req, res) => {
    const { userId } = req.params;
    const { paymentMethod, address } = req.body;

    if (!userCarts[userId] || userCarts[userId].items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Cart is empty'
        });
    }

    const orderId = `ORDER_${Date.now()}`;
    const order = {
        orderId,
        userId,
        items: userCarts[userId].items,
        total: userCarts[userId].total,
        paymentMethod,
        address,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    // Clear cart after checkout
    userCarts[userId] = { items: [], total: 0 };

    res.json({
        success: true,
        message: 'Order placed successfully!',
        data: order
    });
});

app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});