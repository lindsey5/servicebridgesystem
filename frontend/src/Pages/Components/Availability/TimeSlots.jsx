import { useState } from 'react';
import './TimeSlots.css'

const set_available_time = async (selected_date, time_slot) => {
    try{
        const response = await fetch('/api/available-time',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: selected_date,
                time_slot
             }), 
        })
        const result = await response.json();
        if(response.ok){
            window.location.reload();
        }
        if(result.error){
            setError(result.error);
        }

    }catch(err){

    }
}

const TimeSlots = ({selectedDate, close}) => {
    const [startTime, setStartTime] = useState('0:00');
    const [endTime, setEndTime] = useState('0:00');
    const [showStartTime, setShowStartTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);

    const generateTimeSlots = (startingTime, setTime) => {
        const times = [];
        const startTime = startingTime;
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
            <li key={index} onClick={() => setTime(time)}>{time}</li>
        ));
    };

     // Convert time string to minutes (e.g., '7:30 AM' -> 450 minutes)
  function parseTimeToMinutes(timeStr) {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    let totalMinutes = hours * 60 + minutes + 30;
    if (period === 'PM' && hours !== 12) {
      totalMinutes += 12 * 60; // Add 12 hours for PM times (except 12 PM)
    }
    if (period === 'AM' && hours === 12) {
      totalMinutes -= 12 * 60; // Subtract 12 hours for 12 AM (midnight)
    }
    return totalMinutes;
  }

    return(
        <div className="available-time">
            <div className="container">
                <h2>Set Your Available Time</h2>
                <div className='time-container'>
                    <div onClick={() => setShowStartTime(prev => !prev)}>
                        {startTime}
                        {showStartTime && 
                        <div className='time-slots' onClick={() => setEndTime('0:00')}>
                            {generateTimeSlots(7 * 60 + 30, setStartTime)}
                        </div>}
                    </div>
                    <div onClick={() => setShowEndTime(prev => !prev)}>
                        {endTime}
                        {showEndTime && 
                        <div className='time-slots'>
                            {generateTimeSlots(parseTimeToMinutes(startTime), setEndTime)}
                        </div>}
                    </div>
                </div>
                <button className='set-btn' onClick={() => set_available_time(selectedDate, `${startTime} to ${endTime}`)}>Set Time</button>
                <button onClick={close}>Close</button>
            </div>
        </div>
    )
}

export default TimeSlots;