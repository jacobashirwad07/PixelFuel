import Service from '../models/Service.js';
import Coach from '../models/Coach.js';
import User from '../models/User.js';

// Get all services with filters
export const getServices = async (req, res) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            city,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 12
        } = req.query;

        // Build filter object
        const filter = { isActive: true };

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.basePrice = {};
            if (minPrice) filter.basePrice.$gte = Number(minPrice);
            if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query
        const services = await Service.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        // Get total count for pagination
        const total = await Service.countDocuments(filter);

        // Get available providers for each service
        const servicesWithProviders = await Promise.all(
            services.map(async (service) => {
                const providers = await Coach.find({
                    'services.service': service._id,
                    isVerified: true,
                    isAvailable: true
                }).populate('user', 'name avatar rating');

                return {
                    ...service.toObject(),
                    availableProviders: providers.length,
                    providers: providers.slice(0, 3) // Show top 3 providers
                };
            })
        );

        res.json({
            success: true,
            data: {
                services: servicesWithProviders,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(total / limit),
                    totalServices: total,
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch services',
            error: error.message
        });
    }
};

// Get service by ID with providers
export const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        if (!service.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Service is not available'
            });
        }

        // Get available providers for this service
        const providers = await Coach.find({
            'services.service': service._id,
            isVerified: true,
            isAvailable: true
        }).populate('user', 'name email phone avatar')
          .select('bio rating completedSessions gamingProfile availability pricing');

        res.json({
            success: true,
            data: {
                service,
                providers
            }
        });

    } catch (error) {
        console.error('Get service by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch service details',
            error: error.message
        });
    }
};

// Get service categories
export const getServiceCategories = async (req, res) => {
    try {
        const categories = [
            {
                id: 'gaming-coaching',
                name: 'Gaming Coaching',
                description: 'Professional esports coaching and skill improvement',
                icon: '🎮',
                services: ['1v1 Coaching', 'Team Training', 'Rank Boosting', 'Strategy Sessions']
            },
            {
                id: 'pc-building',
                name: 'PC Building',
                description: 'Custom gaming PC builds and hardware setup',
                icon: '🖥️',
                services: ['Custom Builds', 'Hardware Installation', 'Cable Management', 'Performance Testing']
            },
            {
                id: 'console-repair',
                name: 'Console Repair',
                description: 'Professional console and gaming hardware repair',
                icon: '🔧',
                services: ['PlayStation Repair', 'Xbox Repair', 'Controller Fix', 'Hardware Diagnosis']
            },
            {
                id: 'streaming-setup',
                name: 'Streaming Setup',
                description: 'Complete streaming and content creation setup',
                icon: '📹',
                services: ['OBS Configuration', 'Audio Setup', 'Lighting Setup', 'Overlay Design']
            },
            {
                id: 'pc-optimization',
                name: 'Gaming Optimization',
                description: 'Performance tuning and game optimization',
                icon: '⚡',
                services: ['FPS Optimization', 'Driver Updates', 'System Cleanup', 'Overclocking']
            },
            {
                id: 'tournament-organization',
                name: 'Tournament Organization',
                description: 'Local gaming tournaments and esports events',
                icon: '🏆',
                services: ['Event Planning', 'Bracket Management', 'Prize Distribution', 'Live Streaming']
            }
        ];

        // Get service counts for each category
        const categoriesWithCounts = await Promise.all(
            categories.map(async (category) => {
                const count = await Service.countDocuments({
                    category: category.id,
                    isActive: true
                });

                return {
                    ...category,
                    serviceCount: count
                };
            })
        );

        res.json({
            success: true,
            data: { categories: categoriesWithCounts }
        });

    } catch (error) {
        console.error('Get service categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch service categories',
            error: error.message
        });
    }
};

// Create new service (Admin only)
export const createService = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            basePrice,
            duration,
            tags,
            requirements,
            gameSpecific
        } = req.body;

        // Validation
        if (!name || !description || !category || !basePrice || !duration) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const service = new Service({
            name,
            description,
            category,
            basePrice,
            duration,
            tags: tags || [],
            requirements: requirements || [],
            gameSpecific: gameSpecific || {}
        });

        await service.save();

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: { service }
        });

    } catch (error) {
        console.error('Create service error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create service',
            error: error.message
        });
    }
};

// Update service (Admin only)
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const service = await Service.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.json({
            success: true,
            message: 'Service updated successfully',
            data: { service }
        });

    } catch (error) {
        console.error('Update service error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update service',
            error: error.message
        });
    }
};

// Delete service (Admin only)
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.json({
            success: true,
            message: 'Service deleted successfully'
        });

    } catch (error) {
        console.error('Delete service error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete service',
            error: error.message
        });
    }
};