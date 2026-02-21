/**
 * Simple mock backend using LocalStorage for persistence.
 */

const USERS_KEY = 'cityTracker_users';
const COMPLAINTS_KEY = 'cityTracker_complaints';

// Initialize with admin user if not exists
function initStore() {
    const usersJson = localStorage.getItem(USERS_KEY);
    let users = usersJson ? JSON.parse(usersJson) : [];

    // Check if admin@123 exists and has wrong password
    const adminIndex = users.findIndex(u => u.email === 'admin@123');
    if (adminIndex !== -1) {
        if (users[adminIndex].password !== 'ad') {
            users[adminIndex].password = 'ad';
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
    } else {
        // If it doesn't exist at all, add it
        users.push({ email: 'admin@123', password: 'ad', role: 'admin', name: 'System Admin' });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    if (!localStorage.getItem(COMPLAINTS_KEY)) {
        localStorage.setItem(COMPLAINTS_KEY, JSON.stringify([]));
    }
}

export function registerUser(email, password, name) {
    initStore();
    const users = JSON.parse(localStorage.getItem(USERS_KEY));

    if (users.find(u => u.email === email)) {
        throw new Error('User already exists');
    }

    const newUser = { email, password, name, role: 'user' };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { email: newUser.email, role: newUser.role, name: newUser.name };
}

export function verifyLogin(email, password) {
    initStore();
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        throw new Error('Invalid credentials');
    }

    return { email: user.email, role: user.role, name: user.name };
}

export function getUsers() {
    initStore();
    return JSON.parse(localStorage.getItem(USERS_KEY));
}

export function deleteUser(email) {
    initStore();
    let users = JSON.parse(localStorage.getItem(USERS_KEY));
    users = users.filter(u => u.email !== email);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getComplaints(userEmail = null) {
    initStore();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY));

    // Sort priority map
    const priorityMap = { 'High': 3, 'Medium': 2, 'Low': 1 };

    // Sort by priority first (highest first), then by newest date
    complaints.sort((a, b) => {
        const pA = priorityMap[a.priority] || 0;
        const pB = priorityMap[b.priority] || 0;
        if (pA !== pB) return pB - pA;
        return new Date(b.date) - new Date(a.date);
    });

    if (userEmail) {
        return complaints.filter(c => c.userEmail === userEmail);
    }
    return complaints;
}

export function addComplaint(complaintData, userEmail) {
    initStore();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY));

    const newComplaint = {
        ...complaintData,
        id: Date.now().toString(),
        userEmail,
        date: new Date().toISOString(),
        status: 'Pending', // Pending, In Progress, Resolved
        priority: complaintData.priority || 'Low'
    };

    complaints.push(newComplaint);
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    return newComplaint;
}

export function updateComplaintStatus(complaintId, status) {
    initStore();
    const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY));

    const index = complaints.findIndex(c => c.id === complaintId);
    if (index !== -1) {
        complaints[index].status = status;
        localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
        return complaints[index];
    }
    throw new Error('Complaint not found');
}
