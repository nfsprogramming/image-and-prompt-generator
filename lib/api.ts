export interface ImageGenerationResponse {
    url: string;
    prompt: string;
    seed: number;
}

export const generateImage = async (prompt: string, seed: number, model: string = 'nano-banana-pro'): Promise<string> => {
    // Pollinations.ai URL structure
    // Endpoint: https://image.pollinations.ai/prompt/[prompt]?width=1024&height=1024&seed=[seed]&model=[model]
    const encodedPrompt = encodeURIComponent(prompt);
    const width = 1024;
    const height = 1024;

    // Using the requested model (defaulting to Nano Banana Pro / Gemini 3)
    // Removed API key and nologo=true to avoid "We have moved" error from legacy legacy keys
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${model}`;

    return url;
};

// "Training" logic: Advanced Prompt Engineering System
// Now powered by AI with fallback to manual logic
export const enhancePrompt = async (basePrompt: string, styleType: string = "cinematic"): Promise<string> => {
    // 1. Try AI-Powered Enhancement (The "Brain")
    try {
        // Construct a specialized system instruction for the AI
        const systemInstruction = `
            You are an expert AI Prompt Engineer for high-end image generation (Midjourney v6, Flux Pro, Gemini 3).
            Your goal is to transform simple user inputs into "Masterpiece" level prompts.
            
            CRITICAL INSTRUCTIONS:
            
            1. **FOOD & INGREDIENTS (Priority High):**
               - Triggers: ginger, garlic, rice, spices, fruits, vegetables.
               - Style: "Commercial Food Photography", "Michelin Guide Style".
               - Key Elements: "Macro 100mm lens", "Studio lighting", "Fresh moisture droplets", "Levitating/Floating", "Dynamic Splash".
               - *MANDATORY for 'Ginger':* Output EXACTLY: "A professional commercial food photography shot of a fresh knob of ginger root floating in the air. The subject is a fresh knob of ginger root with knobbly texture, golden-brown skin, slight sheen. It is suspended in mid-air with dynamic motion. Studio lighting, 8k resolution, ultra-sharp focus, moisture droplets."
            
            2. **PORTRAITS & PEOPLE:**
               - Style: "Fashion Editorial", "Cinematic Portrait".
               - Key Elements: "85mm lens", "f/1.8 aperture", "Natural skin texture", "Subsurface scattering", "Rembrandt lighting", "Eye reflection".
            
            3. **LANDSCAPES & NATURE:**
               - Style: "National Geographic", "Fine Art Landscape".
               - Key Elements: "Wide angle 24mm", "Golden Hour", "Dramatic cloud formation", "Tyndall effect (god rays)", "Hyper-detailed flora".
            
            4. **SCI-FI & FUTURE:**
               - Style: "Concept Art", "Blade Runner Aesthetic".
               - Key Elements: "Volumetric fog", "Neon accents", "Chrome reflections", "Atmospheric perspective", "Unreal Engine 5 Render".

            5. **GENERAL EXCELLENCE:**
               - Usage: For any other input.
               - Apply the requested style: "${styleType}".
               - Always include: "8k resolution", "highly detailed", "sharp focus", "cinematic lighting".
            
            OUTPUT FORMAT:
            - Provide ONLY the final prompt string.
            - Do NOT wrap in quotes.
            
            INPUT: "${basePrompt}"
        `.trim();

        const encodedInstruction = encodeURIComponent(systemInstruction);
        // Using Pollinations Text API (Anonymous - legacy endpoint works for num-auth)
        // Note: Authenticated requests on this endpoint are deprecated, so we omit the key here.
        const response = await fetch(`https://text.pollinations.ai/openai/${encodedInstruction}`);

        if (response.ok) {
            const aiPrompt = await response.text();
            if (aiPrompt && aiPrompt.length > 10) {
                console.log("AI Enhancement Successful:", aiPrompt);
                return aiPrompt.trim();
            }
        }
    } catch (error) {
        console.warn("AI Prompt Enhancement failed, falling back to manual logic.", error);
    }

    // 2. Fallback: Manual "Master Builder" Logic (If AI fails)
    return enhancePromptManual(basePrompt, styleType);
};

