import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import {CChart} from '@coreui/react-chartjs';
import './ProviderDashboard.css';
import EarningModal from "../../modals/EarningModal";

const ProviderDashboard = () => {
    const { data: monthlyIncome } = useFetch('/api/earning/provider/month');
    const { data: earningsToday } = useFetch('/api/earning/provider/today');
    const { data: totalTransactionToday } = useFetch('/api/provider/completed/transaction/total/today');
    const { data: totalTransactions } = useFetch('/api/provider/completed/transaction/total');
    const { data: completedTransactions } = useFetch('/api/provider/completed/transaction/today');
    const [showEarningModal, setShowEarningModal] = useState(false);
    const { data: balance } = useFetch('/api/provider/balance');

    useEffect(() => {
        document.title = "Dashboard | Provider";
    },[]);

    const CompletedTransactionRow = ({transaction}) => {

        return (
            <tr>
                <td>{`${transaction.client_account.firstname} ${transaction.client_account.lastname}`}</td>
                <td>{transaction.service_name}</td>
                <td>{'₱ ' + transaction.price.toLocaleString('en-US', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                })}</td>
                <td>{transaction.payment_method}</td>
                <td>{transaction.available_date.date}</td>
                <td>{transaction.time}</td>
                <td>{'₱ ' + transaction.ProviderEarning.earnings.toLocaleString('en-US', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                })}</td>
            </tr>
        )
    }

    return (
        <div className="provider-dashboard">
            <> 
            {showEarningModal && <EarningModal setShowEarningModal={setShowEarningModal}/>}
            <div className="top-section">
                <div className="earnings-summary">
                    <div>
                        <h2>Total Earnings Today:</h2>
                        <h2 id="this-day-earnings">
                            {earningsToday?.total_earnings ? '₱ ' + earningsToday.total_earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'No earnings today'}
                        </h2>
                    </div>
                    <img src="/icons/peso.png" />
                </div>
                <div className="completed-tasks-today">
                    <div>
                        <h2>Task Completed today:</h2>
                        <h2 id="completed-task-today">
                        {totalTransactionToday?.total_task_today ? totalTransactionToday.total_task_today : 'No transactions yet'}
                        </h2>
                    </div>
                    <img src="/icons/checked.png" />
                </div>
                <div className="completed-tasks">
                    <div>
                        <h2>Total Task Completed:</h2>
                        <h2 id="total-completed-task">
                        {totalTransactions?.total_tasks ? totalTransactions.total_tasks : 'No transactions yet'}
                        </h2>
                    </div>
                    <img src="/icons/checked.png" />
                </div>
            </div>
            <div className="dashboard-mid-section">
                <div className="chart-container">
                    <CChart
                        type="line"
                        style={{ width: '100%', height: '430px' }}
                        data={{
                            labels: [
                            "January", "February", "March", "April", "May", "June", 
                            "July", "August", "September", "October", "November", "December"
                            ],
                            datasets: [
                            {
                                label: "Monthly Incomes",
                                backgroundColor: "white",
                                borderColor: "rgb(110, 178, 255)",
                                pointBackgroundColor: "rgb(0, 119, 255)",
                                data: monthlyIncome,
                                pointRadius: 3,
                                tension: 0.2,
                            },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false, 
                            plugins: {
                            legend: {
                                display: true,
                            },
                            },
                        }}
                    />
                </div>
                <div className="account-balance">
                    <div>
                        <span>Total Balance</span>
                        <h1>₱ {balance?.balance.toLocaleString('en-US', {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1
                            })}
                        </h1>
                    </div>
                    <img src="/icons/wallet.png" alt="" />
                    <div className="buttons">
                        <button className="history-btn" onClick={()=> setShowEarningModal(true)}>History</button>
                        <button className="withdraw-btn">Withdraw</button>
                    </div>
                </div>
            </div>
            <div className="task-completed-container">
                <h2>Completed Task Today</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Service Name</th>
                            <th>Price</th>
                            <th>Payment Method</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Earnings</th>
                        </tr>
                    </thead>
                    <tbody>
                    {completedTransactions && completedTransactions.completed_transactions.map(transaction => <CompletedTransactionRow key={transaction.transaction_id} transaction={transaction}/>)}
                    </tbody>
                </table>
            </div>
            </>
        </div>
    )
}

export default ProviderDashboard;