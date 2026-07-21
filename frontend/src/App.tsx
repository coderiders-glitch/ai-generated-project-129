import React from 'react';
import ChatInterface from './components/ChatInterface';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chatbot Admin Dashboard</h1>
      </header>
      <main>
        <ChatInterface apiUrl={process.env.REACT_APP_API_URL || ''} />
      </main>
    </div>
  );
};

export default App;