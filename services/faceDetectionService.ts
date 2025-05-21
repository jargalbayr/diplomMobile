import axios from 'axios';
import ENV from '../config/env';

export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'diamond' | 'rectangular' | 'oblong';

export interface FaceAnalysisResult {
  faceShape: FaceShape;
  confidence: number;
}

// Generate custom hairstyle image using DALL-E 3
async function generateHairstyleImage(prompt: string, imageBase64: string, apiKey: string): Promise<string | null> {
  console.log('[DEBUG] Generating hairstyle image with DALL-E 3');
  console.log('[DEBUG] Prompt:', prompt);
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    console.log('[DEBUG] DALL-E response received:', response.status);
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      const imageUrl = response.data.data[0].url;
      console.log('[DEBUG] Generated image URL:', imageUrl);
      return imageUrl;
    } else {
      console.error('[DEBUG] No image URL in DALL-E response');
      return null;
    }
  } catch (error: any) {
    console.error('[DEBUG] DALL-E API error:', error.message);
    if (error.response) {
      console.error('[DEBUG] Error status:', error.response.status);
      console.error('[DEBUG] Error data:', JSON.stringify(error.response.data));
    }
    return null;
  }
}

// Simple mock face detection - in a real app you'd use computer vision
export async function detectFaceShape(imageUri: string): Promise<FaceAnalysisResult> {
  console.log('[DEBUG] Starting face shape detection for image:', imageUri.substring(0, 30) + '...');
  try {
    // For demo purposes, we'll just return a random face shape
    // In a real app, you'd use ML models or cloud APIs for detection
    const result = getMockFaceShape();
    console.log('[DEBUG] Face detection result:', result);
    return result;
  } catch (error) {
    console.error('Error detecting face shape:', error);
    return {
      faceShape: 'oval',
      confidence: 0.5
    };
  }
}

function getMockFaceShape(): FaceAnalysisResult {
  // Simulate face shape detection with random results
  const faceShapes: FaceShape[] = ['oval', 'round', 'square', 'heart', 'diamond', 'rectangular', 'oblong'];
  const randomIndex = Math.floor(Math.random() * faceShapes.length);
  
  return {
    faceShape: faceShapes[randomIndex],
    confidence: 0.7 + (Math.random() * 0.3) // Random confidence between 0.7 and 1.0
  };
}

