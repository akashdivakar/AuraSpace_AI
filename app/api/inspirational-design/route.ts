import { NextResponse } from 'next/server';
import Decor8AI from 'decor8ai';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const DEFAULT_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5X3V1aWQiOiJiYTNhNzA5Yi02MDBmLTRlNzctODJiMy1mNDIwZmFhODVjYjkiLCJpYXQiOjE3MzE2MTkwMzJ9.Jhuo8kAZDtxaYO2S3amrsymF0FRFK2PNDzr_XKmxb7Q";

export async function POST(request: Request) {
  try {
    if (!process.env.DECOR8AI_API_KEY) {
      process.env.DECOR8AI_API_KEY = DEFAULT_API_KEY;
    }
    const client = new Decor8AI();
    const body = await request.json();
    const { roomType, designStyle, prompt, numImages = 1 } = body;

    const options: any = {
      numImages,
    };

    if (roomType) options.roomType = roomType;
    if (designStyle) options.designStyle = designStyle;
    if (prompt) options.prompt = prompt;

    const result: any = await client.generateInspirationalDesigns(options);
    console.log('Inspirational Design raw response:', JSON.stringify(result, null, 2));

    const cleanErrorMessage = (rawMsg: string | null | undefined): string => {
      if (!rawMsg) return 'An unexpected error occurred';
      if (typeof rawMsg === 'string' && rawMsg.includes('The model did not generate the expected output')) {
        return 'The AI model could not generate an image for this request. Try adjusting your prompt or style.';
      }
      return rawMsg;
    };

    if (Array.isArray(result)) {
      const errMsg = result[0]?.msg || result[0]?.message || 'Failed to generate inspirational design.';
      return NextResponse.json({ error: cleanErrorMessage(errMsg) }, { status: 422 });
    }

    if (result?.error && !result?.info?.images?.length) {
      return NextResponse.json({ error: cleanErrorMessage(result.error) }, { status: 422 });
    }

    const images = result?.info?.images || result?.images || [];
    if (!images.length) {
      return NextResponse.json(
        { error: cleanErrorMessage(result?.message) || 'No images were generated. Try a different style.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ images });
  } catch (error: any) {
    let msg = error?.response?.data?.message
      || (Array.isArray(error?.response?.data) ? error.response.data[0]?.msg : null)
      || error.message;

    const cleanMsg = msg ? (typeof msg === 'string' && msg.includes('The model did not generate the expected output')
      ? 'The AI model could not generate an image for this request. Try adjusting your prompt or style.'
      : msg)
      : 'An unexpected error occurred';

    console.error('Inspirational Design Error:', cleanMsg);
    return NextResponse.json({ error: cleanMsg }, { status: 500 });
  }
}
