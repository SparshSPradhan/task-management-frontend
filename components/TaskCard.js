import { useState } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';

export default function TaskCard({ task, getPriorityColor, formatDate, users, onTaskUpdated }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onTaskUpdated();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const getUsername = (user) => (user ? user.username : 'Unassigned');

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      {isEditing ? (
        <TaskForm
          task={task}
          users={users}
          onTaskCreated={() => {
            setIsEditing(false);
            onTaskUpdated();
          }}
        />
      ) : (
        <>
          <div className="p-5">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{task.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            <p className="text-gray-600 mt-2 text-sm line-clamp-2">{task.description || 'No description'}</p>
            <p className="text-sm mt-2">Status: {task.status}</p>
            <p className="text-sm mt-1">Created By: {getUsername(task.assignee)}</p>
            <p className="text-sm mt-1">Assigned To: {getUsername(task.assignedTo)}</p>
          </div>
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 flex justify-between items-center">
            <div className="flex items-center text-gray-500 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDate(task.dueDate)}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}