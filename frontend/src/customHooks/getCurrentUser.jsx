import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"

const useCurrentUser=()=>{
    let dispatch=useDispatch()
    useEffect(()=>{
        const fetchUser=async ()=>{
            try {
                let result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
                dispatch(setUserData(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    },[dispatch])
}

export default useCurrentUser
