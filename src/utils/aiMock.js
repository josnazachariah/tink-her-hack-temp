/**
 * Mock utility to simulate an AI analyzing an issue report.
 */

const KEYWORDS = {
    high: ['urgent', 'danger', 'accident', 'fire', 'leak', 'broken pipe', 'flood', 'power outage', 'live wire', 'deep pothole', 'crash'],
    medium: ['pothole', 'street light', 'streetlight', 'garbage', 'trash', 'litter', 'sign', 'graffiti', 'damage'],
    low: ['paint', 'weeds', 'grass', 'bench', 'minor', 'sidewalk crack']
};

const DESCRIPTIONS = {
    roads: "There is a significant issue with the road surface here. It's causing traffic delays and posing a safety hazard to vehicles and pedestrians alike. Immediate repair is requested to prevent further deterioration.",
    waste: "A large accumulation of uncollected waste has been observed here. This is creating unsanitary conditions and attracting pests. Regular collection needs to be reinstated or a cleanup crew dispatched.",
    water: "I've noticed a persistent leak/issue with the local water infrastructure. Clean water is being wasted and it could potentially damage the surrounding area. Please investigate and repair.",
    lights: "The street lighting in this area is malfunctioning or absent. This makes the area feel unsafe at night and reduces visibility for drivers. Please replace the bulbs or check the power supply.",
    parks: "The public park/green space here requires maintenance. Overgrown vegetation or broken facilities are making it difficult for the community to enjoy this space.",
    general: "I am reporting a public utility issue that needs attention from the city authorities. Please review the attached details and provide a timeline for resolution."
};

export async function suggestDescription(title) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const t = title.toLowerCase();

    if (t.includes('road') || t.includes('pothole') || t.includes('infrastructure')) return DESCRIPTIONS.roads;
    if (t.includes('trash') || t.includes('garbage') || t.includes('waste')) return DESCRIPTIONS.waste;
    if (t.includes('water') || t.includes('pipe') || t.includes('leak')) return DESCRIPTIONS.water;
    if (t.includes('light') || t.includes('power') || t.includes('electricity')) return DESCRIPTIONS.lights;
    if (t.includes('park') || t.includes('tree') || t.includes('garden')) return DESCRIPTIONS.parks;

    return DESCRIPTIONS.general;
}

export async function analyzeIssueAI(imageFile, description, location, title = '') {
    // Simulate network delay for AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const textMatches = (title + ' ' + description).toLowerCase() + ' ' + (location || '').toLowerCase();

    let priority = 'Low';
    let category = 'Other';

    // Determine priority based on keywords
    if (KEYWORDS.high.some(word => textMatches.includes(word))) {
        priority = 'High';
    } else if (KEYWORDS.medium.some(word => textMatches.includes(word))) {
        priority = 'Medium';
    }

    // Determine suggested category
    if (textMatches.includes('water') || textMatches.includes('pipe') || textMatches.includes('leak')) {
        category = 'Water & Sanitation';
    } else if (textMatches.includes('road') || textMatches.includes('pothole') || textMatches.includes('street')) {
        category = 'Roads & Infrastructure';
    } else if (textMatches.includes('trash') || textMatches.includes('garbage') || textMatches.includes('waste')) {
        category = 'Waste Management';
    } else if (textMatches.includes('light') || textMatches.includes('power') || textMatches.includes('wire')) {
        category = 'Street Lighting';
    } else if (textMatches.includes('park') || textMatches.includes('tree') || textMatches.includes('grass')) {
        category = 'Public Parks';
    }

    // If there's an image, simulated "vision" AI detection
    if (imageFile) {
        // Boost priority if it was low
        if (priority === 'Low') priority = 'Medium';

        // If the description was vague but image is present, attempt better categorization
        if (category === 'Other') {
            // In a real app, we'd use a vision model here.
            // Mocking: If image exists and title has vague keywords, we switch to most likely category
            if (textMatches.includes('issue') || textMatches.includes('fix')) {
                category = 'Roads & Infrastructure'; // Default guess for images
            }
        }
    }

    return { priority, category };
}
