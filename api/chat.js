{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // api/chat.js  (fonction serverless pour Vercel)\
// PROT\'c8GE la cl\'e9 : on la lit depuis process.env.HF_API_TOKEN\
export default async function handler(req, res) \{\
  if (req.method !== 'POST') return res.status(405).json(\{ error: 'M\'e9thode non autoris\'e9e' \});\
  const \{ message \} = req.body || \{\};\
  if (!message) return res.status(400).json(\{ error: 'Message manquant' \});\
\
  const model = 'gpt2'; // mod\'e8le simple et gratuit sur Hugging Face\
\
  try \{\
    const hf = await fetch(`https://api-inference.huggingface.co/models/$\{model\}`, \{\
      method: 'POST',\
      headers: \{\
        'Authorization': `Bearer $\{process.env.HF_API_TOKEN\}`,\
        'Content-Type': 'application/json'\
      \},\
      body: JSON.stringify(\{ inputs: message \})\
    \});\
    const data = await hf.json();\
    let reply = '';\
    if (Array.isArray(data) && data[0]?.generated_text) reply = data[0].generated_text;\
    else if (data?.error) reply = 'Erreur mod\'e8le: ' + data.error;\
    else reply = JSON.stringify(data);\
    res.status(200).json(\{ reply \});\
  \} catch (err) \{\
    res.status(500).json(\{ error: String(err) \});\
  \}\
\}\
}