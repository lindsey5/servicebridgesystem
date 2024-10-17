// Error handling function
export const handleErrors = (err) => {
    let errors = { username: '', password: '' };

    // Incorrect username
    if (err.message === 'Username not found') {
        errors.username = 'Username not found';
    }

    // Incorrect password
    if (err.message === 'Incorrect password') {
        errors.password = 'Incorrect password';
    }

    if(err.name === 'SequelizeValidationError'){
        err.errors.forEach(err => {
            errors[err.path] = err.message;
        })
    }
    if(err.name === 'SequelizeUniqueConstraintError'){
        errors[err.errors[0].path] = 'Username is already used';
    }   

    return errors;
}