export async function getHairstyleSuggestions(
  faceShape: FaceShape, 
  imageBase64: string
): Promise<any> {
  console.log('[DEBUG] Getting hairstyle suggestions for face shape:', faceShape);
  console.log('[DEBUG] Image base64 length:', imageBase64.length);

  try {
    // Get OpenAI API key from environment variables
    const OPENAI_API_KEY = ENV.OPENAI_API_KEY;
    
    console.log('[DEBUG] API Key available:', !!OPENAI_API_KEY);
    console.log('[DEBUG] API Key first 10 chars:', OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 10) + '...' : 'None');
    
    if (!OPENAI_API_KEY) {
      console.warn('[DEBUG] OpenAI API key not found, returning mock data');
      return getMockHairstyleSuggestions(faceShape);
    }
    
    console.log('[DEBUG] Preparing API request to OpenAI...');
    
    try {
      console.log('[DEBUG] Making API request to OpenAI...');
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "Та мэргэжлийн үс засч бөгөөд хүний нүүрний хэлбэр, онцлог шинж, одоогийн үсний загвар болон нийт төрхийг шинжлэн дүгнэж тохирох үсний загваруудыг санал болгодог мэргэжилтэн юм. Хүний зургийг дүн шинжилгээ хийхдээ дараах алхмуудыг дага: 1) Эхлээд хүйс (эрэгтэй/эмэгтэй/бусад)-ийг тодорхойл, 2) Өгөгдсөн нүүрний хэлбэрийг баталгаажуул болон тайлбарла, 3) Одоогийн үсний хэв маяг, урт, бүтэц болон өнгийг дүрсэл, 4) Зураг дээрх хүний нас, төрх, хувцаслалт зэргээс хамаарч тохирох 5 үсний загварыг санал болго. Үсний загвар бүрийн хувьд: а) Тодорхой нэр, б) Яагаад тохирох талаарх дэлгэрэнгүй тайлбар, в) Зөв Markdown форматтай хариултыг бэлтгэ. Хүйс, нүүрний хэлбэр, үсний төрөл, бүтэц, нүүрний онцлог, одоогийн хэв маяг зэрэг хүчин зүйлсийг харгалзан үзээрэй. Бүх хариултууд сайн бүтэцтэй Markdown хэлбэрээр, Монгол хэл дээр бичигдсэн байх ёстой."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Энэ хүний нүүрний хэлбэр ${faceShape} гэж тодорхойлогдсон. Энэ хүний зургийг сайтар анализ хийгээд ${faceShape} нүүрний хэлбэртэй хүнд тохирох 5 үсний загварыг санал болгоно уу. Загвар бүрд тайлбар бичиж өгнө үү. Яагаад энэ загвар тухайн хүний нүүрний хэлбэр, үсний төрөл/бүтэц, болон нийт төрхөд тохирох талаар тайлбарлана уу. Монгол хэл дээр хариулж, Markdown форматыг ашиглана уу.`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          max_tokens: 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );
      
      console.log('[DEBUG] API response received:', response.status);
      console.log('[DEBUG] Response headers:', JSON.stringify(response.headers));
      console.log('[DEBUG] Response data (truncated):', JSON.stringify(response.data).substring(0, 200) + '...');
      
      // Process the response
      const textSuggestions = processOpenAIResponse(response.data, faceShape);
      
      // Generate hairstyle images with DALL-E (if enabled)
      if (textSuggestions && textSuggestions.hairstyles && textSuggestions.hairstyles.length > 0) {
        console.log('[DEBUG] Generating custom hairstyle images with DALL-E 3');
        
        // Ensure we have exactly 5 hairstyles
        const hairstylesToProcess = textSuggestions.hairstyles.slice(0, 5);
        while (hairstylesToProcess.length < 5) {
          // Add placeholders if we have fewer than 5 suggestions
          hairstylesToProcess.push({
            name: `Additional Hairstyle ${hairstylesToProcess.length + 1}`,
            description: `A complementary hairstyle for ${faceShape} face shape.`,
            imageUrl: `https://i.imgur.com/example${hairstylesToProcess.length + 20}.jpg`
          });
        }
        
        // Process hairstyles in parallel
        const hairstylesWithImages = await Promise.all(
          hairstylesToProcess.map(async (hairstyle: any, index: number) => {
            try {
              // Create detailed personalized prompts for each hairstyle
              const dallePrompt = `Create a professional salon portrait photograph showing a ${textSuggestions.gender || 'person'} with a ${faceShape} face shape featuring the hairstyle: "${hairstyle.name}". The image should be a clear view of a ${textSuggestions.gender || 'person'} with this exact hairstyle, showing how it complements a ${faceShape} face shape. Style: high-end salon photography, neutral studio background, high-quality professional lighting, photorealistic. Show the complete hairstyle with excellent detail. The person should match the demographics shown in the reference image.`;
              
              // Try up to 2 times to generate the image
              let imageUrl = null;
              let attempts = 0;
              
              while (!imageUrl && attempts < 2) {
                attempts++;
                console.log(`[DEBUG] Generating image for hairstyle ${index + 1}, attempt ${attempts}`);
                
                try {
                  imageUrl = await generateHairstyleImage(dallePrompt, imageBase64, OPENAI_API_KEY);
                  if (imageUrl) {
                    console.log(`[DEBUG] Successfully generated image for hairstyle ${index + 1}`);
                  }
                } catch (genError) {
                  console.error(`[DEBUG] Error on attempt ${attempts} for hairstyle ${index + 1}:`, genError);
                  // Short pause before retry
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
              }
              
              // Update hairstyle with custom image if available
              if (imageUrl) {
                console.log(`[DEBUG] Applying generated image URL for hairstyle ${index + 1}`);
                return { ...hairstyle, imageUrl, isAiGenerated: true };
              } else {
                console.log(`[DEBUG] Using fallback image for hairstyle ${index + 1}`);
                return { 
                  ...hairstyle, 
                  imageUrl: `https://i.imgur.com/example${index + 16}.jpg`,
                  isAiGenerated: false
                };
              }
            } catch (imageError) {
              console.error(`[DEBUG] Error handling image for hairstyle ${index + 1}:`, imageError);
              return { 
                ...hairstyle, 
                imageUrl: `https://i.imgur.com/example${index + 16}.jpg`,
                isAiGenerated: false 
              };
            }
          })
        );
        
        // Update suggestions with the generated images
        textSuggestions.hairstyles = hairstylesWithImages;
        console.log('[DEBUG] Generated images for all hairstyles:', 
          hairstylesWithImages.map(h => h.isAiGenerated ? 'DALL-E' : 'Fallback').join(', ')
        );
      }
      
      return textSuggestions;
    } catch (apiError: any) {
      console.error('[DEBUG] OpenAI API error:', apiError.message);
      if (apiError.response) {
        console.error('[DEBUG] Error status:', apiError.response.status);
        console.error('[DEBUG] Error data:', JSON.stringify(apiError.response.data));
        console.error('[DEBUG] Error headers:', JSON.stringify(apiError.response.headers));
      }
      
      console.log('[DEBUG] Falling back to mock data due to API error');
      return getMockHairstyleSuggestions(faceShape);
    }
  } catch (error: any) {
    console.error('[DEBUG] General error getting hairstyle suggestions:', error.message);
    console.log('[DEBUG] Falling back to mock data due to general error');
    return getMockHairstyleSuggestions(faceShape);
  }
}

