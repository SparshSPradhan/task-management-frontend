// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router';

// export default function Login() {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       setError('Valid email is required');
//       return;
//     }
//     if (!formData.password.trim()) {
//       setError('Password is required');
//       return;
//     }

//     console.log('Sending login payload:', formData);

//     try {
//       const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, formData);
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('userId', res.data.user.id);
//       router.push('/dashboard');
//     } catch (error) {
//       console.error('Login error:', error);
//       setError(error.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <form onSubmit={handleSubmit} className="p-8 border rounded-lg shadow-lg space-y-4">
//         <h1 className="text-2xl font-bold">Login</h1>
//         {error && <p className="text-red-500">{error}</p>}
//         <input
//           type="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
//           Login
//         </button>
//         <p>
//           Don't have an account?{' '}
//           <a href="/register" className="text-blue-500">
//             Register
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }




import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
// import '../styles/login.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Valid email is required');
      return;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return;
    }

    console.log('Sending login payload:', formData);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Welcome Back</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}




