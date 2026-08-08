function Login(){

  async function handleReq(){
     
    const res = await fetch('api/login', {
      method : "GET",
      headers : { "Content-Type" : "application/json" },
    })

  }

 

  return (
    <form className="flex flex-col py-20 px-10 mt-20 w-100 m-auto items-center justify-center border border-white/10 rounded-xl text-white">

      <label htmlFor="email" className="self-start" >Email</label>
      <input 
      id="email"
      type="text" 
      autoComplete="new-email"
      className="border border-white/20 w-full px-2 py-1 rounded-md bg-black/20 text-[18px]" 
      placeholder="exmaple@email.com"
      required></input>

      <label htmlFor="password" className="self-start mt-10">Password</label>
      <input
      id="password"
      type="password"
      autoComplete="new-password" 
      className="border border-white/20 w-full px-2 py-1 rounded-md bg-black/20 text-[18px]" 
      placeholder="**********"
      required></input>

      <input
      type="submit"
      className="mt-10 border border-white/10 rounded-md w-full py-1 bg-black cursor-pointer text-[18px]"
      value="Login"
      ></input>

      <p className="text-[14px] mt-1">New User? <a href="/register" className="text-white/50">Register</a></p>
      
    </form>
  )
}

export default Login