export const addCategory = async (category_name, icon) => {
    if(confirm('Create new Category?')){
     try{
         const response = await fetch('/api/category',{
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                category_name,
                icon
             }),
         });
         if(response.ok){
             const result = await response.json();
             if(result.error){
                 alert(result.error);
             }else{
                 window.location.reload();
             }
         }
     }catch(error){
         console.log(error);
     }
    }
 }

 export const deleteCategory = async (category_name) => {
    if(confirm('Are you sure do you wan\'t to delete this category?')){
        try{
            const response = await fetch(`/api/category/${category_name}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
    
            if(result.error){
                alert(result.error)
            }
    
            if(response.ok){
                window.location.reload();
            }
    
        }catch(err){
            console.error(err);
        }
    }
}