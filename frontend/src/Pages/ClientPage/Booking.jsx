import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import './Booking.css';
import { useState, useEffect } from 'react';

const Booking = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const encodedData = queryParams.get('data');
    const decodedData = decodeData(encodedData);
    const id = decodedData.id;
    const service_name = decodedData.service_name;
    const price = decodedData.price;
    const fullname = decodedData.firstname + ' ' + decodedData.lastname;
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [showDateDropDown, setDateDropDown] = useState(false);
    const [showTimeDropDown, setTimeDropDown] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const { data: dates } = useFetch(`/api/provider/available-dates?provider_id=${id}&isFiltered=true`);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Book a Service";
    },[]);

    function decodeData (encodedData) {
        try {
            return JSON.parse(window.atob(decodeURIComponent(encodedData)));
        } catch (error) {
            console.error('Error decoding data:', error);
        }
    }

    const handleDateDropDown = () => {
        if(dates){
            setDateDropDown(!showDateDropDown);
        }
    }

    const handleTimeDropDown = () => {
        setTimeDropDown(!showTimeDropDown);
    }

    const generateTimeSlots = () => {
        const times = [];
        const startTime = 7 * 60 + 30; // 7:30 AM in minutes
        const endTime = 22 * 60 + 30; // 10:30 PM in minutes
        
        // Check if the selected date is today
        const today = new Date();
        const selected = new Date(selectedDate);
    
        let thresholdTime = startTime;
    
        if (today.toDateString() === selected.toDateString()) {
            // If the selected date is today, calculate the current time and add 1 hour
            const currentTime = today.getHours() * 60 + today.getMinutes();
            thresholdTime = currentTime + 60; // 1 hour from now
        }
        
        // Generate time slots
        for (let minutes = startTime; minutes <= endTime; minutes += 30) {
            if (minutes >= thresholdTime) { // Only add times greater than 1 hour from now if today
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                const period = hours >= 12 ? 'PM' : 'AM';
                const adjustedHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
                const formattedTime = `${adjustedHour}:${mins === 0 ? '00' : mins} ${period}`;
                times.push(formattedTime);
            }
        }
    
        return times.map((time, index) => (
            <li key={index} onClick={() => handleSelectedTime(time)}>{time}</li>
        ));
    };
    
    const handleSelectedDate = (selectedDate) => {
        setSelectedDate(selectedDate);
        handleDateDropDown();
    }

    const handleSelectedTime = (selectedTime) => {
        setSelectedTime(selectedTime);
        handleTimeDropDown();
    }

    const goToTransactionSummary = () => {
        if(paymentMethod && selectedDate && selectedTime){
            navigate('/Client/Transaction/Summary',{
                state: {
                    provider: id,
                    service_name,
                    price,
                    paymentMethod,
                    date: selectedDate,
                    time: selectedTime,
                    provider_fullname: fullname
                }
            });
        }else if(!selectedDate){
            alert('Select Date');
        }else if(!selectedTime){
            alert('Select Time');
        }else if(!paymentMethod){
            alert('Select Payment Method');
        }
    }

    return (
        <div className="booking">
            <div className="booking-container">
                <h2>Select Date</h2>
                <div className="drop-down">
                    <button className="select-btn" id='select-date-btn' onClick={handleDateDropDown}>
                        { selectedDate ? selectedDate : 'Select Date'}
                    </button>
                    <img className='drop-down-icon' id="date-icon" src="/icons/down.png" alt="date icon" />
                    <ul id="drop-down-dates" style={{display: showDateDropDown ? 'flex' : 'none'}}>
                    {
                        dates && (
                            dates.map((date, index) => {
                                const dateObj = new Date(JSON.stringify(date.date));
                                const formatter = new Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });
                                const formattedDate = formatter.format(dateObj);
                                return <li key={index} onClick={() => handleSelectedDate(formattedDate)}>{formattedDate}</li>
                            })
                        )
                    }
                    </ul>
                </div>
                <h2>Select Time</h2>
                <div className="drop-down">
                    <button className="select-btn" id="select-time-btn" onClick={handleTimeDropDown}>
                        { selectedTime ? selectedTime : 'Select Time'}
                    </button>
                    <img className='drop-down-icon' id="time-icon" src="/icons/down.png" alt="time icon" />
                    <ul id="drop-down-time" style={{display: showTimeDropDown && selectedDate ? 'flex' : 'none'}}>{generateTimeSlots()}</ul>
                </div>
                <h3>Payment method</h3>
                <div className="payment">
                    <div><img src="/icons/coin.png" alt="cash icon" />Cash on Pay (Not available)</div>
                    <input type="radio" disabled name="payment" onClick={() => setPaymentMethod('Cash on Pay')} className="payment-radio" />
                </div>
                <div className="payment">
                    <div><img src="/icons/credit-card.png" alt="credit card icon" />Other</div>
                    <input type="radio" name="payment" onClick={() => setPaymentMethod('Online Payment')} className="payment-radio" />
                </div>
                <button className="next-btn" onClick={goToTransactionSummary}>Next</button>
            </div>
        </div>
    )
}

export default Booking;