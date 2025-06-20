const { Client } = require('pg');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { nick, resultType, portfolioValue, returnPercent } = JSON.parse(event.body);
  console.log("⬇️ Dane otrzymane z frontendu:", {
  nick,
  resultType,
  portfolioValue,
  returnPercent
});
	
	
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const query = `
      INSERT INTO results (nick, result_type, portfolio_value, return_percent)
      VALUES ($1, $2, $3, $4)
    `;
    await client.query(query, [nick, resultType, portfolioValue, returnPercent]);
	console.log("✅ Dane zapisane pomyślnie do Neon");
    await client.end();

    return { statusCode: 200, body: JSON.stringify({ message: 'Zapisano wynik' }) };
  } catch (error) {
		console.error("❌ Błąd zapisu do Neon:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.message })
  };
}
};
