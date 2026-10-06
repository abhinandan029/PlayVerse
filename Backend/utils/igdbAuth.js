let cachedToken = null
let tokenExpiresAt = 0

export async function getIgdbToken(){

  if( cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken
  }

  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method : "POST",
    headers : { 'Content-Type' : 'application/x-www-form-urlencoded'},
    body : new URLSearchParams({
      client_id : process.env.IGDB_CLIENT_ID,
      client_secret : process.env.IGDB_CLIENT_SECRET,
      grant_type : 'client_credentials'
    })
  })

  if(!res.ok){
    throw new Error("Failed to obtain IGDB access token") 
  }

  const data = await res.json()

  cachedToken = data.access_token
  tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000
  
  return cachedToken
}