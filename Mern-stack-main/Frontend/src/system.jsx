// This system module now proxies requests to the backend API.
const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE) ? process.env.REACT_APP_API_BASE : 'http://localhost:5000/api';

class AttendanceSystem {
    async login(username, password) {
        const resp = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await resp.json();
        if (!resp.ok) return { success: false, message: data.message || 'Login failed' };
        // store token and user
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        return { success: true, user: data.user };
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        window.location.href = '/';
    }

    async generateQRCode(courseId, durationMinutes = 15) {
        const token = localStorage.getItem('token');
        const resp = await fetch(`${API_BASE}/teacher/generate`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ courseId, durationMinutes })
        });
        return await resp.json();
    }

    async getCurrentQR(courseId) {
        const token = localStorage.getItem('token');
        const url = new URL(`${API_BASE}/teacher/current`);
        if (courseId) url.searchParams.append('courseId', courseId);
        const resp = await fetch(url.toString(), { headers: { 'Authorization': `Bearer ${token}` } });
        return await resp.json();
    }

    async markAttendance(qrString) {
        const token = localStorage.getItem('token');
        const resp = await fetch(`${API_BASE}/attendance/scan`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ qrString })
        });
        return await resp.json();
    }

    async getAttendanceToday() {
        const token = localStorage.getItem('token');
        const resp = await fetch(`${API_BASE}/attendance/today`, { headers: { 'Authorization': `Bearer ${token}` } });
        return await resp.json();
    }

    async getAttendanceMonth(month, year) {
        const token = localStorage.getItem('token');
        const url = new URL(`${API_BASE}/attendance/month`);
        url.searchParams.append('month', month);
        url.searchParams.append('year', year);
        const resp = await fetch(url.toString(), { headers: { 'Authorization': `Bearer ${token}` } });
        return await resp.json();
    }

    async addStudent(name, rollNo) {
        const token = localStorage.getItem('token');
        const resp = await fetch(`${API_BASE}/admin/students`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ name, rollNo })
        });
        return await resp.json();
    }

    async addCourse(code, name) {
        const token = localStorage.getItem('token');
        const resp = await fetch(`${API_BASE}/admin/courses`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ code, name })
        });
        return await resp.json();
    }

    async signup(email, password, fullName, role) {
        const resp = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                name: fullName,
                role,
                username: email.split('@')[0] // derive username from email
            })
        });
        const data = await resp.json();
        if (!resp.ok) return { success: false, message: data.message || 'Signup failed' };
        return { success: true, user: data.user };
    }
}

export const system = new AttendanceSystem();