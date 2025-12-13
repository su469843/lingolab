import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';

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
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary-color)' }}>
                    {isLogin ? '欢迎登录' : '注册账号'}
                </h2>

                {error && (
                    <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>用户名</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input-field"
                                style={{ width: '100%', paddingLeft: '2.5rem' }}
                                placeholder="请输入用户名"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>密码</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                style={{ width: '100%', paddingLeft: '2.5rem' }}
                                placeholder="请输入密码"
                                required
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>昵称</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="您的称呼"
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>角色</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="input-field"
                                    style={{ width: '100%' }}
                                >
                                    <option value="STUDENT">学生</option>
                                    <option value="TEACHER">老师</option>
                                </select>
                            </div>

                            {formData.role === 'TEACHER' && (
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>机构校验码 (Org Code)</label>
                                    <input
                                        type="text"
                                        name="orgCode"
                                        value={formData.orgCode}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="请输入机构提供的一致校验码"
                                        required
                                    />
                                </div>
                            )}

                            {formData.role === 'STUDENT' && (
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>老师代码 (Teacher Code)</label>
                                    <input
                                        type="text"
                                        name="teacherCode"
                                        value={formData.teacherCode}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="输入老师的5位代码以绑定 (选填)"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        disabled={loading}
                    >
                        {loading ? '处理中...' : (isLogin ? '立即登录' : '创建账号')}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    {isLogin ? '还没有账号？' : '已有账号？'}
                    <span
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600, marginLeft: '0.5rem' }}
                    >
                        {isLogin ? '去注册' : '去登录'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
