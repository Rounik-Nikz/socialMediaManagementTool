import { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

const CalendarView = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      const formattedEvents = response.data.map(post => ({
        id: post._id,
        title: `${post.platform}: ${post.text.substring(0, 30)}...`,
        start: post.scheduledDate,
        backgroundColor: getPlatformColor(post.platform),
        borderColor: getPlatformColor(post.platform),
        textColor: '#ffffff',
        extendedProps: {
          platform: post.platform,
          text: post.text,
          status: post.status
        }
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const getPlatformColor = (platform) => {
    const colors = {
      Instagram: '#E1306C',
      Twitter: '#1DA1F2',
      LinkedIn: '#0077B5',
      Facebook: '#4267B2'
    };
    return colors[platform] || '#666666';
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Calendar View</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventClick={(info) => {
            alert(`
              Platform: ${info.event.extendedProps.platform}
              Status: ${info.event.extendedProps.status}
              Text: ${info.event.extendedProps.text}
            `);
          }}
          height="auto"
        />
      </div>
    </div>
  );
};

export default CalendarView; 