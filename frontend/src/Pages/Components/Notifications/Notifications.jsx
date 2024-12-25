import { useEffect, useState } from "react"
import './Notifications.css'
import createImageSrc from "../../../utils/createImageSrc"
import { formatDate } from "../../../utils/formatDate";


const SenderPicture = ({image}) => {
    const [imgSrc, setImgSrc] = useState();
    
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

const NotificationsContainer = ({notifications, user, setLimit, setShow}) => {
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
                <div>
                    <p style={{fontWeight: notification.status === 'unread' ? '700' : ''}}>{notification.message}</p>
                    <p>{formatDate(notification.created_at)}</p>
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
                setNotifications(data.notifications)
                setUnread(data.unread)
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
                setShow(!show);
                await socket.emit('read-notifications');
                await socket.emit('notifications', limit);
            }}>
            <img src="/icons/bell (1).png" alt="" />
            {unread > 0 && <span>{unread}</span> }
        </button>
        {show && <NotificationsContainer notifications={notifications} user={user} setLimit={setLimit}/>}
        </div>
    )
}

export default NotificationsButton