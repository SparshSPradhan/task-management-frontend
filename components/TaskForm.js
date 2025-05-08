import { useState } from 'react';
import axios from 'axios';

export default function TaskForm({ users, onTaskCreated, task }) {
  const isEdit = !!task;
  const [formData, setFormData] = useState(
    isEdit
      ? {
          title: task.title,
          description: task.description || '',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
          priority: task.priority,
          status: task.status,
          assignedTo: task.assignedTo?._id || '',
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
    setError('');

    if (!formData.title) {
      setError('Title is required');
      return;
    }
    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      setError('Due date cannot be in the past');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }

      console.log('Sending task data:', formData);

      if (isEdit) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${task._id}`,
          {
            ...formData,
            assignedTo: formData.assignedTo || null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
          {
            ...formData,
            assignedTo: formData.assignedTo || null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      onTaskCreated();
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
      if (error.response) {
        setError(error.response.data.message || 'Failed to save task. Please try again.');
      } else {
        setError('Network error. Please check your connection.');
      }
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
          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">No Assigned To</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>{user.username}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
      >
        {isEdit ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
}