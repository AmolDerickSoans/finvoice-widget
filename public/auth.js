// src/index.js
import { h } from 'preact'; // Import h from Preact
import { render } from 'preact'; // Use render from Preact
import AuthPage from '../src/components/organisms/Auth.js';
import './index.css'; // For Tailwind

const container = document.getElementById('auth-root');

// Render the AuthPage component into the container
render(<AuthPage />, container);