// Error handling function
export const handleErrors = (err) => {
    let errors = { email: '', password: '' };
    // Incorrect email
    if (err.message === 'Email not found') {
        errors.email = 'Email not found';
    }

    // Incorrect password
    if (err.message === 'Incorrect password') {
        errors.password = 'Incorrect password';
    }

    if( err.message === 'Email already used'){
        errors.email = 'Email is already used'
    }

    if(err.name === 'SequelizeValidationError'){
        err.errors.forEach(err => {
            errors[err.path] = err.message;
        })
    }
    if(err.name === 'SequelizeUniqueConstraintError'){
        errors[err.errors[0].path] = 'Email is already used';
    }   

    return errors;
}
