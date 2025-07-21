import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
const openai = new OpenAI();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { offers, agentNote, agentName, clientName } = body;
    if (!offers || !Array.isArray(offers) || !agentName || !clientName) {
      return NextResponse.json({ error: 'Missing or invalid offers, agent name, or client name.' }, { status: 400 });
    }
    const prompt = `
    You are an expert real estate agent. Write a professional, friendly, and persuasive email to ${clientName} (the client) from ${agentName} (the agent) with the following property offers. Your goal is to actively convince the client why these offers are great choices—highlight unique features, benefits, and what makes each property special. Use a warm, expert, and enthusiastic tone, as if you are personally recommending these properties to a valued client.

    Format the email in HTML, and ensure:
    - There is always one line space (a blank line or <br><br>) before each offer title
    - There is always one line space (a blank line or <br><br>) before the main closing content after the last offer
    - A warm greeting to ${clientName}
    - A persuasive summary/introduction
    - For each offer: start with the offer's title as a heading, then show all key details, a compelling explanation of why it’s a great fit, and a link to view the property
    - A friendly closing with the agent’s name (${agentName})

    Here are the offers (in JSON, each with a 'title' field):
    ${JSON.stringify(offers, null, 2)}
    ${agentNote ? `Agent note: ${agentNote}` : ''}
    `;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that writes professional real estate emails in HTML.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 800
    });
    const draftEmailRaw = completion.choices[0]?.message?.content || '';
    // Extract only the HTML code block for the draftEmail
    let draftEmail = draftEmailRaw;
    const codeBlockMatch = draftEmailRaw.match(/```html([\s\S]*?)```/i);
    if (codeBlockMatch) {
      draftEmail = codeBlockMatch[1].trim();
    }
    return NextResponse.json({ draftEmail });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate email draft.' }, { status: 500 });
  }
} 