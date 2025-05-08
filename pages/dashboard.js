












import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import NotificationList from '../components/NotificationList';

export default function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [view, setView] = useState('grid');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login'); // Debug log
      router.push('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched users:', res.data); // Debug log
        setUsers(res.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users');
      }
    };

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched user:', res.data); // Debug log
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user data. Please log in again.');
        if (error.response?.status === 401 || error.response?.status === 404) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          router.push('/login');
        }
      }
    };

    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (filterPriority !== 'all') params.priority = filterPriority;
        if (filterStatus !== 'all') params.status = filterStatus;

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
        console.log('Fetched tasks:', res.data); // Debug log
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
    fetchUser();
    fetchTasks();
  }, [router, searchQuery, filterPriority, filterStatus]);

  const assignedTasks = tasks.filter((task) => task.assignedTo?._id === user?._id);
  const createdTasks = tasks.filter((task) => task.assignee?._id === user?._id);
  const overdueTasks = tasks.filter(
    (task) => task.assignedTo?._id === user?._id && task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed'
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-amber-500 text-white';
      case 'Low': return 'bg-emerald-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Task Management System</h1>
              <p className="text-gray-500 mt-1">Welcome, {user?.username}</p>
            </div>
            <button
              onClick={() => {
                console.log('Logging out'); // Debug log
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                router.push('/login');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {showTaskForm && (
          <div className="mb-8">
            <TaskForm
              users={users}
              onTaskCreated={() => {
                console.log('onTaskCreated triggered'); // Debug log
                setShowTaskForm(false);
                const token = localStorage.getItem('token');
                axios
                  .get(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
                    headers: { Authorization: `Bearer ${token}` },
                  })
                  .then((res) => {
                    console.log('Tasks refreshed:', res.data); // Debug log
                    setTasks(res.data);
                  })
                  .catch((error) => console.error('Error fetching tasks:', error));
              }}
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 font-medium">View:</span>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setView('grid')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  view === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  view === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300 border-l-0`}
              >
                List
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm p-2"
            />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm p-2"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm p-2"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button
              onClick={() => {
                console.log('Toggling showTaskForm:', !showTaskForm); // Debug log
                setShowTaskForm(!showTaskForm);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              {showTaskForm ? 'Cancel' : 'Create Task'}
            </button>
          </div>
        </div>

        {user && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Assigned to Me</h2>
              {isLoading ? (
                <p>Loading...</p>
              ) : assignedTasks.length === 0 ? (
                <p>No tasks assigned to you.</p>
              ) : (
                <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : 'space-y-4'}>
                  {assignedTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      getPriorityColor={getPriorityColor}
                      formatDate={formatDate}
                      users={users}
                      onTaskUpdated={() => {
                        console.log('onTaskUpdated triggered'); // Debug log
                        const token = localStorage.getItem('token');
                        axios
                          .get(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
                            headers: { Authorization: `Bearer ${token}` },
                          })
                          .then((res) => {
                            console.log('Tasks refreshed:', res.data); // Debug log
                            setTasks(res.data);
                          })
                          .catch((error) => console.error('Error fetching tasks:', error));
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Created by Me</h2>
              {isLoading ? (
                <p>Loading...</p>
              ) : createdTasks.length === 0 ? (
                <p>No tasks created by you.</p>
              ) : (
                <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : 'space-y-4'}>
                  {createdTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      getPriorityColor={getPriorityColor}
                      formatDate={formatDate}
                      users={users}
                      onTaskUpdated={() => {
                        console.log('onTaskUpdated triggered'); // Debug log
                        const token = localStorage.getItem('token');
                        axios
                          .get(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
                            headers: { Authorization: `Bearer ${token}` },
                          })
                          .then((res) => {
                            console.log('Tasks refreshed:', res.data); // Debug log
                            setTasks(res.data);
                          })
                          .catch((error) => console.error('Error fetching tasks:', error));
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Overdue Tasks</h2>
              {isLoading ? (
                <p>Loading...</p>
              ) : overdueTasks.length === 0 ? (
                <p>No overdue tasks.</p>
              ) : (
                <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : 'space-y-4'}>
                  {overdueTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      getPriorityColor={getPriorityColor}
                      formatDate={formatDate}
                      users={users}
                      onTaskUpdated={() => {
                        console.log('onTaskUpdated triggered'); // Debug log
                        const token = localStorage.getItem('token');
                        axios
                          .get(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
                            headers: { Authorization: `Bearer ${token}` },
                          })
                          .then((res) => {
                            console.log('Tasks refreshed:', res.data); // Debug log
                            setTasks(res.data);
                          })
                          .catch((error) => console.error('Error fetching tasks:', error));
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <NotificationList userId={user._id} />
          </>
        )}
      </div>
    </div>
  );
}




