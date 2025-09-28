export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { message } = req.body || {};
  console.log("Message reçu:", message);

  // On renvoie juste un texte fixe
  res.status(200).json({ reply: "Bonjour ! Je reçois ton message : " + message });
}
