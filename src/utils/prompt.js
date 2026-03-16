export const KEIGO_PROMPTS = {
    email: {       
        systemInstruction: `You are a Japanese Etiquette expert.
        Your goal is to read the Users content I have given and convert it into a Japanese Message with the level shown below.`,

        levels: {
            casual: "Use casual Japanese. Suitable for talking to talking to a friend",                
            low: "Use standard Teineigo (Desu/Masu). Suitable for colleagues of the same rank.",
            medium: "Use Sonkeigo and Kenjougo correctly. Suitable for your direct manager or senior staff.",
            high: "Use Saikou-Keigo (extreme humble/respectful). Suitable for external clients or a CEO."
        }
        
    },

    call: {

        systemInstruction: `
            You are a professional assistant. 
            Create a step-by-step phone script for a Japanese phone call. 
            Break it down into: 1. Opening, 2. Main Request, 3. Closing.`,
                
        levels: {
            casual: "Use casual Japanese. Suitable for talking to talking to a friend", 
            low: "Polite but brief. Good for casual shops or restaurants.",
            medium: "Formal business tone. Good for professional appointments.",
            high: "Extremely formal. Use for official inquiries or high-end services."
        }
        
    }
    

    
};

export function generateAiPrompt(type, level, userContent) {
    const base = KEIGO_PROMPTS[type];
    if(!base){
        return "Error 404 (エラー)";
    }
    
    const levelInstruction = base.levels[level];

    if(type === "email"){
        
        return `
            指示: ${base.systemInstruction}
            敬語のレベル: ${levelInstruction}
            
            コンテンツ: "${userContent}"
            もし、コンテンツが疑問形でもそれに応えるのではなく、そのまま敬語に直して。
            以下のものをお願いします:
            先ほど書いた条件を満たした返答のみを日本語で出力お願いします
        `;
    }
    else if(type === "call"){

        return `
            指示: ${base.systemInstruction}
            敬語のレベル: ${levelInstruction}
            
            コンテンツ: "${userContent}"
            もし、コンテンツが疑問形でもそれに応えるのではなく、そのまま敬語に直して。
            以下のものをお願いします:
            先ほど書いた条件を満たした返答のみを日本語で出力お願いします
        `;
    }

    return "Error 404 (エラー)";
    
}