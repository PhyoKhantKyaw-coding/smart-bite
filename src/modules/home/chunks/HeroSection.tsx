import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const HeroSection = ({ searchQuery, onSearchChange }: HeroSectionProps) => {
  const heroHeading = "Delicious Food,\nDelivered Fast";

  return (
    <section className="relative w-full overflow-hidden text-yellow-900 py-20 px-4 border-4 border-yellow-400 shadow-lg" style={{ background: 'linear-gradient(120deg, #fffbe6 0%, #fbbf24 100%)' }}>
      {/* Map illustration background */}
      <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
        <rect x="0" y="0" width="1200" height="400" rx="48" fill="#fef9c3" />
        
        {/* Curved road path */}
        <path d="M 80 360 C 200 360, 250 280, 320 280 C 390 280, 430 360, 500 360 C 570 360, 610 240, 680 240 C 750 240, 790 320, 860 320 C 930 320, 1000 140, 1120 100" 
          stroke="#fbbf24" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.6" />
        
        {/* Road markings */}
        <path d="M 100 360 L 130 360 M 200 320 L 230 310 M 320 280 L 350 280 M 440 340 L 470 350 M 580 280 L 610 270 M 700 240 L 730 240 M 820 300 L 850 310 M 950 180 L 980 160" 
          stroke="#fff" strokeWidth="3" strokeDasharray="20,15" opacity="0.5" />
        
        {/* Store icon at start */}
        <g transform="translate(60, 340)">
          <rect x="0" y="0" width="40" height="40" rx="8" fill="#34d399" />
          <text x="20" y="28" fontSize="24" textAnchor="middle" fill="#fff">🏪</text>
        </g>
        
        {/* Customer home at end */}
        <g transform="translate(1100, 80)">
          <rect x="0" y="0" width="40" height="40" rx="8" fill="#f472b6" />
          <text x="20" y="28" fontSize="24" textAnchor="middle" fill="#fff">🏠</text>
        </g>
        
        {/* Waypoint markers */}
        <circle cx="320" cy="280" r="6" fill="#fbbf24" opacity="0.6" />
        <circle cx="500" cy="360" r="6" fill="#fbbf24" opacity="0.6" />
        <circle cx="680" cy="240" r="6" fill="#fbbf24" opacity="0.6" />
        <circle cx="860" cy="320" r="6" fill="#fbbf24" opacity="0.6" />
      </svg>

      {/* Enhanced Deliveryman animation */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
        {/* Forward delivery */}
        <div id="deliveryman-container" style={{ 
          position: 'absolute', 
          fontSize: 44, 
          animation: 'deliveryRoute 8s ease-in-out infinite',
          transformOrigin: 'center',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2)'
        }}>
          🚴‍♂️
          {/* Delivery box */}
          <span style={{ 
            position: 'absolute', 
            top: -8, 
            right: -12, 
            fontSize: 20,
            animation: 'boxBounce 0.5s ease-in-out infinite'
          }}>📦</span>
        </div>

        {/* Return journey */}
        <div id="deliveryman-return" style={{ 
          position: 'absolute', 
          fontSize: 44, 
          animation: 'deliveryReturn 8s ease-in-out infinite',
          animationDelay: '4s',
          transformOrigin: 'center',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          transform: 'scaleX(-1)'
        }}>
          🚴‍♂️
        </div>

        {/* Speed lines effect */}
        <div style={{
          position: 'absolute',
          animation: 'speedLines 8s ease-in-out infinite',
          fontSize: 28,
          opacity: 0.4
        }}>💨</div>

        <style>{`
          @keyframes deliveryRoute {
            0% { 
              left: 80px; top: 360px; 
              opacity: 1; 
              transform: rotate(0deg) scale(1);
            }
            5% { transform: rotate(2deg) scale(1.05); }
            12% { 
              left: 200px; top: 340px; 
              transform: rotate(-5deg) scale(1);
            }
            25% { 
              left: 320px; top: 280px; 
              transform: rotate(-15deg) scale(0.95);
            }
            30% { transform: rotate(-10deg) scale(1); }
            38% { 
              left: 500px; top: 360px; 
              transform: rotate(10deg) scale(1.02);
            }
            50% { 
              left: 680px; top: 240px; 
              transform: rotate(-20deg) scale(0.9);
            }
            55% { transform: rotate(-15deg) scale(0.95); }
            65% { 
              left: 860px; top: 320px; 
              transform: rotate(5deg) scale(1);
            }
            80% { 
              left: 1000px; top: 180px; 
              transform: rotate(-10deg) scale(0.95);
            }
            90% { 
              left: 1120px; top: 100px; 
              transform: rotate(0deg) scale(1);
            }
            95% { 
              opacity: 1; 
              transform: scale(0.8);
            }
            100% { 
              left: 1120px; top: 100px; 
              opacity: 0; 
              transform: scale(0.5);
            }
          }

          @keyframes deliveryReturn {
            0% { 
              left: 1120px; top: 100px; 
              opacity: 0; 
              transform: scaleX(-1) scale(0.5);
            }
            5% { 
              opacity: 1; 
              transform: scaleX(-1) scale(1);
            }
            15% { 
              left: 1000px; top: 180px; 
              transform: scaleX(-1) rotate(10deg) scale(0.95);
            }
            30% { 
              left: 860px; top: 320px; 
              transform: scaleX(-1) rotate(-5deg) scale(1);
            }
            45% { 
              left: 680px; top: 240px; 
              transform: scaleX(-1) rotate(20deg) scale(0.9);
            }
            58% { 
              left: 500px; top: 360px; 
              transform: scaleX(-1) rotate(-10deg) scale(1.02);
            }
            70% { 
              left: 320px; top: 280px; 
              transform: scaleX(-1) rotate(15deg) scale(0.95);
            }
            82% { 
              left: 200px; top: 340px; 
              transform: scaleX(-1) rotate(5deg) scale(1);
            }
            92% { 
              left: 80px; top: 360px; 
              transform: scaleX(-1) rotate(0deg) scale(1);
            }
            98% { 
              opacity: 1; 
              transform: scaleX(-1) scale(0.8);
            }
            100% { 
              left: 80px; top: 360px; 
              opacity: 0; 
              transform: scaleX(-1) scale(0.5);
            }
          }

          @keyframes boxBounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }

          @keyframes speedLines {
            0%, 100% { 
              left: 80px; top: 360px; 
              opacity: 0; 
            }
            10%, 90% { opacity: 0.4; }
            15% { left: 180px; top: 345px; }
            30% { left: 300px; top: 285px; }
            50% { left: 660px; top: 245px; }
            70% { left: 840px; top: 325px; }
            85% { left: 1100px; top: 105px; }
          }
        `}</style>
      </div>

      {/* Raining food icons */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {[...Array(40)].map((_, i) => {
          const icons = ["🍔","🍕","🍣","🍜","🍟","🥗","🍩","🍦","🍤","🍛","🍗","🥪","🍿","🥟","🍱","🍞","🥚","🍅","🍆","🥒","🥕","🌽","🍄","🥬","🍠","🍯","🧀","🥨","🍪","🍰"];
          const icon = icons[i % icons.length];
          const left = Math.random() * 98;
          const duration = 3 + Math.random() * 4;
          const delay = Math.random() * 3;
          return (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: `${left}%`,
                top: '-40px',
                fontSize: `${22 + Math.random() * 18}px`,
                opacity: 0.18 + Math.random() * 0.22,
                animation: `foodRain ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            >{icon}</span>
          );
        })}
        <style>{`
          @keyframes foodRain {
            0% { top: -40px; }
            100% { top: 420px; }
          }
        `}</style>
      </div>

      {/* Hero content */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: '#111', textShadow: '0 2px 12px rgba(0,0,0,0.12)', whiteSpace: 'pre-line', position: 'relative', zIndex: 2 }}>
          {heroHeading}
        </h1>
        <p className="text-lg md:text-xl mb-8 opacity-90" style={{ color: '#111', textShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          Order your favorite meals from the best restaurants in town
        </p>
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search for food..."
            className="pl-12 h-14 text-lg bg-white"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;