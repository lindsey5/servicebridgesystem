export const fetchSearchResults = async (service_name, state) => {
    try {
        const response = await fetch(`/api/provider/search-result?page=${state.currentPage}&limit=10`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_name,
                price: state.price,
                sortBy: state.sortBy,
                location: state.location
            })
        });
        if(response.ok){
            const result = await response.json();
            return result;
        }
        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
}