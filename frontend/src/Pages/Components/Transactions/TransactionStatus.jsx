
const TransactionStatus = ({transaction}) =>{
    if (transaction.status === 'Cancelled' || transaction.status === 'Declined' || transaction.status === 'Expired') {
       return <td className='red-td'><p>{transaction.status}</p></td>;
    } else if (transaction.status === 'Requested' || transaction.status === 'On Going' || transaction.status === 'Accepted') {
        return <td className='blue-td'><p>{transaction.status}</p></td>;
    } else {
        return <td className='green-td'><p>{transaction.status}</p></td>;
    }
}

export default TransactionStatus