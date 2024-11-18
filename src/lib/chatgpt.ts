// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function analyzeChatGPT(data: string) {
  try {
    const prompt = `Analyze this Excel data and suggest insights: ${data}. 
                   Focus on patterns, anomalies, and potential business insights.
                   Format the response in markdown.`

    const response = await fetch('https://chatgpt-42.p.rapidapi.com/conversationgpt4', {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
        'X-RapidAPI-Host': 'chatgpt-42.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: prompt,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`ChatGPT API request failed: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    return {
      content: result.content || result.response || ''
    };
  } catch (error) {
    console.error('ChatGPT API error:', error);
    return null;
  }
}
