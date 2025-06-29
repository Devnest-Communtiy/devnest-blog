import React, { useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
}

const Web3404Page: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Initialize particles
    const initialParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: Math.random() * 4 + 6
    }));
    setParticles(initialParticles);

    // Add new particles periodically
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticle: Particle = {
          id: Date.now(),
          x: Math.random() * 100,
          delay: 0,
          duration: Math.random() * 4 + 6
        };
        return [...prev.slice(-14), newParticle];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  const goHome = () => {
    window.location.href = '/';
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-900 flex items-center justify-center overflow-hidden relative">
      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Space Grotesk', sans-serif;
        }
        
        .glass-green {
          background: rgba(16, 185, 129, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .floating {
          animation: floating 6s ease-in-out infinite;
        }
        
        .floating-delayed {
          animation: floating 6s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .pulse-glow-green {
          animation: pulse-glow-green 2s ease-in-out infinite alternate;
        }
        
        @keyframes floating {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        
        @keyframes pulse-glow-green {
          0% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }
          100% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.8), 0 0 60px rgba(5, 150, 105, 0.4); }
        }
        
        .neon-text-green {
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.8), 0 0 20px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.4);
        }
        
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(16, 185, 129, 0.8);
          border-radius: 50%;
          animation: particle-float 8s linear infinite;
        }
        
        @keyframes particle-float {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(100px);
            opacity: 0;
          }
        }
        
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        .matrix-text {
          color: #00ff41;
          text-shadow: 0 0 10px #00ff41;
        }
      `}</style>

      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>
      
      {/* Floating Geometric Shapes */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-400 rounded-lg floating opacity-20"></div>
      <div className="absolute top-40 right-32 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full floating-delayed opacity-30"></div>
      <div className="absolute bottom-40 left-32 w-12 h-12 bg-gradient-to-r from-lime-400 to-green-400 transform rotate-45 floating opacity-25"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-lg floating-delayed opacity-15"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Main Content */}
      <div 
        className="glass-green rounded-3xl p-12 text-center max-w-2xl mx-4 pulse-glow-green relative z-10"
        onMouseMove={handleMouseMove}
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.05))`
        }}
      >
        {/* 404 Number */}
        <div className="text-9xl font-bold text-emerald-400 neon-text-green mb-6 tracking-wider">
          404
        </div>
        
        {/* Error Message */}
        <h1 className="text-4xl font-semibold text-white mb-4">
          <span className="matrix-text">Page Not Found</span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          This page has been <span className="text-emerald-400 font-semibold">disconnected</span> from the network. 
          The smart contract cannot locate the requested resource.
        </p>
        
        {/* Web3 Icons */}
        <div className="flex justify-center space-x-6 mb-10">
          <div className="w-16 h-16 glass-green rounded-xl flex items-center justify-center floating hover:bg-emerald-500/20 transition-colors">
            <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="w-16 h-16 glass-green rounded-xl flex items-center justify-center floating-delayed hover:bg-emerald-500/20 transition-colors">
            <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="w-16 h-16 glass-green rounded-xl flex items-center justify-center floating hover:bg-emerald-500/20 transition-colors">
            <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={goHome}
            className="glass-green rounded-xl px-8 py-4 text-white font-semibold transition-all duration-300 btn-hover border border-emerald-400/30 hover:border-emerald-400/50 hover:text-emerald-400"
          >
            🏠 Return Home
          </button>
          <button 
            onClick={goBack}
            className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl px-8 py-4 text-black font-semibold transition-all duration-300 btn-hover hover:from-emerald-400 hover:to-green-400"
          >
            ← Go Back
          </button>
        </div>
        
        {/* Status Info */}
        <div className="mt-8 text-sm text-gray-400">
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Error Code: 404 | Status: Disconnected
          </p>
          <p className="mt-2 text-emerald-400">
            Powered by <span className="font-semibold">Blockchain Technology</span>
          </p>
        </div>

        {/* Additional Matrix-style decoration */}
        <div className="absolute top-4 right-4 text-emerald-400 opacity-60 text-xs font-mono">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
              {Math.random().toString(36).substring(7)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Web3404Page;