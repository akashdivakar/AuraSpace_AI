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

    const formData = await request.formData();
    const image = formData.get('image') as File | null;
    const inputImageUrl = formData.get('inputImageUrl') as string | null;
    const roomType = formData.get('roomType') as string;
    const designStyle = formData.get('designStyle') as string;
    const numImages = parseInt(formData.get('numImages') as string || '1');
    const prompt = formData.get('prompt') as string | null;

    if (!image && !inputImageUrl) {
      return NextResponse.json({ error: 'Either image file or image URL is required' }, { status: 400 });
    }

    let result: any;

    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());
      result = await client.generateDesigns(buffer, roomType, designStyle, { numImages, ...(prompt && { prompt }) });
    } else if (inputImageUrl) {
      result = await client.generateDesignsForRoom({
        inputImageUrl,
        roomType,
        designStyle,
        numImages,
        ...(prompt && { prompt }),
      });
    }

    console.log('Decor8 API raw response:', JSON.stringify(result, null, 2));

    const cleanErrorMessage = (rawMsg: string | null | undefined): string => {
      if (!rawMsg) return 'An unexpected error occurred';
      if (typeof rawMsg === 'string' && rawMsg.includes('The model did not generate the expected output')) {
        return 'The AI model could not generate an image for this request. This usually happens if the AI considers the request too conflicting with the original image, or if it triggers safety filters. Try a different image or a simpler prompt.';
      }
      return rawMsg;
    };

    // Detect error responses that come back with 200 status
    if (Array.isArray(result)) {
      const errMsg = result[0]?.msg || result[0]?.message || 'The AI could not generate a design for this image.';
      return NextResponse.json({ error: cleanErrorMessage(errMsg) }, { status: 422 });
    }

    if (result?.error && !result?.info?.images?.length) {
      return NextResponse.json({ error: cleanErrorMessage(result.error) }, { status: 422 });
    }

    // Normalize: extract images from whichever structure the API returned
    const images = result?.info?.images || result?.images || [];
    if (!images.length) {
      return NextResponse.json(
        { error: cleanErrorMessage(result?.message) || 'No images were generated. Try a clearer photo or a different room/style.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ images });

  } catch (error: any) {
    let msg = error?.response?.data?.message
      || (Array.isArray(error?.response?.data) ? error.response.data[0]?.msg : null)
      || error.message;
      
    const cleanMsg = msg ? (typeof msg === 'string' && msg.includes('The model did not generate the expected output') 
      ? 'The AI model could not generate an image for this request. This usually happens if the AI considers the request too conflicting with the original image, or if it triggers safety filters. Try a different image or a simpler prompt.' 
      : msg) 
      : 'An unexpected error occurred';

    console.error('Virtual Staging Error:', cleanMsg);
    return NextResponse.json({ error: cleanMsg }, { status: 500 });
  }
}
