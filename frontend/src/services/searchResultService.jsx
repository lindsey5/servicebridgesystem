export const fetchSearchResults = async (searchTerm, state) => {
    try {
        const response = await fetch(`/api/provider/search-result?page=${state.currentPage}&limit=10`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_name: searchTerm,
                price: state.price,
                sortBy: state.sortBy
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