function processOpenAIResponse(response: any, faceShape: FaceShape): any {
  console.log('[DEBUG] Processing OpenAI response');
  try {
    // Extract the text content from the response
    const message = response.choices[0]?.message?.content;
    console.log('[DEBUG] Extracted message:', message ? message.substring(0, 100) + '...' : 'None');
    
    if (!message) {
      console.log('[DEBUG] No message content in response, using mock data');
      return getMockHairstyleSuggestions(faceShape);
    }

    // Determine gender - look for gender mention in the beginning of the response
    let gender = 'person';
    const genderMatch = message.match(/(?:эрэгтэй|эмэгтэй|эр|эм|male|female|man|woman)/i);
    if (genderMatch) {
      const genderWord = genderMatch[0].toLowerCase();
      if (genderWord.includes('эрэгтэй') || genderWord.includes('эр') || genderWord.includes('male') || genderWord.includes('man')) {
        gender = 'male';
      } else if (genderWord.includes('эмэгтэй') || genderWord.includes('эм') || genderWord.includes('female') || genderWord.includes('woman')) {
        gender = 'female';
      }
      console.log('[DEBUG] Detected gender:', gender);
    }

    // Try to parse the Markdown response
    try {
      console.log('[DEBUG] Processing Markdown response');
      
      // Extract hairstyle sections using Markdown headers
      const hairstyles = [];
      
      // Look for Markdown headers (##, ###, or numbered lists)
      const sections = message.split(/(?:^|\n)(?:#{2,3}|\d+\.)\s+/g).filter(Boolean);
      
      if (sections.length >= 2) {
        // First section is usually an introduction
        const introduction = sections[0].trim();
        
        // Process the remaining sections as hairstyles
        for (let i = 1; i < Math.min(sections.length, 6); i++) {
          const section = sections[i].trim();
          const lines = section.split('\n').filter(Boolean);
          
          if (lines.length > 0) {
            const name = lines[0].replace(/[*_#]/g, '').trim();
            const description = lines.slice(1).join('\n').trim();
            
            if (name && description) {
              hairstyles.push({
                name,
                description,
                imageUrl: `https://i.imgur.com/example${i+15}.jpg` // Use mock images
              });
            }
          }
        }
      } else {
        // Alternative approach: Try to parse numbered lists
        const listItemPattern = /(\d+\.|[*\-•])\s+([^:\n]+):?\s*([^]*?)(?=(?:\d+\.|[*\-•])\s+|\n\n|$)/g;
        let match;
        
        while ((match = listItemPattern.exec(message)) !== null) {
          const name = match[2].replace(/[*_#]/g, '').trim();
          const description = match[3].trim();
          
          if (name && description) {
            hairstyles.push({
              name,
              description,
              imageUrl: `https://i.imgur.com/example${hairstyles.length + 16}.jpg` // Use mock images
            });
          }
        }
      }
      
      if (hairstyles.length > 0) {
        console.log('[DEBUG] Extracted', hairstyles.length, 'hairstyles from Markdown');
        
        // Extract a description from the first part of the message
        const descriptionMatch = message.match(/^[^#\d*\-•]+/);
        const description = descriptionMatch 
          ? descriptionMatch[0].trim() 
          : `Танд зориулсан үсний загварууд (Face shape: ${faceShape})`;
        
        return {
          faceShape: faceShape.charAt(0).toUpperCase() + faceShape.slice(1),
          description: description,
          markdownContent: message, // Store the full Markdown content
          hairstyles,
          gender: gender // Add gender for use in DALL-E prompts
        };
      }
    } catch (parseError) {
      console.error('[DEBUG] Error parsing Markdown response:', parseError);
    }
    
    // Fallback to mock data if parsing fails
    console.log('[DEBUG] Falling back to mock data due to parsing failure');
    return getMockHairstyleSuggestions(faceShape);
  } catch (error) {
    console.error('[DEBUG] Error processing OpenAI response:', error);
    return getMockHairstyleSuggestions(faceShape); // Fallback
  }
}

function getMockHairstyleSuggestions(faceShape: FaceShape) {
  // Mock data for different face shapes
  const suggestionsByFaceShape: Record<FaceShape, any> = {
    oval: {
      faceShape: 'Oval',
      description: 'You have an oval face shape, which is considered the most versatile for hairstyles. Your face is about one and a half times longer than it is wide, with your forehead slightly wider than your jaw.',
      hairstyles: [
        {
          name: 'Classic Medium-Length Layers',
          description: 'Layers that start at the chin and continue downward will frame your face beautifully while maintaining its natural balance.',
          imageUrl: 'https://i.imgur.com/example1.jpg'
        },
        {
          name: 'Textured Pixie Cut',
          description: 'Your oval face shape can handle the shortness of a pixie cut. Add texture on top for some volume and style versatility.',
          imageUrl: 'https://i.imgur.com/example2.jpg'
        },
        {
          name: 'Long Layers with Side-Swept Bangs',
          description: 'This style adds softness around your face while the side-swept bangs create a gentle frame.',
          imageUrl: 'https://i.imgur.com/example3.jpg'
        },
        {
          name: 'Modern Shag',
          description: 'A shag haircut with lots of layers works well with your face shape, adding texture and movement.',
          imageUrl: 'https://i.imgur.com/example4.jpg'
        },
        {
          name: 'Sleek Bob',
          description: 'A bob that hits at the jawline or slightly below complements your oval face shape by adding structure.',
          imageUrl: 'https://i.imgur.com/example5.jpg'
        }
      ]
    },
    round: {
      faceShape: 'Round',
      description: 'You have a round face shape with soft angles and similar width and length measurements. Your cheekbones are the widest part of your face, with a rounded jawline and forehead.',
      hairstyles: [
        {
          name: 'Long Layered Cut',
          description: 'Long layers create the illusion of length and help slim a round face.',
          imageUrl: 'https://i.imgur.com/example6.jpg'
        },
        {
          name: 'Side-Parted Bob',
          description: 'An asymmetrical bob with a deep side part adds angles to soften roundness.',
          imageUrl: 'https://i.imgur.com/example7.jpg'
        },
        {
          name: 'Voluminous Pixie with Height',
          description: 'Adding volume at the crown elongates your face shape and creates a balancing effect.',
          imageUrl: 'https://i.imgur.com/example8.jpg'
        },
        {
          name: 'Long Side-Swept Bangs',
          description: 'Side-swept bangs create diagonal lines across your face, adding definition and angles.',
          imageUrl: 'https://i.imgur.com/example9.jpg'
        },
        {
          name: 'Shoulder-Length Cut with Face-Framing Layers',
          description: 'Layers that start at the chin help create structure and lengthen a round face.',
          imageUrl: 'https://i.imgur.com/example10.jpg'
        }
      ]
    },
    square: {
      faceShape: 'Square',
      description: 'You have a square face shape with a strong jawline and forehead that are approximately the same width. Your face has defined angles and a shorter length compared to width.',
      hairstyles: [
        {
          name: 'Soft Layered Cut',
          description: 'Soft layers help balance the angularity of your square face shape.',
          imageUrl: 'https://i.imgur.com/example11.jpg'
        },
        {
          name: 'Wavy Lob (Long Bob)',
          description: 'Waves add softness to counterbalance your strong jawline.',
          imageUrl: 'https://i.imgur.com/example12.jpg'
        },
        {
          name: 'Side-Swept Pixie',
          description: 'A pixie cut with longer pieces on top softens your facial angles.',
          imageUrl: 'https://i.imgur.com/example13.jpg'
        },
        {
          name: 'Curtain Bangs',
          description: 'These frame your face and soften the squareness of your forehead.',
          imageUrl: 'https://i.imgur.com/example14.jpg'
        },
        {
          name: 'Long Layers with Face-Framing Pieces',
          description: 'Long layers starting below the chin soften your jawline.',
          imageUrl: 'https://i.imgur.com/example15.jpg'
        }
      ]
    },
    heart: {
      faceShape: 'Heart',
      description: 'You have a heart-shaped face with a wider forehead that tapers to a narrower chin. Your cheekbones are typically high and well-defined.',
      hairstyles: [
        {
          name: 'Chin-Length Bob',
          description: 'A bob that hits at the chin adds width to the lower part of your face, creating balance.',
          imageUrl: 'https://i.imgur.com/example16.jpg'
        },
        {
          name: 'Side-Parted Waves',
          description: 'Waves with a side part add softness and balance to your features.',
          imageUrl: 'https://i.imgur.com/example17.jpg'
        },
        {
          name: 'Long Layers with Side-Swept Bangs',
          description: 'Side-swept bangs soften your forehead while long layers add movement.',
          imageUrl: 'https://i.imgur.com/example18.jpg'
        },
        {
          name: 'Pixie with Longer Top',
          description: 'A pixie cut with length on top balances your narrower chin.',
          imageUrl: 'https://i.imgur.com/example19.jpg'
        },
        {
          name: 'Medium Length with Curtain Bangs',
          description: 'Curtain bangs soften your forehead while medium length adds balance.',
          imageUrl: 'https://i.imgur.com/example20.jpg'
        }
      ]
    },
    diamond: {
      faceShape: 'Diamond',
      description: 'You have a diamond face shape with narrow forehead and jawline, and wider cheekbones. This creates distinctive angles and high definition in your face.',
      hairstyles: [
        {
          name: 'Textured Lob with Side Part',
          description: 'A textured long bob with a side part softens your angular features while highlighting your cheekbones.',
          imageUrl: 'https://i.imgur.com/example21.jpg'
        },
        {
          name: 'Wispy Bangs',
          description: 'Wispy bangs add width to your forehead while softening your overall look.',
          imageUrl: 'https://i.imgur.com/example22.jpg'
        },
        {
          name: 'Chin-Length Bob with Layers',
          description: 'A layered bob adds width at your jawline, creating more balance with your cheekbones.',
          imageUrl: 'https://i.imgur.com/example23.jpg'
        },
        {
          name: 'Mid-Length Waves',
          description: 'Soft waves at mid-length add volume at your jawline and forehead.',
          imageUrl: 'https://i.imgur.com/example24.jpg'
        },
        {
          name: 'Pixie with Textured Bangs',
          description: 'A pixie cut with textured bangs adds width to your forehead while showing off your cheekbones.',
          imageUrl: 'https://i.imgur.com/example25.jpg'
        }
      ]
    },
    rectangular: {
      faceShape: 'Rectangular',
      description: 'You have a rectangular face shape with a longer face and straight sides. Your forehead, cheekbones, and jawline are similar in width.',
      hairstyles: [
        {
          name: 'Layered Mid-Length Cut with Bangs',
          description: 'Bangs shorten your face visually while layers add width to the sides.',
          imageUrl: 'https://i.imgur.com/example26.jpg'
        },
        {
          name: 'Voluminous Bob',
          description: 'A bob with volume at the sides adds width to your face, creating better proportion.',
          imageUrl: 'https://i.imgur.com/example27.jpg'
        },
        {
          name: 'Shoulder-Length Waves',
          description: 'Waves add width and texture while the length balances your face shape.',
          imageUrl: 'https://i.imgur.com/example28.jpg'
        },
        {
          name: 'Long Layers with Curtain Bangs',
          description: 'Curtain bangs visually shorten your face while layers add softness.',
          imageUrl: 'https://i.imgur.com/example29.jpg'
        },
        {
          name: 'Textured Pixie with Full Bangs',
          description: 'Full bangs shorten your face while texture adds width at the sides.',
          imageUrl: 'https://i.imgur.com/example30.jpg'
        }
      ]
    },
    oblong: {
      faceShape: 'Oblong',
      description: 'You have an oblong face shape that is longer than it is wide, with minimal angles. Your forehead, cheekbones, and jawline are similar in width.',
      hairstyles: [
        {
          name: 'Full Bangs with Layers',
          description: 'Full bangs shorten your face visually, while layers add width.',
          imageUrl: 'https://i.imgur.com/example31.jpg'
        },
        {
          name: 'Chin-Length Bob with Side-Swept Bangs',
          description: 'This length adds width at your jawline while bangs break up the length of your face.',
          imageUrl: 'https://i.imgur.com/example32.jpg'
        },
        {
          name: 'Layered Shag with Curtain Bangs',
          description: 'A shag haircut with curtain bangs adds width and texture throughout.',
          imageUrl: 'https://i.imgur.com/example33.jpg'
        },
        {
          name: 'Short Textured Pixie',
          description: 'A pixie with texture on top adds width to counterbalance your face length.',
          imageUrl: 'https://i.imgur.com/example34.jpg'
        },
        {
          name: 'Medium Cut with Face-Framing Layers',
          description: 'Face-framing layers starting at the cheekbones add width and dimension.',
          imageUrl: 'https://i.imgur.com/example35.jpg'
        }
      ]
    }
  };
  
  return suggestionsByFaceShape[faceShape] || suggestionsByFaceShape.oval;
}

// Direct hairstyle suggestion using GPT-4o vision capabilities without face detection
export async function getDirectHairstyleSuggestions(imageBase64: string): Promise<any> {
  console.log('[DEBUG] Getting direct hairstyle suggestions with GPT-4o');
  console.log('[DEBUG] Image base64 length:', imageBase64.length);

  try {
    // Get OpenAI API key from environment variables
    const OPENAI_API_KEY = ENV.OPENAI_API_KEY;
    
    console.log('[DEBUG] API Key available:', !!OPENAI_API_KEY);
    
    if (!OPENAI_API_KEY) {
      console.warn('[DEBUG] OpenAI API key not found, returning mock data');
      return getMockDirectHairstyleSuggestions();
    }
    
    console.log('[DEBUG] Preparing API request to OpenAI for direct analysis...');
    
    try {
      // Use GPT-4o to analyze the image and suggest hairstyles directly
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "Та мэргэжлийн үс засч бөгөөд хүний нүүрний хэлбэр, онцлог шинж, одоогийн үсний загвар болон нийт төрхийг шинжлэн дүгнэж тохирох үсний загваруудыг санал болгодог мэргэжилтэн юм. Хүний зургийг дүн шинжилгээ хийхдээ дараах алхмуудыг дага: 1) Эхлээд хүйс (эрэгтэй/эмэгтэй/бусад)-ийг тодорхойл, 2) Нүүрний хэлбэрийг тодорхойл (зууван, дугуй, дөрвөлжин, зүрх хэлбэртэй гэх мэт), 3) Одоогийн үсний хэв маяг, урт, бүтэц болон өнгийг дүрсэл, 4) Зураг дээрх хүний нас, төрх, хувцаслалт зэргээс хамаарч тохирох 5 үсний загварыг санал болго. Үсний загвар бүрийн хувьд: а) Тодорхой нэр, б) Яагаад тохирох талаарх дэлгэрэнгүй тайлбар, в) Зөв Markdown форматтай хариултыг бэлтгэ. Хүйс, нүүрний хэлбэр, үсний төрөл, бүтэц, нүүрний онцлог, одоогийн хэв маяг зэрэг хүчин зүйлсийг харгалзан үзээрэй. Бүх хариултууд сайн бүтэцтэй Markdown хэлбэрээр, Монгол хэл дээр бичигдсэн байх ёстой."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Миний төрхөд тохирох үсний загваруудыг санал болгоно уу. Миний зургийг анализ хийгээд надад тохирох 5 үсний загварыг санал болгоно уу. Загвар бүрд тайлбар бичиж өгнө үү. Яагаад энэ загвар миний нүүрний хэлбэр, үсний төрөл/бүтэц, болон нийт төрхөд тохирох талаар тайлбарлана уу. Монгол хэл дээр хариулж, Markdown форматыг ашиглана уу."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          max_tokens: 1500
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );
      
      console.log('[DEBUG] GPT-4o API response received:', response.status);
      
      // Process the response
      const textSuggestions = processGPT4oResponse(response.data);
      
      // Generate hairstyle images with DALL-E
      if (textSuggestions && textSuggestions.hairstyles && textSuggestions.hairstyles.length > 0) {
        console.log('[DEBUG] Generating custom hairstyle images with DALL-E 3');
        
        // Ensure we have exactly 5 hairstyles
        const hairstylesToProcess = textSuggestions.hairstyles.slice(0, 5);
        while (hairstylesToProcess.length < 5) {
          // Add placeholders if we have fewer than 5 suggestions
          hairstylesToProcess.push({
            name: `Additional Hairstyle ${hairstylesToProcess.length + 1}`,
            description: `A complementary hairstyle for your features.`,
            imageUrl: `https://i.imgur.com/example${hairstylesToProcess.length + 20}.jpg`
          });
        }
        
        // Process hairstyles in parallel
        const hairstylesWithImages = await Promise.all(
          hairstylesToProcess.map(async (hairstyle: any, index: number) => {
            try {
              // Create detailed personalized prompts for each hairstyle
              const dallePrompt = `Create a professional salon portrait photograph showing a ${textSuggestions.gender || 'person'} with the hairstyle: "${hairstyle.name}". The image should be a clear view of a ${textSuggestions.gender || 'person'} with this exact hairstyle from a front-facing angle. Style: high-end salon photography, neutral studio background, high-quality professional lighting, photorealistic. Show the complete hairstyle with excellent detail. Make the hairstyle the main focus of the image. The person should match the demographics shown in the reference image.`;
              
              // Try up to 2 times to generate the image
              let imageUrl = null;
              let attempts = 0;
              
              while (!imageUrl && attempts < 2) {
                attempts++;
                console.log(`[DEBUG] Generating image for hairstyle ${index + 1}, attempt ${attempts}`);
                
                try {
                  imageUrl = await generateHairstyleImage(dallePrompt, imageBase64, OPENAI_API_KEY);
                  if (imageUrl) {
                    console.log(`[DEBUG] Successfully generated image for hairstyle ${index + 1}`);
                  }
                } catch (genError) {
                  console.error(`[DEBUG] Error on attempt ${attempts} for hairstyle ${index + 1}:`, genError);
                  // Short pause before retry
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
              }
              
              // Update hairstyle with custom image if available
              if (imageUrl) {
                console.log(`[DEBUG] Applying generated image URL for hairstyle ${index + 1}`);
                return { ...hairstyle, imageUrl, isAiGenerated: true };
              } else {
                console.log(`[DEBUG] Using fallback image for hairstyle ${index + 1}`);
                return { 
                  ...hairstyle, 
                  imageUrl: `https://i.imgur.com/example${index + 16}.jpg`,
                  isAiGenerated: false
                };
              }
            } catch (imageError) {
              console.error(`[DEBUG] Error handling image for hairstyle ${index + 1}:`, imageError);
              return { 
                ...hairstyle, 
                imageUrl: `https://i.imgur.com/example${index + 16}.jpg`,
                isAiGenerated: false 
              };
            }
          })
        );
        
        // Update suggestions with the generated images
        textSuggestions.hairstyles = hairstylesWithImages;
        console.log('[DEBUG] Generated images for all hairstyles:', 
          hairstylesWithImages.map(h => h.isAiGenerated ? 'DALL-E' : 'Fallback').join(', ')
        );
      }
      
      return textSuggestions;
    } catch (apiError: any) {
      console.error('[DEBUG] OpenAI API error:', apiError.message);
      if (apiError.response) {
        console.error('[DEBUG] Error status:', apiError.response.status);
        console.error('[DEBUG] Error data:', JSON.stringify(apiError.response.data));
      }
      
      console.log('[DEBUG] Falling back to mock data due to API error');
      return getMockDirectHairstyleSuggestions();
    }
  } catch (error: any) {
    console.error('[DEBUG] General error getting direct hairstyle suggestions:', error.message);
    console.log('[DEBUG] Falling back to mock data due to general error');
    return getMockDirectHairstyleSuggestions();
  }
}

// Function to process the GPT-4o response for direct hairstyle suggestions
function processGPT4oResponse(response: any): any {
  console.log('[DEBUG] Processing GPT-4o direct analysis response');
  try {
    // Extract the text content from the response
    const message = response.choices[0]?.message?.content;
    console.log('[DEBUG] Extracted message from GPT-4o:', message ? message.substring(0, 100) + '...' : 'None');
    
    if (!message) {
      console.log('[DEBUG] No message content in response, using mock data');
      return getMockDirectHairstyleSuggestions();
    }

    // Determine gender - look for gender mention in the beginning of the response
    let gender = 'person';
    const genderMatch = message.match(/(?:эрэгтэй|эмэгтэй|эр|эм|male|female|man|woman)/i);
    if (genderMatch) {
      const genderWord = genderMatch[0].toLowerCase();
      if (genderWord.includes('эрэгтэй') || genderWord.includes('эр') || genderWord.includes('male') || genderWord.includes('man')) {
        gender = 'male';
      } else if (genderWord.includes('эмэгтэй') || genderWord.includes('эм') || genderWord.includes('female') || genderWord.includes('woman')) {
        gender = 'female';
      }
      console.log('[DEBUG] Detected gender:', gender);
    }

    // Try to parse the Markdown response
    try {
      console.log('[DEBUG] Processing Markdown response');
      
      // Extract hairstyle sections using Markdown headers
      const hairstyles = [];
      
      // Look for Markdown headers (##, ###, or numbered lists)
      const sections = message.split(/(?:^|\n)(?:#{2,3}|\d+\.)\s+/g).filter(Boolean);
      
      if (sections.length >= 2) {
        // First section is usually an introduction
        const introduction = sections[0].trim();
        
        // Process the remaining sections as hairstyles
        for (let i = 1; i < Math.min(sections.length, 6); i++) {
          const section = sections[i].trim();
          const lines = section.split('\n').filter(Boolean);
          
          if (lines.length > 0) {
            const name = lines[0].replace(/[*_#]/g, '').trim();
            const description = lines.slice(1).join('\n').trim();
            
            if (name && description) {
              hairstyles.push({
                name,
                description,
                imageUrl: `https://i.imgur.com/example${i+15}.jpg` // Use mock images initially
              });
            }
          }
        }
      } else {
        // Alternative approach: Try to parse numbered lists
        const listItemPattern = /(\d+\.|[*\-•])\s+([^:\n]+):?\s*([^]*?)(?=(?:\d+\.|[*\-•])\s+|\n\n|$)/g;
        let match;
        
        while ((match = listItemPattern.exec(message)) !== null) {
          const name = match[2].replace(/[*_#]/g, '').trim();
          const description = match[3].trim();
          
          if (name && description) {
            hairstyles.push({
              name,
              description,
              imageUrl: `https://i.imgur.com/example${hairstyles.length + 16}.jpg` // Use mock images initially
            });
          }
        }
      }
      
      if (hairstyles.length > 0) {
        console.log('[DEBUG] Extracted', hairstyles.length, 'hairstyles from Markdown');
        
        // Extract a description from the first part of the message
        const descriptionMatch = message.match(/^[^#\d*\-•]+/);
        const description = descriptionMatch 
          ? descriptionMatch[0].trim() 
          : `Танд зориулсан үсний загварууд`;
        
        return {
          faceShape: "Custom", // No specific face shape for direct analysis
          description: description,
          markdownContent: message, // Store the full Markdown content
          hairstyles,
          gender: gender // Add gender for use in DALL-E prompts
        };
      }
    } catch (parseError) {
      console.error('[DEBUG] Error parsing Markdown response:', parseError);
    }
    
    // Fallback to mock data if parsing fails
    console.log('[DEBUG] Falling back to mock data due to parsing failure');
    return getMockDirectHairstyleSuggestions();
  } catch (error) {
    console.error('[DEBUG] Error processing GPT-4o response:', error);
    return getMockDirectHairstyleSuggestions(); // Fallback
  }
}

// Mock data for direct hairstyle suggestions
function getMockDirectHairstyleSuggestions() {
  return {
    faceShape: "Custom",
    description: "Таны зурагт үндэслэн хийсэн анализаар танд тохирох үсний загваруудыг санал болгож байна:",
    hairstyles: [
      {
        name: 'Орчин үеийн текстурт боб',
        description: 'Текстурт боб үс таны нүүрийг гоёмсгоор хүрээлэн, үсэнд хөдөлгөөн болон хэмжээс нэмнэ. Текстурт давхарга нь орчин үеийн, хялбар загвар бөгөөд хялбархан засаж болно.',
        imageUrl: 'https://i.imgur.com/example1.jpg'
      },
      {
        name: 'Зөөлөн хөшиг баналтай үс',
        description: 'Хөшиг баналт нь таны нүүрийг зөөлөн хүрээлж, төрхийг чинь тодотгоно. Энэ нь олон янзаар хэлбэржүүлж болох уян хатан загвар бөгөөд орчин үеийн харагдах төрхийг бий болгоно.',
        imageUrl: 'https://i.imgur.com/example2.jpg'
      },
      {
        name: 'Давхарласан дунд урттай үс',
        description: 'Дунд урттай үсэнд нүүрийг хүрээлсэн үсний давхаргууд нь таны төрхийг тодруулж, шулуун болон давлагаатай гэх мэт янз бүрийн загварчлалын боломжийг олгодог.',
        imageUrl: 'https://i.imgur.com/example3.jpg'
      },
      {
        name: 'Дээд хэсэгтээ урт текстурт пикси',
        description: 'Дээд хэсэгтээ нэмэлт уртай пикси үс таны нүүрний бүтцийг онцлон харуулж, орчин үеийн төрхийг бий болгоно. Энэ нь арчлахад хялбар боловч загварлаг харагдана.',
        imageUrl: 'https://i.imgur.com/example4.jpg'
      },
      {
        name: 'Зөөлөн долгионтой лоб',
        description: 'Урт боб буюу лоб үс дээр зөөлөн долгион нь таны үсэнд хөдөлгөөн, хэмжээс нэмж, нүүрийг тань гоёмсгоор хүрээлнэ. Энэхүү олон талт загвар нь өдөр тутмын болон албан ёсны арга хэмжээнд тохиромжтой.',
        imageUrl: 'https://i.imgur.com/example5.jpg'
      }
    ],
    gender: 'female' // Default to female for the mock data
  };
} 