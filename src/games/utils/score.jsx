export async function submitScore(gameId, score) {
  try {
    const res = await fetch('/api/score/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ gameId, score })
    })

    if (!res.ok) {
      console.error('Failed to submit score')
      return null
    }

    return await res.json() // { msg, isNewHighScore, isFirstPlay }
  } catch (error) {
    console.error(error)
    return null
  }
}