import { useEffect, useState } from "react"
import './Notifications.css'
import createImageSrc from "../../../utils/createImageSrc"
import { formatDate } from "../../../utils/formatDate";
import defaultProfilePic from '../../../assets/user (1).png';

const SenderPicture = ({image}) => {
    const [imgSrc, setImgSrc] = useState(defaultProfilePic);
    
    useEffect(() => {
        const processImage = async () => {
            if(image){
                setImgSrc(await createImageSrc(image))
            }

        }
        processImage();
    }, [image])


    return <img src={imgSrc} alt="" />
}

const timeDifference = (start, end) => {
    // Calculate the difference in years, months, and days
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    // Adjust for negative months or days
    if (months < 0) {
        months += 12;
        years -= 1;
    }

    if (days < 0) {
        const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0); // Last day of the previous month
        days += prevMonth.getDate();
    }

    // Calculate the total difference in milliseconds
    const diffInMilliseconds = end.getTime() - start.getTime();

    // Convert milliseconds to hours, minutes, and seconds
    const hours = Math.floor(diffInMilliseconds / (1000 * 3600));
    const minutes = Math.floor((diffInMilliseconds % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((diffInMilliseconds % (1000 * 60)) / 1000);

    // Return the largest meaningful unit first (year > month > day > hour > minute > second)
    if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (seconds > 0) {
        return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    } else {
        return "Just now"; 
    }
};

// Example Usage:
const start = new Date('2025-01-01T10:00:00');
const end = new Date('2027-04-15T12:34:56');
console.log(timeDifference(start, end)); // Output: "2 years, 3 months ago"


const NotificationsContainer = ({notifications, user, setLimit}) => {
    return(
        <div className="notifications-drop-down">
            <h1>Notifications</h1>
            <div className="notifications-container">
            {notifications && notifications.map((notification) => 
            <div 
                key={notification.id}
                className={`notif ${notification.status === 'unread' ? 'unread' : ''}`} 
                onClick={() => {
                    if(user === 'Provider') localStorage.setItem('activeButton', 5)
                    window.location.href =`/${user}/Transactions`
                }}
            >
                <SenderPicture image={notification.sender.profile_pic} />
                <div className="notif-content">
                    <h4>{notification.sender.firstname} {notification.sender.lastname}</h4>
                    <p style={{fontWeight: notification.status === 'unread' ? '700' : ''}}>{notification.message}</p>
                    <p className="date">{timeDifference(new Date(notification.created_at), new Date())}</p>
                </div>
            </div>
            )}
            </div>
            <button className="show-more" onClick={() => setLimit(prev => prev + 5)}>Show More</button>
        </div>
    )

}

const NotificationsButton = ({socket, user}) => {
    const [notifications, setNotifications] = useState([]);
    const [limit, setLimit] = useState(10);
    const [show, setShow] = useState(false);
    const [unread, setUnread] = useState();

    useEffect(() => {
        if(socket){
            socket.emit('notifications', limit);
            socket.on('notifications', (data) => {
               if(data?.notifications){
                setNotifications(data.notifications)
                setUnread(data.unread)
               }
            })

            socket.on('notification', (notification) => {
                setNotifications(prev => [notification, ...prev]);
                setUnread(prev => prev + 1)
            });

            return () => socket.off('notification')
        }
    }, [socket])

    useEffect(() => {
        if(socket) socket.emit('notifications', limit)
    }, [limit])

    return(
        <div className="notifications">
            <button className="notification-btn" onClick={async () => {
                if(show) socket.emit('notifications', limit)
                setShow(!show);
                socket.emit('read-notifications');
            }}>
            <img src="/icons/bell (1).png" alt="" />
            {unread > 0 && <span>{unread}</span> }
        </button>
        {show && <NotificationsContainer notifications={notifications} user={user} setLimit={setLimit}/>}
        </div>
    )
}

export default NotificationsButton