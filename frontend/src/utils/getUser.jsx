import { useRef } from "react";
import useFetch from "../hooks/useFetch.jsx";

const getUser = () => {
    const counter = useRef(0);
    const user = localStorage.getItem('user');
    const { data: cookieData } = useFetch('/api/user');
    const parseUser = user ? JSON.parse(user) : null;
    const isCookieExist = cookieData?.user ? true : false;
    
    if(!isCookieExist && counter.current > 0){
        counter.current = 0;
        localStorage.removeItem('user');
        return { user: null }
    }else if(isCookieExist){
        counter.current = 0;
        localStorage.setItem('user', JSON.stringify({ user: cookieData.user }));
    }
    counter.current ++;
    return { user: parseUser?.user };
};

export default getUser;

