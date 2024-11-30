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
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Book a Service";
    },[]);

    useEffect(() => {
        const getTimeSlot = async () => {
            try{
                const response = await fetch(`/api/available-time/provider?date=${selectedDate}&&id=${id}`)
                if(response.ok){
                    const result = await response.json();
                    const timeSlots = result.time_slot.split(' to ');
                    setStartTime(timeSlots[0]);
                    setEndTime(timeSlots[1]);
                }
            }catch(err){
                console.error(err)
            }
        }
        getTimeSlot();
    }, [selectedDate]);

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

    // Convert time string to minutes (e.g., '2:30 PM' -> 870 minutes)
    function parseTimeToMinutes(timeStr) {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);

        let totalMinutes = hours * 60 + minutes;
        if (period === 'PM' && hours !== 12) {
        totalMinutes += 12 * 60; // Add 12 hours for PM times (except 12 PM)
        }
        if (period === 'AM' && hours === 12) {
        totalMinutes -= 12 * 60; // Subtract 12 hours for 12 AM (midnight)
        }

        return totalMinutes;
    }

    const generateTimeSlots = () => {
        const times = [];
        const startingTime = startTime ? parseTimeToMinutes(startTime) : 7 * 60 + 30;
        const endingTime = startTime ? parseTimeToMinutes(endTime) :  22 * 60 + 30;
        // Check if the selected date is today
        const today = new Date();
        const selected = new Date(selectedDate);
    
        let thresholdTime = startingTime;
    
        if (today.toDateString() === selected.toDateString()) {
            // If the selected date is today, calculate the current time and add 1 hour
            const currentTime = today.getHours() * 60 + today.getMinutes();
            thresholdTime = currentTime + 60; // 1 hour from now
        }
        
        // Generate time slots
        for (let minutes = startingTime; minutes <= endingTime; minutes += 30) {
            if (minutes >= thresholdTime) { 
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
                    <ul style={{display: showDateDropDown ? 'flex' : 'none'}}>
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
                                return <li key={index} onClick={() => {
                                    handleSelectedDate(formattedDate)
                                    setSelectedTime();
                                }}>{formattedDate}</li>
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
                    <ul style={{display: showTimeDropDown && selectedDate ? 'flex' : 'none'}}>{generateTimeSlots()}</ul>
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