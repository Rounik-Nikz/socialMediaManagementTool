import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const CalendarView = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching posts with token:', token ? 'Token present' : 'No token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axiosInstance.get('/posts/scheduled', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Response data:', response.data);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }

      const formattedEvents = response.data.map(post => ({
        id: post._id,
        title: `${post.platforms?.[0] || 'Unknown'}: ${post.title || post.content.substring(0, 30)}...`,
        start: post.scheduledDate,
        backgroundColor: getPlatformColor(post.platforms?.[0]),
        borderColor: getPlatformColor(post.platforms?.[0]),
        textColor: '#ffffff',
        extendedProps: {
          platform: post.platforms?.[0],
          text: post.content,
          topic: post.title,
          status: post.status,
          mediaFileName: post.mediaUrl
        }
      }));
      console.log('Formatted events:', formattedEvents);
      setEvents(formattedEvents);
      setError('');
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.status === 404) {
        setError('Scheduled posts endpoint not found. Please check the API configuration.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message === 'No authentication token found') {
        setError('Please log in to view scheduled posts');
      } else {
        setError('Failed to fetch scheduled posts. Please try again later.');
      }
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Post Calendar</h2>
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventClick={(info) => {
            const event = info.event;
            alert(`
              Platform: ${event.extendedProps.platform}
              Topic: ${event.extendedProps.topic || 'N/A'}
              Status: ${event.extendedProps.status}
              Text: ${event.extendedProps.text}
              ${event.extendedProps.mediaFileName ? `Media: ${event.extendedProps.mediaFileName}` : ''}
            `);
          }}
          height="auto"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short'
          }}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          allDaySlot={false}
          expandRows={true}
          stickyHeaderDates={true}
          dayMaxEvents={true}
          moreLinkText="more"
          eventDisplay="block"
        />
      </div>
    </div>
  );
};

export default CalendarView; 