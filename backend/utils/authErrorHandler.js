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

    // Duplicate entry
    if (err.name === 'SequelizeUniqueConstraintError') {
        errors.username = 'Username already exists';
        return errors;
    }

    // Validation errors
    if (err.name === 'SequelizeValidationError') {
        err.errors.forEach((error) => {
            errors[error.path] = error.message;
        });
    }

    return errors;
}
