import React from 'react'
import CryptApi from "../api";


export const cryptApiContext = React.createContext(new CryptApi(process.env.REACT_APP_API_ENDPOINT as string))