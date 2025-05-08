




// import { useState } from 'react';
// import axios from 'axios';

// export default function TaskForm({ users, onTaskCreated, task }) {
//   console.log('TaskForm rendered', { users, task }); // Debug log
//   const isEdit = !!task;
//   const [formData, setFormData] = useState(
//     isEdit
//       ? {
//           title: task.title || '',
//           description: task.description || '',
//           dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
//           priority: task.priority || 'Medium',
//           status: task.status || 'Pending',
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
//     console.log('Form submitted', formData); // Debug log
//     setError('');

//     if (!formData.title.trim()) {
//       setError('Title is required');
//       console.log('Validation error: Title is required'); // Debug log
//       return;
//     }
//     if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
//       setError('Due date cannot be in the past');
//       console.log('Validation error: Due date cannot be in the past'); // Debug log
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('No authentication token found. Please log in.');
//         console.log('Error: No token found'); // Debug log
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
//       console.log('Sending task data:', payload); // Debug log

//       const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//       console.log('API URL:', apiUrl); // Debug log

//       if (isEdit) {
//         const res = await axios.put(
//           `${apiUrl}/api/tasks/${task._id}`,
//           payload,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         console.log('Task updated:', res.data); // Debug log
//         onTaskCreated(res.data);
//       } else {
//         const res = await axios.post(
//           `${apiUrl}/api/tasks`,
//           payload,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         console.log('Task created:', res.data); // Debug log
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
//           {Array.isArray(users) && users.length > 0 ? (
//             users.map((user) => (
//               <option key={user._id} value={user._id}>{user.username}</option>
//             ))
//           ) : (
//             <option disabled>No users available</option>
//           )}
//         </select>
//       </div>

//       <button
//         type="submit"
//         className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
//         onClick={() => console.log('Create Task button clicked')} // Debug log
//       >
//         {isEdit ? 'Update Task' : 'Create Task'}
//       </button>
//     </form>
//   );
// }










import { useState, memo } from 'react';
import axios from 'axios';

function TaskForm({ users, onTaskCreated, task }) {
  console.log('TaskForm rendered', { users, task });
  const isEdit = !!task;
  const [formData, setFormData] = useState(
    isEdit
      ? {
          title: task.title || '',
          description: task.description || '',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
          priority: task.priority || 'Medium',
          status: task.status || 'Pending',
          assignedTo: task.assignedTo?._id || task.assignedTo || '',
        }
      : {
          title: '',
          description: '',
          dueDate: '',
          priority: 'Medium',
          status: 'Pending',
          assignedTo: '',
        }
  );
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted', formData);
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      console.log('Validation error: Title is required');
      return;
    }
    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      setError('Due date cannot be in the past');
      console.log('Validation error: Due date cannot be in the past');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        console.log('Error: No token found');
        return;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        assignedTo: formData.assignedTo || null,
      };
      if (formData.dueDate) {
        payload.dueDate = formData.dueDate;
      }
      console.log('Sending task data:', payload);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log('API URL:', apiUrl);

      if (isEdit) {
        const res = await axios.put(
          `${apiUrl}/api/tasks/${task._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Task updated:', res.data);
        onTaskCreated(res.data);
      } else {
        const res = await axios.post(
          `${apiUrl}/api/tasks`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Task created:', res.data);
        onTaskCreated(res.data);
      }

      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        status: 'Pending',
        assignedTo: '',
      });
    } catch (error) {
      console.error('Error saving task:', error);
      console.error('Response data:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to save task. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Task' : 'Create New Task'}</h2>

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded"
          rows="3"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Due Date</label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Priority</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Assigned To (Responsible for Completion)</label>
        <select
          value={formData.assignedTo}
          onChange={(e) => {
            console.log('Selected assignedTo:', e.target.value); // Debug log
            setFormData({ ...formData, assignedTo: e.target.value });
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">No Assigned To</option>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))
          ) : (
            <option disabled>No users available</option>
          )}
        </select>
      </div>

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
        onClick={() => console.log('Create Task button clicked')}
      >
        {isEdit ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
}

export default memo(TaskForm);
