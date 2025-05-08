


// import { useState } from 'react';
// import axios from 'axios';

// export default function TaskForm({ users, onTaskCreated, task }) {
//   const isEdit = !!task;
//   const [formData, setFormData] = useState(
//     isEdit
//       ? {
//           title: task.title,
//           description: task.description || '',
//           dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
//           priority: task.priority,
//           status: task.status,
//           assignedTo: task.assignedTo?._id || '',
//         }
//       : {
//           title: '',
//           description: '',
//           dueDate: '',
//           priority: 'Medium',
//           status: 'Pending',
//           assignedTo: '',
//         }
//   );
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!formData.title.trim()) {
//       setError('Title is required');
//       return;
//     }
//     if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
//       setError('Due date cannot be in the past');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('No authentication token found. Please log in.');
//         return;
//       }

//       const payload = {
//         title: formData.title,
//         description: formData.description,
//         priority: formData.priority,
//         status: formData.status,
//         assignedTo: formData.assignedTo || null,
//       };
//       if (formData.dueDate) {
//         payload.dueDate = formData.dueDate;
//       }
//       console.log('Sending task data:', payload);

//       if (isEdit) {
//         const res = await axios.put(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${task._id}`,
//           payload,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         onTaskCreated(res.data);
//       } else {
//         const res = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
//           payload,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         onTaskCreated(res.data);
//       }

//       setFormData({
//         title: '',
//         description: '',
//         dueDate: '',
//         priority: 'Medium',
//         status: 'Pending',
//         assignedTo: '',
//       });
//     } catch (error) {
//       console.error('Error saving task:', error);
//       console.error('Response data:', error.response?.data);
//       setError(error.response?.data?.message || 'Failed to save task. Please try again.');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
//       <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Task' : 'Create New Task'}</h2>

//       {error && (
//         <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
//           {error}
//         </div>
//       )}

//       <div className="space-y-2">
//         <label className="block text-sm font-medium">Title</label>
//         <input
//           type="text"
//           value={formData.title}
//           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//           className="w-full p-2 border rounded"
//           required
//         />
//       </div>

//       <div className="space-y-2">
//         <label className="block text-sm font-medium">Description</label>
//         <textarea
//           value={formData.description}
//           onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//           className="w-full p-2 border rounded"
//           rows="3"
//         />
//       </div>

//       <div className="space-y-2">
//         <label className="block text-sm font-medium">Due Date</label>
//         <input
//           type="date"
//           value={formData.dueDate}
//           onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
//           className="w-full p-2 border rounded"
//         />
//       </div>

//       <div className="space-y-2">
//         <label className="block text-sm font-medium">Priority</label>
//         <select
//           value={formData.priority}
//           onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
//           className="w-full p-2 border rounded"
//         >
//           <option value="Low">Low</option>
//           <option value="Medium">Medium</option>
//           <option value="High">High</option>
//         </select>
//       </div>

//       <div className="space-y-2">
//         <label className="block text-sm font-medium">Status</label>
//         <select
//           value={formData.status}
//           onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//           className="w-full p-2 border rounded"
//         >
//           <option value="Pending">Pending</option>
//           <option value="In Progress">In Progress</option>
//           <option value="Completed">Completed</option>
//         </select>
//       </div>

//       <div className="space-y-2">
//         <label className="block text-sm font-medium">Assigned To (Responsible for Completion)</label>
//         <select
//           value={formData.assignedTo}
//           onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
//           className="w-full p-2 border rounded"
//         >
//           <option value="">No Assigned To</option>
//           {users.map((user) => (
//             <option key={user._id} value={user._id}>{user.username}</option>
//           ))}
//         </select>
//       </div>

//       <button
//         type="submit"
//         className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
//       >
//         {isEdit ? 'Update Task' : 'Create Task'}
//       </button>
//     </form>
//   );
// }




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
