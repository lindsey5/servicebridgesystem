import React, { useState, useEffect} from 'react';
import './availability.css';

const Availability = () => {
    const [date, setDate] = useState(new Date());
    const [availableDates, setAvailableDates] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showTransactions, setShowTransactions] = useState(false);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        document.title = "Availability | Provider";
        fetchAvailableDates();
    }, []);

    const fetchAvailableDates = async () => {
        try {
            const response = await fetch('/api/provider/available-dates'); 
            if(response.ok){
                const result = await response.json();
                setAvailableDates(result);
            }
        } catch (error) {
            console.error('Error fetching available dates:', error);
            setAvailableDates([]);
        }
    };

    const isDateExist = async (date) => {
        const response = await fetch(`/api/provider/available-date?date=${date}`);
        const result = await response.json();
        return result.available_date ? true : false
        
    }

    const addDate = async (date) => {
        return fetch(`/api/provider/available-date`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date }),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(result => {
            if(result){
                return true;
            }
            return false;
        })
        .catch(err => {
            return false;
        });
    }

    const handleDateClick = async (day) => {
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const currentDate = new Date().getDate();
        const selectedDate = new Date(formattedDate).getDate();
        console.log(currentDate);
        console.log(selectedDate);
        const flag = await isDateExist(formattedDate);
        setShowTransactions(false);
        if (flag || selectedDate < currentDate) {
            setSelectedDate(formattedDate);
            setShowTransactions(true);
            fetchTransactionsByDate(formattedDate);
        } else {
            if (confirm("Add this date to your availability?")) {
                if(addDate(formattedDate)){
                    window.location.reload();
                }else{
                    alert("Error adding date")
                }
            }
        }
    };

    const fetchTransactionsByDate = (date) => {
        fetch(`/api/transactions/${date}`)
        .then(response => response.json())
        .then(result=> setTransactions(result.transactions))
    }

    
    const renderCalendar = () => {
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
        const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

        const days = [];

        // Fill in previous month's days
        for (let i = firstDayOfMonth; i > 0; i--) {
            days.push(<li className="inactive" key={`prev-${i}`}>{lastDayOfPrevMonth - i + 1}</li>);
        }
        // Fill in current month's days
        for (let i = 1; i <= lastDateOfMonth; i++) {
            const isToday = i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            
            const isAvailable = availableDates && availableDates.some(availDate => {
                const availDateObj = new Date(availDate.date);
                return availDateObj.getDate() === i && availDateObj.getMonth() === month && availDateObj.getFullYear() === year;
            });
            days.push(
                <li
                    className={`${isToday ? 'active' : ''} ${isAvailable ? 'available' : ''}`}
                    key={i}
                    onClick={() => handleDateClick(i)}
                >
                    {i}
                </li>
            );
        }

        // Fill in next month's days
        const lastDayOfMonth = new Date(year, month, lastDateOfMonth).getDay();
        for (let i = lastDayOfMonth + 1; i <= 6; i++) {
            days.push(<li className="inactive" key={`next-${i}`}>{i - lastDayOfMonth}</li>);
        }

        return days;
    };


    const TransactionsDiv = ({ transactions }) => {
        return (
          <div>
            <div className="transactions-container">
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => {
                  // Determine status color
                  let statusClass = '';
                  if (transaction.status === 'Cancelled' || transaction.status === 'Declined' || transaction.status === 'Expired') {
                    statusClass = 'red';
                  } else if (
                    transaction.status === 'Completed' ||
                    transaction.status === 'Finished' ||
                    transaction.status === 'Reviewed'
                  ) {
                    statusClass = 'green';
                  } else {
                    statusClass = 'blue';
                  }
      
                  return (
                    <div key={index}>
                      <h3>{transaction.time}</h3>
                      <p>{transaction.service_name}</p>
                      <p className={statusClass}>{transaction.status}</p>
                    </div>
                  );
                })
              ) : (
                <div>
                  <h3>No Task for this date</h3>
                </div>
              )}
            </div>
          </div>
        );
      };

    return (
        <div className="availability">
            <div className="calendar-container">
                <div className="legend">
                    <div><span id="today"></span>Today</div>
                    <div><span id="available-day"></span>Available Date</div>
                </div>
                <div className="calendar-header">
                    <p className="calendar-current-date">{`${months[date.getMonth()]} ${date.getFullYear()}`}</p>
                    <div className="calendar-navigation">
                        <span
                            id="calendar-prev"
                            className="material-symbols-rounded"
                            onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1))}
                        >{"<"}</span>
                        <span
                            id="calendar-next"
                            className="material-symbols-rounded"
                            onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1))}
                        >{">"}</span>
                    </div>
                </div>
                <div className="calendar-body">
                    <ul className="calendar-weekdays">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                            <li key={index}>{day}</li>
                        ))}
                    </ul>
                    <ul className="calendar-dates">
                        {renderCalendar()}
                    </ul>
                </div>
            </div>
            <div className="transactions-div" style={{ display: showTransactions ? 'flex' : 'none' }}>
                <div className="transactions-header">
                    <h2>{selectedDate}</h2>
                </div>
                <TransactionsDiv transactions={transactions}/>
            </div>
        </div>
    );
};

export default Availability;
