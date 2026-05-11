import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { loginSuccess } from '../store/authSlice';
import { LogIn, ShieldCheck, Zap, ArrowRight, Layout } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import mtecImage from '../../public/mtec.avif';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await axios.post('/api/login', values);
        dispatch(loginSuccess(response.data));
        navigate('/dashboard');
      } catch (error) {
        console.error('Login Error:', error);
        setFieldError('password', 'Invalid credentials');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-slate-950 font-['Outfit',sans-serif]">
      {/* Left Section: Hero / Branding */}
      <div className="lg:flex-[1.2] relative overflow-hidden bg-slate-900 flex flex-col justify-between p-8 lg:p-16">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-400/10 blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-violet-400 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Layout size={28} />
            </div>
            <span className="text-3xl font-bold tracking-tighter text-white">SprintBoard</span>
          </div>

          <h2 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter leading-[0.9] mb-8">
            Manage <br />
            <span className="text-violet-400 italic">everything</span> <br />
            in one place.
          </h2>
          <p className="text-slate-400 text-xl max-w-md font-light leading-relaxed">
            The next generation of task management tool
          </p>
        </div>

        <div className="relative z-10 mt-12">
          <StatusBadge imageSrc={mtecImage} />
        </div>
      </div>

      {/* Right Section: Form */}
      <div className="lg:flex-1 flex flex-col items-center justify-center p-8 lg:p-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome back</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Enter your details to access your dashboard.</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Username</label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  placeholder="e.g. shwani_dev"
                  className={`input py-4 pr-12 ${formik.touched.username && formik.errors.username ? 'border-red-500 ring-red-500/10' : ''}`}
                  {...formik.getFieldProps('username')}
                />
              </div>
              {formik.touched.username && formik.errors.username && (
                <p className="text-xs text-red-500 mt-1 ml-1">{formik.errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <button type="button" className="text-xs text-violet-600 font-bold hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`input py-4 pr-12 ${formik.touched.password && formik.errors.password ? 'border-red-500 ring-red-500/10' : ''}`}
                  {...formik.getFieldProps('password')}
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-red-500 mt-1 ml-1">{formik.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full btn btn-primary py-4 text-lg flex items-center justify-center gap-3 group"
            >
              {formik.isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
