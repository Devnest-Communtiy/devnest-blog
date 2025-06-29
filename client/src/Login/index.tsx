import  {  useState } from 'react';
import { Eye, EyeOff, Wallet, Shield, Zap, ChevronRight, Github, Twitter, Code } from 'lucide-react';
import { useAuth } from '../AuthWrap';
import { useNavigate } from 'react-router-dom';

export default function Web3LoginPage() {
  const { setIsAuthenticated} = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate=useNavigate();
 
  const handleSubmit = async() => {
    setIsConnecting(true);
   
    if(!username || !password) {
      alert('Please enter username and password');
      setIsConnecting(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:5050/api/admins/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      await sessionStorage.setItem('token', data.admin.token);
      setIsAuthenticated(true);
      navigate('/');
      console.log(data);
    } catch (error) {
        console.error('Error during login:', error);
      const errMsg = error instanceof Error ? error.message : 'An error occurred during login';
      alert(errMsg);
    }
    finally{
        setIsConnecting(false);
    }
  };

  const handleWalletConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-green-500/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-40 right-32 w-24 h-24 border border-green-400/30 rounded-full animate-bounce"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-green-500/10 rounded-lg animate-ping"></div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-lime-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg shadow-green-500/25">
              <Code className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2 flex justify-center">
              <div className="flex items-center">
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                dev<span className="text-green-600">nest</span>
                <span className="text-green-500 text-4xl">.</span>
              </h1>
            </div>
            </h1>
            <p className="text-gray-400 text-sm">Connect to the future of development</p>
          </div>

          {/* Login Card */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8 shadow-2xl shadow-green-500/5">
            {/* Wallet Connect Button */}
            <button
              onClick={handleWalletConnect}
              disabled={isConnecting}
              className="w-full mb-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg shadow-green-500/25"
            >
              {isConnecting ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  <span>Connect Wallet</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/50 text-gray-400">or continue with email</span>
              </div>
            </div>

            {/* Login Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                
                </label>
                <a href="#" className="text-sm text-green-400 hover:text-green-300 transition-colors">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isConnecting}
                className="w-full bg-black border border-green-500 hover:bg-green-500/10 text-green-400 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {isConnecting ? (
                  <div className="w-5 h-5 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm mb-4">
                Don't have an account?{' '}
                <a href="#" className="text-green-400 hover:text-green-300 transition-colors font-medium">
                  Sign up
                </a>
              </p>
              
              {/* Social Links */}
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>Secured by blockchain technology</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}