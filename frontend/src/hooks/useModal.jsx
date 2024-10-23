import { useState } from 'react';

// Custom hook to update the visibility of a modal
const useModal = () => {
  // State for visibility of the modal
  const [isVisible, setIsVisible] = useState(false);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);
  
  return {
    isVisible,
    show,
    hide
  };
};

export default useModal;
