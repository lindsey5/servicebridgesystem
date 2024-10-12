import { createContext, useReducer, useEffect } from 'react';
import createImageSrc from '../utils/createImageSrc';
import useFetch from '../hooks/useFetch';

export const ClientContext = createContext();

const clientReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CLIENT_DATA':
      return { 
        fullname: action.fullname, 
        profile_pic: action.profile_pic 
      };
    case 'DELETE_CLIENT_DATA':
        return {
            fullname: null,
            profile_pic: null
        }
    default:
      return state;
  }
};

export const ClientContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(clientReducer, { 
        fullname: null,
        profile_pic: null
    });

    const { data: clientData } = useFetch('/api/client');

    useEffect(() => {
        const processClientData = async () => {
            if (clientData) {
                try {
                    const profilePicSrc = clientData.client.profile_pic?.data ?
                    await createImageSrc(clientData.client.profile_pic?.data) : null;
                    dispatch({
                        type: 'SET_CLIENT_DATA',
                        fullname: `${clientData.client.firstname} ${clientData.client.lastname}`,
                        profile_pic: profilePicSrc
                    });
                } catch (err) {
                    console.error('Error processing client data:', err);
                }
            }
        };
    processClientData(); 
  }, [clientData]);

  return (
    <ClientContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ClientContext.Provider>
  );
};
