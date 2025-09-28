export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Message manquant' });

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: message })
      }
    );

    const data = await response.json();

    let reply = "Je n'ai pas pu analyser ton texte.";
    if (Array.isArray(data) && data[0]?.label && data[0]?.score) {
      const score = Math.round(data[0].score * 100);
      if (data[0].label === "POSITIVE") {
        reply = `Ta traduction semble correcte avec ${score}% de confiance.`;
      } else {
        reply = `Ta traduction semble incorrecte avec ${score}% de confiance. Essaie de revoir certains détails.`;
      }
    }

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
