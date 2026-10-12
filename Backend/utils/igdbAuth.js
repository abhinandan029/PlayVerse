let cachedToken = null
let tokenExpiresAt = 0
const TOKEN_REQUEST_ATTEMPTS = 3
const TOKEN_REQUEST_TIMEOUT_MS = 15000
const wait = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds))

export async function getIgdbToken(){

  if( cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken
  }

  for(let attempt = 1; attempt <= TOKEN_REQUEST_ATTEMPTS; attempt++){
    try {
      const res = await fetch("https://id.twitch.tv/oauth2/token", {
        method : "POST",
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Connection' : 'close',
        },
        body : new URLSearchParams({
          client_id : process.env.IGDB_CLIENT_ID,
          client_secret : process.env.IGDB_CLIENT_SECRET,
          grant_type : 'client_credentials'
        }),
        signal : AbortSignal.timeout(TOKEN_REQUEST_TIMEOUT_MS),
      })

      if(!res.ok){
        const errorText = await res.text()
        throw new Error(`Failed to obtain IGDB access token: ${res.status} - ${errorText}`)
      }

      const data = await res.json()
      cachedToken = data.access_token
      tokenExpiresAt = Date.now() + Math.max(60, data.expires_in - 300) * 1000
      return cachedToken
    } catch(error) {
      if(attempt === TOKEN_REQUEST_ATTEMPTS) throw error
      console.warn(`IGDB token request failed (attempt ${attempt}/${TOKEN_REQUEST_ATTEMPTS}), retrying...`, error)
      await wait(attempt * 1000)
    }
  }
}