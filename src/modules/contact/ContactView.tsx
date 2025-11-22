import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Facebook, Instagram, Twitter } from "lucide-react";

const ContactView = () => {
  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for contacting us! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Contact Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <MessageCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            We're here to help! Contact us for any questions or support
          </p>
        </div>
      </section>

      {/* Contact Information & Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                {/* Headquarters */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Headquarters</h3>
                      <p className="text-gray-600">
                        No. 123, Pyay Road, Kamayut Township<br />
                        Yangon, Myanmar 11041
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Phone Numbers</h3>
                      <p className="text-gray-600">
                        Customer Service: +95 9 123 456 789<br />
                        Restaurant Partners: +95 9 987 654 321<br />
                        Delivery Support: +95 9 555 444 333
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Email Address</h3>
                      <p className="text-gray-600">
                        General Inquiries: info@smartbite.com.mm<br />
                        Support: support@smartbite.com.mm<br />
                        Partnership: partners@smartbite.com.mm
                      </p>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Service Hours</h3>
                      <p className="text-gray-600">
                        Delivery Service: 24/7 Daily<br />
                        Customer Support: 6:00 AM - 12:00 AM<br />
                        Office Hours: Mon-Sat, 9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="https://facebook.com/smartbite" target="_blank" rel="noopener noreferrer" 
                     className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="https://instagram.com/smartbite" target="_blank" rel="noopener noreferrer"
                     className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a href="https://twitter.com/smartbite" target="_blank" rel="noopener noreferrer"
                     className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white hover:bg-sky-600 transition-colors">
                    <Twitter className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+95 9 XXX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-6 text-lg"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactView;
