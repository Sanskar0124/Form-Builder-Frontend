// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FormEditor from './components/FormEditor/FormEditor';
import FormPreview from './components/FormPreview/FormPreview';
import EditForm from './views/CreateForm';
import FormList from './views/FormList';
import CreateForm from './views/CreateForm';
import AttemptForm from './views/AttemptForm';

function App() {
  return (
    <Router>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/create">Create Form</Link>
            </li>
            <li>
              <Link to="/preview">Preview Form</Link>
            </li>
            <li>
              <Link to="/attempt/:id">Preview Form</Link>
            </li>
          </ul>
        </nav> */}

        {/* <hr /> */}

        <Routes>
          <Route path="/" element={<FormList />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/preview" element={<FormPreview />} />
          <Route path="/attempt/:id" element={<AttemptForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
