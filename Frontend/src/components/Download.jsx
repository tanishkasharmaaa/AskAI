import { Button} from "@chakra-ui/react"
import { LuImageDown } from "react-icons/lu"

export default function Download ({link}){
    const light = JSON.parse(localStorage.getItem("theme"))
    const data = async()=>{
        const res = await fetch(link)
        return res.blob()
    }
    return(
    <Button bg={'null'} as="a"
  href={link} // example: "/path/to/image.jpg"
  download
  colorScheme="blue">
        <LuImageDown color={light==true?"black":"white"} />
      </Button>
   )
}