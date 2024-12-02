export const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Custom format (MM-DD-YYYY HH:mm:ss)
    const formattedDate = date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      
      // Manipulate the string to match the format 'MM-DD-YYYY (hh:mmAM/PM)'
      const finalFormattedDate = formattedDate.replace(',', '').replace(' ', ' (');
      const result = finalFormattedDate + ')';
      return result
}