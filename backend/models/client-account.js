import { DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const client_account = sequelize.define('client_account', {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'Username cannot be empty'
            },
            minLength(value) {
                if (value.length < 8) {
                    throw new Error('Username must be at least 8 characters long.');
                }
            },
            maxLength(value) {
                if (value.length > 20) {
                    throw new Error('Username cannot be more than 20 characters long.');
                }
            }
        }
    }, 
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Password cannot be empty'
            },
            minLength(value) {
                if (value.length < 8) {
                    throw new Error('Password must be at least 8 characters long.');
                }
            },
            maxLength(value) {
                if (value.length > 20) {
                    throw new Error('Password cannot be more than 20 characters long.');
                }
            }
        }
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Firstname cannot be empty'
            },
            maxLength(value) {
                if (value.length > 50) {
                    throw new Error('Firstname is too long.');
                }
            }
        }
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Lastname cannot be empty'
            },
            maxLength(value) {
                if (value.length > 50) {
                    throw new Error('Lastname is too long.');
                }
            }
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Address cannot be empty'
            },
            maxLength(value) {
                if (value.length > 100) {
                    throw new Error('Address is too long.');
                }
            }
        }
    },
    profile_pic: {
        type: DataTypes.BLOB,
        allowNull: true
    }
    }, {
    timestamps: false,
    hooks: {
        beforeCreate: async (account, options) => {
            // Log before creating and saving the user
            console.log('account about to be created & saved:', account);

            // Hash the password before saving
            if (account.password) {
                const salt = await bcrypt.genSalt();
                account.password = await bcrypt.hash(account.password, salt);
            }
        },

        afterCreate: async (account, options) => {
            console.log('new user was created & saved', account);
        },

    }
}

);

export default client_account;