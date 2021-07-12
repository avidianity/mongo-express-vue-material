import axios from 'axios';
import { State } from './libraries/State';
import 'toastr/build/toastr.css';

const state = State.getInstance();

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

if (state.has('token')) {
	const token = state.get<string>('token');
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

state.listen<string>('token', (token) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
});

axios.interceptors.request.use((config) => {
	if (state.has('token')) {
		const token = state.get<string>('token');
		config.headers['Authorization'] = `Bearer ${token}`;
	}
	return config;
});
