import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/Service.js';
import connectDB from '../config/database.js';

dotenv.config();

const sampleServices = [
    {
        name: 'Valorant 1v1 Coaching',
        description: 'Professional Valorant coaching to improve your aim, game sense, and ranking. Learn advanced strategies and techniques from experienced players.',
        category: 'gaming-coaching',
        basePrice: 1500,
        duration: 60,
        tags: ['valorant', 'fps', 'coaching', 'aim-training', 'strategy'],
        requirements: ['Valorant account', 'Discord for communication', 'Screen sharing capability'],
        gameSpecific: {
            supportedGames: ['Valorant'],
            skillLevel: 'beginner'
        }
    },
    {
        name: 'Custom Gaming PC Build',
        description: 'Complete custom gaming PC build service with component selection, assembly, and optimization for maximum gaming performance.',
        category: 'pc-building',
        basePrice: 5000,
        duration: 240,
        tags: ['pc-building', 'custom-build', 'gaming-pc', 'assembly'],
        requirements: ['Component budget discussion', 'Performance requirements', 'Space measurements'],
        gameSpecific: {
            supportedGames: ['All PC Games'],
            skillLevel: 'professional'
        }
    },
    {
        name: 'PlayStation Console Repair',
        description: 'Professional PlayStation console repair service including hardware diagnosis, component replacement, and performance optimization.',
        category: 'console-repair',
        basePrice: 2500,
        duration: 120,
        tags: ['playstation', 'console-repair', 'hardware', 'diagnosis'],
        requirements: ['Console with power cable', 'Problem description', 'Warranty information'],
        gameSpecific: {
            supportedGames: ['PlayStation Games'],
            skillLevel: 'intermediate'
        }
    },
    {
        name: 'Streaming Setup & Configuration',
        description: 'Complete streaming setup including OBS configuration, audio optimization, lighting setup, and overlay design for content creators.',
        category: 'streaming-setup',
        basePrice: 3500,
        duration: 180,
        tags: ['streaming', 'obs', 'content-creation', 'setup'],
        requirements: ['PC/Console for streaming', 'Internet connection', 'Basic streaming equipment'],
        gameSpecific: {
            supportedGames: ['All Games'],
            skillLevel: 'intermediate'
        }
    },
    {
        name: 'League of Legends Coaching',
        description: 'Expert League of Legends coaching focusing on macro gameplay, champion mechanics, and climbing the ranked ladder.',
        category: 'gaming-coaching',
        basePrice: 1800,
        duration: 90,
        tags: ['league-of-legends', 'moba', 'coaching', 'ranked', 'strategy'],
        requirements: ['League of Legends account', 'Discord', 'Replay files'],
        gameSpecific: {
            supportedGames: ['League of Legends'],
            skillLevel: 'intermediate'
        }
    },
    {
        name: 'Gaming PC Optimization',
        description: 'Comprehensive gaming PC optimization service including driver updates, system cleanup, overclocking, and FPS optimization.',
        category: 'pc-optimization',
        basePrice: 2000,
        duration: 120,
        tags: ['optimization', 'fps-boost', 'overclocking', 'performance'],
        requirements: ['PC with admin access', 'System specifications', 'Performance issues description'],
        gameSpecific: {
            supportedGames: ['All PC Games'],
            skillLevel: 'advanced'
        }
    },
    {
        name: 'Esports Tournament Organization',
        description: 'Complete esports tournament organization service including bracket management, live streaming setup, and event coordination.',
        category: 'tournament-organization',
        basePrice: 15000,
        duration: 480,
        tags: ['tournament', 'esports', 'event-management', 'streaming'],
        requirements: ['Venue details', 'Participant count', 'Game selection', 'Prize pool information'],
        gameSpecific: {
            supportedGames: ['Valorant', 'League of Legends', 'CS:GO', 'PUBG'],
            skillLevel: 'professional'
        }
    },
    {
        name: 'CS:GO Aim Training & Coaching',
        description: 'Intensive CS:GO coaching focused on aim improvement, crosshair placement, and competitive gameplay strategies.',
        category: 'gaming-coaching',
        basePrice: 1200,
        duration: 60,
        tags: ['csgo', 'fps', 'aim-training', 'competitive'],
        requirements: ['CS:GO account', 'Steam account', 'Aim training maps'],
        gameSpecific: {
            supportedGames: ['CS:GO'],
            skillLevel: 'beginner'
        }
    }
];

const seedServices = async () => {
    try {
        await connectDB();
        
        // Clear existing services
        await Service.deleteMany({});
        console.log('Cleared existing services');
        
        // Insert sample services
        const services = await Service.insertMany(sampleServices);
        console.log(`Inserted ${services.length} sample services`);
        
        // Display inserted services
        services.forEach(service => {
            console.log(`- ${service.name} (${service.category}) - ₹${service.basePrice}`);
        });
        
        console.log('Service seeding completed successfully!');
        process.exit(0);
        
    } catch (error) {
        console.error('Service seeding failed:', error);
        process.exit(1);
    }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedServices();
}

export default seedServices;