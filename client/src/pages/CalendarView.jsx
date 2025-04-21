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
      console.log('Starting to fetch posts...');
      
      const response = await axiosInstance.get('/posts');
      console.log('Posts response:', response.data);

      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format');
      }

      // Filter for posts that have a scheduledDate
      const scheduledPosts = response.data.filter(post => post.scheduledDate);
      console.log('Scheduled posts:', scheduledPosts);

      const formattedEvents = scheduledPosts.map(post => {
        console.log('Processing post:', post);
        const event = {
          id: post._id,
          title: `${post.platform || 'Unknown'}: ${post.topic || (post.text ? post.text.substring(0, 30) : 'No content')}...`,
          start: post.scheduledDate,
          backgroundColor: getPlatformColor(post.platform),
          borderColor: getPlatformColor(post.platform),
          textColor: '#ffffff',
          extendedProps: {
            platform: post.platform,
            text: post.text,
            topic: post.topic,
            status: post.status,
            mediaFileName: post.mediaFileName
          }
        };
        console.log('Created event:', event);
        return event;
      });

      console.log('All formatted events:', formattedEvents);
      setEvents(formattedEvents);
      setError('');
    } catch (err) {
      console.error('Error fetching posts:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformColor = (platform) => {
    console.log('Getting color for platform:', platform);
    const colors = {
      Instagram: '#E1306C',
      Twitter: '#1DA1F2',
      LinkedIn: '#0077B5',
      Facebook: '#4267B2'
    };
    // Handle case-insensitive platform names
    const platformKey = Object.keys(colors).find(
      key => key.toLowerCase() === (platform || '').toLowerCase()
    );
    const color = platformKey ? colors[platformKey] : '#666666';
    console.log('Selected color:', color);
    return color;
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