
export const setToOngoing = (transaction_id) => {
    if (confirm('Do you want to mark this transaction as ongoing?')) {
        updateTransaction(transaction_id, 'On Going');
    }
}

export const finishTransaction = (transaction_id) => {
    if (confirm('Task finished?')) {
        updateTransaction(transaction_id, 'Finished');
    }
}

export const acceptTransaction = (transaction_id) => {
    if (confirm('Do you really want to accept this transaction?')) {
        updateTransaction(transaction_id, 'Accepted');
    }
}
