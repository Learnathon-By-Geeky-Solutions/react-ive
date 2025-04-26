import { useEffect, useState } from "react"
import { BACKEND_URL } from "../utils/servicesData";

const useGetUser = (userId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/auth/getUserById/${userId}`);
                if(!res.ok) {
                    throw new Error("Failed to fetch user");
                }
                const userData = await res.json();
                setData(userData)
            } catch (error) {
                console.error(error.message)
            } finally {
                setLoading(false);
            }
        };
        if(userId) {
            fetchUser();
        }
    },[userId]);
    return {data,loading};
}

export default useGetUser;