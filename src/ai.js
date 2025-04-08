import Vapi  from "@vapi-ai/web";

export const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY);

const assistantId = import.meta.env.VITE_ASSISTANT_ID;

export const startAssistant = async (firstName, lastName, email, phone) => {
    const assistantOverrides = {
        variableValues: {
            firstName,
            lastName,
            email,
            phone,
        },
    };
    return await vapi.start(assistantId, assistantOverrides);
};

export const stopAssistant = () => {
    vapi.stop();
};

// GroqAPI Chat Service
export const sendChatMessage = async (messages) => {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama3-70b-8192',
                messages: [
                    { 
                        role: 'system', 
                        content: 'You are Alham AI, an Islamic voice assistant. You provide guidance in accordance with Islamic principles. Your responses should be respectful, knowledgeable about Islamic teachings, and helpful. When providing religious information, cite sources when relevant such as Quran verses or Hadiths. You can respond to questions about daily life, Islamic practices, history, and provide general advice through an Islamic perspective.'
                    },
                    ...messages.filter(m => m.role !== 'system')
                ],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error in sendChatMessage:', error);
        throw error;
    }
};
