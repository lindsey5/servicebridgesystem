import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import {CChart} from '@coreui/react-chartjs';
import '../styles/Dashboard.css'

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  function generateRandomColors(count = 10) {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(getRandomColor());
    }
    return colors;
  }

const AdminDashboard = () => {
    const { data: monthlyIncome } = useFetch('/api/earning/company/month');
    const { data: earningsToday } = useFetch('/api/earning/company/today');
    const { data: providersCount } = useFetch('/api/provider/count');
    const { data: services } = useFetch('/api/services');
    const { data: topServices } = useFetch('/api/services/top');

    useEffect(() => {
        document.title = "Dashboard | Admin";
    },[]);

    return (
        <div className="dashboard">
            <div className="top-section">
                <div>
                    <div>
                        <h2>Total Earnings Today:</h2>
                        <h2>
                            {earningsToday?.total_earnings ? '₱ ' + earningsToday.total_earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'No earnings today'}
                        </h2>
                    </div>
                    <img src="/icons/peso.png" />
                </div>
                <div>
                    <div>
                        <h2>Total Providers:</h2>
                        <h2>
                            {providersCount?.providers_count ? providersCount.providers_count : 'No Providers'}
                        </h2>
                    </div>
                    <img src="/icons/peso.png" />
                </div>
                <div>
                    <div>
                        <h2>Total Services:</h2>
                        <h2>
                            {services?.services ? services.services.length : 'No Services'}
                        </h2>
                    </div>
                    <img src="/icons/peso.png" />
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
                                label: "Monthly Earnings",
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
                <div className='pie-container'>
                    <CChart
                        type="pie"
                        style={{ width: '80%',  height: '380px' }}
                        data={{
                            labels: topServices?.services.length > 0 && topServices.services.map(service => service.service_name),
                            datasets: [
                            {   
                                backgroundColor: generateRandomColors(topServices?.length),
                                data:  topServices?.services.length > 0 && topServices.services.map(service => service.service_count),
                            },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false, 
                        }}
                    />
                    <p>Top 10 Trend Services</p>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard;