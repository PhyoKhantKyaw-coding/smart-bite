import { Search ,  Star,  Zap } from "lucide-react";
import { Input } from "@/components/ui/input";


interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const HeroSection = ({ 
  searchQuery, 
  onSearchChange
}: HeroSectionProps) => {
 

  return (
    <section className="relative w-full overflow-hidden">
      {/* Modern gradient background with mesh pattern */}
      <div className="absolute inset-0 bg-linear-to-br ">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(251, 191, 36, 0.2) 2%, transparent 0%), 
                           radial-gradient(circle at 75px 75px, rgba(245, 158, 11, 0.2) 2%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-20 -right-20 w-96 h-96 bg-linear-to-br from-orange-400/30 to-amber-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-linear-to-br from-yellow-400/30 to-orange-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-orange-200">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-gray-800">Fast & Fresh Delivery</span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="bg-linear-to-br from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Your Favorite
                </span>
                <br />
                <span className="text-gray-900">Food Delivered</span>
                <br />
                <span className="text-gray-700">Hot & Fresh</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-xl">
                Discover delicious meals from top restaurants. Order now and get it delivered to your doorstep in minutes!
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-orange-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="Search for dishes, cuisines, or restaurants..."
                  className="pl-14 pr-4 h-16 text-base bg-white/90 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-400 focus:border-orange-500 rounded-2xl shadow-lg transition-all"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="bg-linear-to-br from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all cursor-pointer font-medium">
                    Search
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100">
                <div className="text-3xl font-bold text-orange-600">500+</div>
                <div className="text-sm text-gray-600 mt-1">Restaurants</div>
              </div>
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100">
                <div className="text-3xl font-bold text-orange-600">10k+</div>
                <div className="text-sm text-gray-600 mt-1">Happy Users</div>
              </div>
              <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100">
                <div className="text-3xl font-bold text-orange-600">30min</div>
                <div className="text-sm text-gray-600 mt-1">Avg Delivery</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image & Features */}
          <div className="relative lg:block hidden">
            {/* Main food illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl"></div>
              
              {/* Floating food cards */}
              <div className="relative space-y-6">
                {/* Card 1 */}
                <div className="ml-auto w-80 p-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-orange-100 transform hover:scale-105 transition-all animate-float">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-linear-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                      🍔
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg">Burger Deluxe</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">4.8</span>
                        <span className="text-xs text-gray-500 ml-2">• 25-30 min</span>
                      </div>
                      <div className="text-orange-600 font-bold mt-2">$12.99</div>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="w-80 p-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-orange-100 transform hover:scale-105 transition-all animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-linear-to-br from-red-400 to-orange-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                      🍕
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg">Italian Pizza</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">4.9</span>
                        <span className="text-xs text-gray-500 ml-2">• 20-25 min</span>
                      </div>
                      <div className="text-orange-600 font-bold mt-2">$15.99</div>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="ml-auto w-80 p-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-orange-100 transform hover:scale-105 transition-all animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                      🥗
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg">Fresh Salad</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">4.7</span>
                        <span className="text-xs text-gray-500 ml-2">• 15-20 min</span>
                      </div>
                      <div className="text-orange-600 font-bold mt-2">$9.99</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery person animation */}
              <div className="absolute -bottom-10 -left-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-orange-200 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl">
                    🚴
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Delivery Status</div>
                    <div className="text-sm font-bold text-gray-900">On the way...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;