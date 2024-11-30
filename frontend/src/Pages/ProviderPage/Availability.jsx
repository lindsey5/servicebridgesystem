import React, { useState, useEffect} from 'react';
import './Availability.css';
import AvailableDateServices from '../Components/Availability/AvailableDateServices';
import TimeSlots from '../Components/Availability/TimeSlots';

const Availability = () => {
    const [date, setDate] = useState(new Date());
    const [availableDates, setAvailableDates] = useState([]);
    const [availableDateServices, setAvailableDateServices] = useState([]);
    const [selectedDate, setSelectedDate] = useState();
    const [showServices, setShowServices] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false)

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

    const get_available_date_services = (selectedDate) => {
       return fetch(`/api/available-date-services/${selectedDate}`)
        .then(response => response.json())
        .then(result => setAvailableDateServices(result))
    }

    const handleDateClick = async (day) => {
        const selectedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const currentDate = new Date().toISOString().split('T')[0];
        const flag = await isDateExist(selectedDate);

        if (flag || selectedDate < currentDate) {
            setSelectedDate(selectedDate);
            get_available_date_services(selectedDate);
            setShowServices(true);
        } else {
            if (confirm("Add this date to your availability?")) {
                if(addDate(selectedDate)){
                    window.location.reload();
                }else{
                    alert("Error adding date")
                }
            }
        }
    };

    
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

    return (
        <div className="availability">
            {showTime && <TimeSlots selectedDate={selectedDate} close={() => setShowTime(false)}/>}
            {showInstructions && 
                <div className='instructions'>
                    <div className='container'>
                        <span onClick={() => setShowInstructions(false)}>X</span>
                        <h2>Instructions</h2>
                        <h3>Choose a date</h3>
                        <li>Select the specific date.</li>
                        <h3>Set time slots</h3>
                        <li>For the chosen date, specify your available start and end times when you will be able to provide services.</li>
                        <h3>Select services</h3>
                        <li>After setting the date, choose the services you would like to offer on that particular date. You can select one or more services depending on what you’re able to provide.</li>
                    </div>
                </div>
            }
            <div className='top-section'>
                <h1>Set Your Availability</h1>
                <span onClick={() => setShowInstructions(() => setShowInstructions(true))}>Instructions</span>
            </div>
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
            {showServices && <AvailableDateServices selectedDate={selectedDate} availableDateServices={availableDateServices} setShowTime={() => setShowTime(true)}/>}
        </div>
    );
};

export default Availability;
