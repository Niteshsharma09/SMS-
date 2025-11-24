'use server';

/**
 * @fileOverview Enables users to virtually try on frames using their device's camera.
 *
 * - virtualTryOn - A function that handles the virtual try-on process.
 * - VirtualTryOnInput - The input type for the virtualTryOn function, including the user's face image and frame selection.
 * - VirtualTryOnOutput - The return type for the virtualTryOn function, providing the image with frames superimposed.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VirtualTryOnInputSchema = z.object({
  faceImageUri: z
    .string()
    .describe(
      "A photo of the user's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  frameId: z.string().describe('The ID of the frame to try on.'),
});
export type VirtualTryOnInput = z.infer<typeof VirtualTryOnInputSchema>;

const VirtualTryOnOutputSchema = z.object({
  modifiedImageUri: z
    .string()
    .describe(
      'The image with the frames superimposed on the user’s face, as a data URI that must include a MIME type and use Base64 encoding.'
    ),
});
export type VirtualTryOnOutput = z.infer<typeof VirtualTryOnOutputSchema>;

export async function virtualTryOn(input: VirtualTryOnInput): Promise<VirtualTryOnOutput> {
  return virtualTryOnFlow(input);
}

const virtualTryOnPrompt = ai.definePrompt({
  name: 'virtualTryOnPrompt',
  input: {schema: VirtualTryOnInputSchema},
  output: {schema: VirtualTryOnOutputSchema},
  prompt: [
    {
      media: {url: '{{faceImageUri}}'},
    },
    {
      text: `Superimpose the glasses (frame ID: {{{frameId}}}) onto the user's face in the image. Ensure the glasses are appropriately scaled and positioned to look realistic.`,
    },
  ],
  model: 'googleai/gemini-2.5-flash-image-preview',
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
  },
});

const virtualTryOnFlow = ai.defineFlow(
  {
    name: 'virtualTryOnFlow',
    inputSchema: VirtualTryOnInputSchema,
    outputSchema: VirtualTryOnOutputSchema,
  },
  async input => {
    const {media} = await virtualTryOnPrompt(input);
    return {modifiedImageUri: media!.url!};
  }
);
