// api/chat.js (fonction serverless pour Vercel)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Message manquant' });

  const model = 'distilgpt2'; // modèle gratuit et disponible pour API Inference

  try {
    const hf = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: message })
    });

    const data = await hf.json();
    let reply = '';
    if (Array.isArray(data) && data[0]?.generated_text) reply = data[0].generated_text;
    else if (data?.error) reply = 'Erreur modèle: ' + data.error;
    else reply = JSON.stringify(data);

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
