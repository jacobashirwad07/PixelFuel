// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

// Phone validation (10-digit Indian phone number)
export const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};

// Password validation
export const validatePassword = (password) => {
    return password && password.length >= 6;
};

// Name validation
export const validateName = (name) => {
    return name && name.trim().length >= 2 && name.trim().length <= 50;
};

// Gaming-specific validations
export const validateGameTitle = (title) => {
    return title && title.trim().length >= 2 && title.trim().length <= 100;
};

export const validateRank = (rank) => {
    const validRanks = [
        // Valorant ranks
        'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Immortal', 'Radiant',
        // League of Legends ranks
        'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Challenger',
        // CS:GO ranks
        'Silver', 'Gold Nova', 'Master Guardian', 'Distinguished Master Guardian', 'Legendary Eagle', 'Supreme', 'Global Elite'
    ];
    return validRanks.some(validRank => rank.toLowerCase().includes(validRank.toLowerCase()));
};

export const validatePlatform = (platform) => {
    const validPlatforms = ['pc', 'playstation', 'xbox', 'nintendo-switch', 'mobile', 'vr'];
    return validPlatforms.includes(platform.toLowerCase());
};