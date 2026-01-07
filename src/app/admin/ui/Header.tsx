import {removeToken} from "@/app/utils/auth"
const Header = ()=>{
    function logout(){
        removeToken()
        window.location.href = "/"
    }

    return (
        <header className="w-full h-[50px] flex items-center justify-between">
             <h1>hello</h1>
             <button onClick={()=>logout()}>Logout</button>
        </header>
    )
    
}

export default Header