import { createClient } from '@sanity/client';
import { client } from './sanity';
import axios from 'axios';


let sanityQuery = (query, params) => client.fetch(query, params);

export const getEvents = () => {
    return sanityQuery(`
    *[_type == 'event']{
        ...,
        category[]->{
            ...,
        },
        author[]->{
            ...,
        }
           
    }
    `)
}

export const getAds = async () => {
    try {
        const response = await axios.get('');
        const ads = response.data;

    } catch (error) {
        console.log(error);

    }

}




export const getUserdata = ({email,userdata,setUserdata,setLoading,userEmail}) => {
    setLoading(true);
    fetch("https://opasso-app-backend.vercel.app/api/user/usersdata")
        .then((response) => response.json())
        .then((data) => {
            setLoading(false);
            const seller = data.find((item) => item.email === email || userEmail);
            if (seller) {
                setUserdata(seller);
            }
        })
        .catch((error) => {
            console.log(error);
        })
}


export const getUserdataAndUpdate = ({setUserdata,setLoading,userEmail,session}) => {
    fetch("https://opasso-app-backend.vercel.app/api/user/usersdata")
        .then((response) => response.json())
        .then((data) => {
            setLoading(false);
            const sellerid = data.find((item) => item.email ===  userEmail);
            if (sellerid) {
                setUserdata(sellerid);
            }
        })
        .catch((error) => {
            console.log(error);
        })
}