// Original Manual Logic (Renamed to act as robust fallback)
const enhancePromptManual = (basePrompt: string, styleType: string): string => {
    const lowerPrompt = basePrompt.toLowerCase();

    // -------------------------------------------------------------------------
    // MASSIVE EXTERNAL DATA IMPORT: Professional Descriptors & Modifiers
    // -------------------------------------------------------------------------
    const modifiers = {
        // Lighting & Atmosphere
        lighting: [
            "cinematic lighting", "volumetric lighting", "dramatic rim light", "studio softbox",
            "bioluminescent glow", "god rays", "chiaroscuro", "neon cyberpunk lighting",
            "golden hour aesthetic", "warm candlelight", "cold blue moonlight", "hazy atmosphere"
        ],
        // Camera & Lens Qualities
        camera: [
            "shot on 35mm lens", "85mm portrait lens", "f/1.8 aperture", "shallow depth of field",
            "bokeh background", "wide angle 24mm", "macro 100mm lens", "tilt-shift effect",
            "motion blur", "long exposure", "telephoto compression", "GoPro wide view"
        ],
        // Artistic Styles & Movements
        styles: {
            digital: [
                "Unreal Engine 5 render", "Octane Render", "Ray Tracing", "CGSociety trending",
                "ArtStation HQ", "isometric 3D", "low poly aesthetic", "voxel art", "digital painting"
            ],
            painting: [
                "oil painting style", "watercolor wash", "impasto brush strokes", "pencil sketch",
                "charcoal drawing", "ukiyo-e woodblock", "renaissance style", "impressionist", "surrealism"
            ],
            modern: [
                "vaporwave", "cyberpunk 2077", "steampunk", "solarpunk", "dieselpunk",
                "minimalist graphic design", "pop art", "bauhaus architecture", "brutalist"
            ]
        },
        // Textures & Materials
        textures: [
            "highly detailed texture", "rough matte finish", "glossy reflection", "brushed aluminum",
            "translucent skin", "subsurface scattering", "organic geometric patterns", "rust and decay",
            "liquid metal", "velvet fabric", "carbon fiber", "distressed leather"
        ],
        // Quality Boosters (The "Secret Sauce")
        quality: [
            "masterpiece", "best quality", "award winning photography", "8k resolution",
            "HDR", "intricate details", "hyper-realistic", "sharp focus", "perfect composition"
        ]
    };

    // -------------------------------------------------------------------------
    // INTENT DETECTION INTELLIGENCE
    // -------------------------------------------------------------------------
    const detectIntent = (text: string) => {
        if (/rice|basmati|grain|sella/.test(text)) return 'rice';
        if (/ginger|garlic|turmeric|pepper|chili|onion|vegetable|fruit|food/.test(text)) return 'ingredient';
        if (/man|woman|girl|boy|person|face|portrait|eye|hair/.test(text)) return 'portrait';
        if (/mountain|river|forest|sky|city|building|landscape|ocean|desert/.test(text)) return 'landscape';
        if (/robot|cyber|space|future|alien|sci-fi|tech|mech/.test(text)) return 'scifi';
        if (/logo|icon|vector|design|minimalist|symbol/.test(text)) return 'design';
        return 'general';
    };

    const intent = detectIntent(lowerPrompt);
    const normalizedStyle = styleType.toLowerCase();

    const getRandom = (arr: string[], count: number) =>
        arr.sort(() => 0.5 - Math.random()).slice(0, count);

    // -------------------------------------------------------------------------
    // MASTER BUILDER LOGIC
    // -------------------------------------------------------------------------

    // 1. RICE SPECIALIST
    if (intent === 'rice') {
        let adjectives = ["premium", "long-grain", "pristine"];
        let specificFeatures = "";
        let specificLighting = "dramatic side lighting";

        if (lowerPrompt.includes("sella")) {
            adjectives = lowerPrompt.includes("golden")
                ? ["extra long", "translucent", "rich amber-colored"]
                : ["extra long", "creamy white", "glass-like"];
            specificFeatures = "showcasing the distinct elongated shape and smooth finish";
        } else if (lowerPrompt.includes("raw")) {
            adjectives = ["chalky white", "opaque", "natural"];
            specificFeatures = "highlighting the soft matte texture";
        } else if (lowerPrompt.includes("steam")) {
            adjectives = ["clean white", "smooth", "soft"];
        }

        const cleanSubject = basePrompt.replace(/\./g, "").trim();
        const adjString = adjectives.join(", ");
        const randomComp = getRandom([
            "scattered artistically on black slate",
            "cascading in a soft heap",
            "arranged in a minimalist pile"
        ], 1)[0];

        return `A professional macro photograph of ${cleanSubject}. The grains are ${adjString}. ${specificFeatures}. Composition is ${randomComp}. Illumination is ${specificLighting}. 8k resolution, ultra-detailed texture.`;
    }

    // 2. FOOD & INGREDIENT SPECIALIST
    if (intent === 'ingredient') {
        let subSubject = "organic ingredient";
        let textures = "natural texture";

        // Specific 'Ginger' Master Prompt (User Request Match)
        if (lowerPrompt.includes("ginger")) {
            return `A professional commercial food photography shot of a fresh knob of ginger root floating in the air. The subject is a fresh knob of ginger root with knobbly texture, golden-brown skin, slight sheen. It is suspended in mid-air with dynamic motion. Studio lighting, 8k resolution, ultra-sharp focus, moisture droplets.`;
        }

        if (lowerPrompt.includes("garlic")) {
            subSubject = "whole garlic bulb";
            textures = "papery white skin with purple streaks, organic shape";
        }

        const foodContext = getRandom([
            "suspended in mid-air with dynamic motion",
            "falling through a splash of clear water",
            "resting on a rustic wooden table",
            "levitating against a dark, moody background"
        ], 1)[0];

        const cleanPrompt = basePrompt.replace(/ginger|garlic/gi, subSubject);
        return `Commercial food photography of ${cleanPrompt} (${subSubject}). Features ${textures}. It is ${foodContext}. Shot with 100mm macro lens, studio lighting, water droplets, ultra-sharp focus, 8k.`;
    }

    // 3. GENERAL PURPOSE MASTER BUILDER
    let styleModifiers: string[] = [];

    // Map User Selection to Internal Data
    switch (normalizedStyle) {
        case 'cinematic':
        case 'film':
            styleModifiers.push(...modifiers.lighting.slice(0, 4)); // Dramatic lights
            styleModifiers.push(...modifiers.camera.slice(0, 4));   // Camera specs
            break;
        case 'artistic':
        case 'digital':
            styleModifiers.push(...modifiers.styles.digital, ...modifiers.styles.painting);
            break;
        case 'fantasy':
            styleModifiers.push("mystical atmosphere", "magic glow", "ethereal", "fantasy art");
            break;
        case 'scifi':
            styleModifiers.push(...modifiers.styles.modern);
            break;
        case 'vintage':
            styleModifiers.push("sepia tone", "film grain", "retro aesthetic", "1980s style");
            break;
        case 'macro':
            styleModifiers.push("extreme close-up", "macro lens", "microscopic detail", "high texture");
            break;
        default: // Random or General
            styleModifiers.push(...modifiers.lighting, ...modifiers.camera, ...modifiers.styles.digital);
            break;
    }

    // Intelligent Selection: Pick 2 Lighting, 2 Camera, 2 Style/Texture descriptors
    const selectedLighting = getRandom(modifiers.lighting, 2);
    const selectedCamera = getRandom(modifiers.camera, 2);
    const selectedQuality = getRandom(modifiers.quality, 2);
    const selectedExtras = getRandom(styleModifiers, 3); // Flavour from specific style

    // Construct the Final Prompt
    // Structure: [Subject] + [Lighting] + [Camera] + [Style/Extras] + [Quality Boosters]
    const finalPromptParts = [
        basePrompt,
        ...selectedLighting,
        ...selectedCamera,
        ...selectedExtras,
        ...selectedQuality
    ];

    return [...new Set(finalPromptParts)].join(", ");
};
