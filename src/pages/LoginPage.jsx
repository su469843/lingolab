import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

const LoginPage = () => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        role: 'STUDENT', // DEFAULT
        teacherId: '', // Optional for students to link to teacher
        teacherCode: '', // 5-digit code for students
        orgCode: ''      // For teachers
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.username, formData.password);
            } else {
                await register({
                    username: formData.username,
                    password: formData.password,
                    name: formData.name,
                    role: formData.role,
                    teacherCode: formData.teacherCode,
                    orgCode: formData.orgCode
                });
            }
            // Navigate is handled by IndexRoute usually, but explicit nav is safe
            navigate('/home');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-50)', position: 'relative', overflow: 'hidden' }}>
            {/* Background Decoration */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'var(--primary-200)', filter: 'blur(120px)', opacity: 0.4, borderRadius: '50%', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '600px', height: '600px', background: 'var(--secondary-500)', filter: 'blur(120px)', opacity: 0.2, borderRadius: '50%', zIndex: 0 }}></div>

            <div className="card animate-scale-up" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', position: 'relative', zIndex: 1, backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.85)' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
                    <ArrowLeft size={16} /> 返回首页
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: '12px', background: 'var(--primary-50)', color: 'var(--primary-600)', marginBottom: '1rem' }}>
                        <Sparkles size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{isLogin ? '欢迎回来' : '创建新账号'}</h2>
                    <p>{isLogin ? '登录以继续您的学习之旅' : '开始您的英语掌握之路'}</p>
                </div>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>账户名</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input-field"
                                style={{ paddingLeft: '3rem' }}
                                placeholder="请输入用户名"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>密码</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                style={{ paddingLeft: '3rem' }}
                                placeholder="请输入密码"
                                required
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="animate-fade-in">
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>昵称 (用于显示)</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="您的称呼"
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>我是...</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="input-field"
                                    style={{ width: '100%', cursor: 'pointer' }}
                                >
                                    <option value="STUDENT">学生 (需要自学或加入班级)</option>
                                    <option value="TEACHER">老师 (创建班级和管理学生)</option>
                                </select>
                            </div>

                            {formData.role === 'TEACHER' && (
                                <div className="animate-fade-in" style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>机构校验码</label>
                                    <input
                                        type="text"
                                        name="orgCode"
                                        value={formData.orgCode}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="请输入机构提供的校验码"
                                        required
                                    />
                                </div>
                            )}

                            {formData.role === 'STUDENT' && (
                                <div className="animate-fade-in" style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>老师代码 (必填)</label>
                                    <input
                                        type="text"
                                        name="teacherCode"
                                        value={formData.teacherCode}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="请输入老师提供的5位代码"
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', height: '3rem' }}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? '登录' : '注册')}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {isLogin ? '还没有账号？' : '已有账号？'}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="btn-ghost"
                        style={{ marginLeft: '0.5rem', color: 'var(--primary-600)', fontWeight: 600, padding: '0.25rem 0.5rem' }}
                    >
                        {isLogin ? '免费注册' : '直接登录'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
