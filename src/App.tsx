import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import NavBar from './components/navbar/NavBar';
import { AppRoutes } from './routes';

function App() {
  return (
    <Router>
      <NavBar />
      <div>
        <Routes>
          {AppRoutes.map(([path, Component], index) => (
            <Route key={index + path} path={path} element={<Component />} />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
