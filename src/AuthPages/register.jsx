function Register(){
 

  return (
    <>
      <a href="http://localhost:3000/auth/google"><button>Login with google</button></a>

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

        <label htmlFor="confirm-password" className="self-start mt-5">Confirm Password</label>
        <input
        id="confirm-password"
        type="password"
        autoComplete="new-password" 
        className="border border-white/20 w-full px-2 py-1 rounded-md bg-black/20 text-[18px]" 
        placeholder="**********"
        required></input>
    
        <div className="self-start flex p-1 items-center justify-center mt-10">
          <input
          id="tandc"
          type="checkbox"
          className=" cursor-pointer"
          required></input>
          <label htmlFor="tandc" className="ml-1 text-[13px] ">accept the terms and conditions</label>
        </div>
        

        <input
        type="submit"
        className="mt-1 border border-white/10 rounded-md w-full py-1 bg-black cursor-pointer text-[18px]"
        value="Register"
        ></input>

        <p className="text-[14px] mt-1">Already have an account? <a href="/login" className="text-white/50">Login</a></p>
        
      </form>


    </>

    
  )
}

export default Register