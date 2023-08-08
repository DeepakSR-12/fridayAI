import axios from 'axios';
import {HfInference} from '@huggingface/inference';
import {Buffer} from 'buffer';
import {OPENAI_BASE_URL} from '@env';

const apiKey = '';
const client = axios.create({
  headers: {
    Authorization: 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
  },
});

async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = Buffer.from(reader.result);
      resolve(buffer.toString('base64'));
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

async function generateImage(prompt) {
  const TOKEN = '';
  const hf = new HfInference(TOKEN);

  const blob = await hf.textToImage({
    inputs: prompt,
    parameters: {
      width: 256,
      height: 256,
    },
    model: 'runwayml/stable-diffusion-v1-5',
  });
  const base64 = await blobToBase64(blob);
  const imageUrl = `data:image/png;base64,${base64}`;

  return imageUrl;
}

const chatgptUrl = OPENAI_BASE_URL;

export const apiCall = async (prompt, messages = []) => {
  try {
    prompt = prompt?.toLowerCase();
    let isArt =
      prompt?.includes('image') ||
      prompt?.includes('sketch') ||
      prompt?.includes('art') ||
      prompt?.includes('picture') ||
      prompt?.includes('drawing');
    if (isArt) {
      console.log('dalle api call');
      return dalleApiCall(prompt, messages);
    } else {
      console.log('chatgpt api call');
      return chatgptApiCall(prompt, messages);
    }
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};

const chatgptApiCall = async (prompt, messages) => {
  try {
    const res = await client.post(chatgptUrl, {
      model: 'gpt-3.5-turbo',
      messages,
    });

    let answer = res.data?.choices[0]?.message?.content;
    messages.push({role: 'assistant', content: answer.trim()});
    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};

const dalleApiCall = async (prompt, messages) => {
  try {
    const response = await generateImage(prompt);

    messages.push({role: 'assistant', content: response});
    console.log({messages});
    return Promise.resolve({success: true, data: messages});
  } catch (err) {
    console.log('error: ', err);
    return Promise.resolve({success: false, msg: err.message});
  }
};
