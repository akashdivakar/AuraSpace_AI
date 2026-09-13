import { NextResponse } from 'next/server';
import Decor8AI from 'decor8ai';

const client = new Decor8AI();

export async function POST(request: Request) {
  try {
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
