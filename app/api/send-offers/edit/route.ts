import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { draft, instruction } = body;
    if (!draft || !instruction) {
      return NextResponse.json({ error: 'Missing draft or instruction.' }, { status: 400 });
    }
    const prompt = `You are an expert real estate agent assistant. Here is an email draft:
-----
${draft}
-----

Instruction: ${instruction}

Edit the email draft according to the instruction. Return the full revised email in HTML, preserving formatting and improving as needed.`;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that writes and edits professional real estate emails in HTML.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 800
    });
    const draftEmail = completion.choices[0]?.message?.content || '';
    return NextResponse.json({ draftEmail });
  } catch (error) {
    console.error('[ERROR] Email edit API:', error);
    return NextResponse.json({ error: 'Failed to edit email draft.' }, { status: 500 });
  }
} 