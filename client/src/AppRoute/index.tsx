import { BrowserRouter, Route, Routes } from 'react-router-dom'

import App from '../App';
import Web3LoginPage from '../Login';
import { useAuth } from '../AuthWrap';

export default function AppRouter() {
    const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
     <Routes>
        <Route path='/' element={<App />} />
        {!isAuthenticated && (
<Route path='/admin' element={<Web3LoginPage />} />
        )}
     </Routes>
    </BrowserRouter>
    


  )
}
