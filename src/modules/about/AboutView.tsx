import { UtensilsCrossed, Users, Award, TrendingUp } from "lucide-react";

const AboutView = () => {

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* About Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-amber-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <UtensilsCrossed className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About SmartBite</h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            Your trusted partner for delicious food delivery across Myanmar
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded in 2020, SmartBite started with a simple mission: to connect food lovers with their favorite restaurants 
                and deliver happiness right to their doorstep. What began as a small startup in Yangon has now grown into 
                Myanmar's leading food delivery platform.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We partner with over 500+ restaurants across major cities in Myanmar, including Yangon, Mandalay, Naypyidaw, 
                and more. Our platform makes it easy for customers to discover new cuisines, order their favorite meals, 
                and enjoy restaurant-quality food at home.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With a team of dedicated delivery partners and advanced technology, we ensure every order arrives fresh, 
                hot, and on time. SmartBite is more than just a delivery service – we're building a community that celebrates 
                great food and brings people together.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">50K+</h3>
                <p className="text-gray-600 text-sm">Happy Customers</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <UtensilsCrossed className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">500+</h3>
                <p className="text-gray-600 text-sm">Restaurant Partners</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">100K+</h3>
                <p className="text-gray-600 text-sm">Orders Delivered</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">4.8★</h3>
                <p className="text-gray-600 text-sm">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at SmartBite
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                We promise quick and reliable delivery to ensure your food arrives fresh and hot, every single time.
              </p>
            </div>
            <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Assured</h3>
              <p className="text-gray-600">
                We partner only with the best restaurants and maintain strict quality standards for all deliveries.
              </p>
            </div>
            <div className="bg-linear-to-br from-yellow-50 to-amber-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're here 24/7 to support you and make your experience exceptional.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutView;
