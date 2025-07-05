import { createContext, useEffect, useState } from "react";

export const ToggleThemeContext = createContext()

export const ToggleThemeContextProvider = ({children}) =>{
const [light,setLight] = useState(()=>{
    const saved = localStorage.getItem("theme");
    return saved?JSON.parse(saved):true
})

useEffect(()=>{
 localStorage.setItem("theme",JSON.stringify(light))
},[light])

return(
    <ToggleThemeContext.Provider value={{light,setLight}}>
        {children}
    </ToggleThemeContext.Provider>
)
}