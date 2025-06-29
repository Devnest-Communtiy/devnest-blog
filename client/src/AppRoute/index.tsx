import { BrowserRouter, Route, Routes } from 'react-router-dom'

import App from '../App';
import Web3LoginPage from '../Login';
import { useAuth } from '../AuthWrap';
import Web3404Page from '../Error';

export default function AppRouter() {
    const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
     <Routes>
        <Route path='/' element={<App />} />
        {!isAuthenticated && (
<Route path='/admin' element={<Web3LoginPage />} />
        )}
        <Route path='*' element={<Web3404Page/>} />
        {/* Add more routes as needed */}
     </Routes>
    </BrowserRouter>
    


  )
}
