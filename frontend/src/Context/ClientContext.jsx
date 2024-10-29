import { createContext, useReducer, useEffect } from 'react';
import createImageSrc from '../utils/createImageSrc';
import useFetch from '../hooks/useFetch';

export const ClientContext = createContext(); // Creates context for the client

// Reducer for client data management
const clientReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CLIENT_DATA': // Sets the client's full name and profile picture
      return { 
        fullname: action.fullname, 
        profile_pic: action.profile_pic 
      };
    case 'DELETE_CLIENT_DATA': // Resets the client's full name and profile picture to null
      return {
        fullname: null,
        profile_pic: null
      };
    default: // Returns the current state for any unknown action type
      return state;
  }
};


export const ClientContextProvider = ({ children }) => {
  // Initialize the reducer with initial state for fullname and profile picture
  const [state, dispatch] = useReducer(clientReducer, { 
      fullname: null,
      profile_pic: null
  });

  // Custom hook to fetch client data from API
  const { data: clientData } = useFetch('/api/client');

  // Effect to process and set client data when it's available
  useEffect(() => {
      const processClientData = async () => {
          if (clientData) {
              try {
                  // Check if profile picture data exists and generate image source
                  const profilePicSrc = clientData.profile_pic?.data ?
                  await createImageSrc(clientData.profile_pic?.data) : null;
                  
                  // Dispatch action to set client fullname and profile picture
                  dispatch({
                      type: 'SET_CLIENT_DATA',
                      fullname: `${clientData.firstname} ${clientData.lastname}`,
                      profile_pic: profilePicSrc
                  });
              } catch (err) {
                  // Log any errors encountered during client data processing
                  console.error('Error processing client data:', err);
              }
          }
      };
      processClientData(); // Call the async function to handle client data
  }, [clientData]); // Dependency array to trigger effect when clientData changes

  return (
      // Provide the state and dispatch function to the context consumers
      <ClientContext.Provider value={{ ...state, dispatch }}>
          {children}
      </ClientContext.Provider>
  );
};

