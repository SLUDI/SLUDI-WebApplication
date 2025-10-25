import React, { useState, useEffect } from "react";
import { Form, Input } from "antd";
import {
  Shield,
  Smartphone,
  Zap,
  Globe,
  Building,
  Leaf,
  Check,
  Clock,
  DollarSign,
  Lock,
  BarChart3,
  Ban,
  User,
  UserCog,
  Settings,
  Menu,
  X,
  ChevronRight,
  Database,
  Cpu,
  Eye,
  Fingerprint,
  Landmark,
} from "lucide-react";
import LogoSmallImage from "../../assets/images/LogoSmallImage";
import Mobile from "../../assets/images/mobile";
import { useNavigate } from "react-router-dom";
import Login from "../../assets/images/login";
import Sllogo from "../../assets/images/SLlogo";

const Signin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const navigate = useNavigate();

  // Animation on scroll
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Database className="w-12 h-12 text-blue-600" />,
      title: "Blockchain Technology",
      description:
        "Built on Hyperledger Fabric for immutable, decentralized identity management with smart contracts ensuring data integrity.",
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      title: "Advanced Cryptography",
      description:
        "Public key cryptography, digital signatures, and zero-knowledge proofs protect against deepfake threats and ensure privacy.",
    },
    {
      icon: <Smartphone className="w-12 h-12 text-blue-600" />,
      title: "Cross-Platform Access",
      description:
        "Flutter mobile app for Android/iOS and React web platform providing seamless access across all devices.",
    },
    {
      icon: <Eye className="w-12 h-12 text-blue-600" />,
      title: "Deepfake Detection",
      description:
        "AI-powered deepfake detection mechanisms protect against sophisticated fraud attempts and identity spoofing.",
    },
    {
      icon: <Zap className="w-12 h-12 text-blue-600" />,
      title: "Offline Authentication",
      description:
        "Cryptographic mechanisms enable identity verification even in areas with limited internet connectivity.",
    },
    {
      icon: <Landmark className="w-12 h-12 text-blue-600" />,
      title: "Government Backed",
      description:
        "Official digital identity system backed by the Government of Sri Lanka with full legal recognition.",
    },
  ];

  const benefits = [
    {
      icon: <span className="text-4xl">✅</span>,
      title: "Decentralized Control",
      desc: "You own and control your personal data",
    },
    {
      icon: <span className="text-4xl">💰</span>,
      title: "Reduced Costs",
      desc: "Eliminate paper documents and reduce transaction fees",
    },
    {
      icon: <span className="text-4xl">📊</span>,
      title: "Instant Verification",
      desc: "Real-time identity verification across all services",
    },
    {
      icon: <span className="text-4xl">🔐</span>,
      title: "Enhanced Privacy",
      desc: "Zero-knowledge proofs protect your sensitive information",
    },
    {
      icon: <span className="text-4xl">⏰</span>,
      title: "Time Saving",
      desc: "Complete transactions in minutes instead of hours or days",
    },
    {
      icon: <span className="text-4xl">🚫</span>,
      title: "Fraud Prevention",
      desc: "Advanced AI detection prevents deepfake attacks",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Register",
      desc: "Visit any government office or register online with your existing National ID",
    },
    {
      number: 2,
      title: "Biometric Verification",
      desc: "Complete biometric verification and document authentication",
    },
    {
      number: 3,
      title: "Activate",
      desc: "Download the SLUID app and activate your digital identity",
    },
    {
      number: 4,
      title: "Use",
      desc: "Access your decentralized digital identity across all platforms",
    },
  ];

  const LoginModal = () => (
    <div className="fixed inset-0  bg-opacity-0 flex items-center justify-center z-50">
      <div className="bg-[#DFEFFF] rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {loginType} Login
          </h3>
          <button
            onClick={() => setShowLoginModal(false)}
            className="text-red-600 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex justify-center items-center">
          <Sllogo className="w-25 h-25 justify-center items-center" />
        </div>

        <Form className="space-y-6 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Enter your ${loginType} email`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input.Password
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              loginType === "Administrator"
                ? navigate("/admin")
                : navigate("/dashboard");
            }}
            className="w-full bg-[#13A4B4] text-white py-3 rounded-lg  transition font-semibold"
          >
            Login to{" "}
            {loginType === "Administrator" ? "Admin Panel" : "Dashboard"}
          </button>
        </Form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}

      <header className="bg-white  text-black sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <LogoSmallImage className="h-14 spin-vertical" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="hover:text-blue-200 transition">
                Home
              </a>
              <a href="#features" className="hover:text-blue-200 transition">
                Features
              </a>
              <a href="#benefits" className="hover:text-blue-200 transition">
                Benefits
              </a>
              <a
                href="#how-it-works"
                className="hover:text-blue-200 transition"
              >
                How It Works
              </a>

              {/* Login Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-blue-200 transition">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:rotate-90 transition-transform" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    onClick={() => {
                      setLoginType("Admin User");
                      setShowLoginModal(true);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-t-lg transition"
                  >
                    <User className="w-4 h-4" />
                    <span>Admin User</span>
                  </button>
                  <button
                    onClick={() => {
                      setLoginType("Administrator");
                      setShowLoginModal(true);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-b-lg transition"
                  >
                    <UserCog className="w-4 h-4" />
                    <span>Administrator</span>
                  </button>
                </div>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-blue-800">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="hover:text-blue-200 transition">
                  Home
                </a>
                <a href="#features" className="hover:text-blue-200 transition">
                  Features
                </a>
                <a href="#benefits" className="hover:text-blue-200 transition">
                  Benefits
                </a>
                <a
                  href="#how-it-works"
                  className="hover:text-blue-200 transition"
                >
                  How It Works
                </a>
                <div className="border-t border-blue-800 pt-4">
                  <button
                    onClick={() => {
                      setLoginType("User");
                      setShowLoginModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left hover:text-blue-200 transition mb-2"
                  >
                    <User className="w-4 h-4" />
                    <span>User Login</span>
                  </button>
                  <button
                    onClick={() => {
                      setLoginType("Administrator");
                      setShowLoginModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left hover:text-blue-200 transition"
                  >
                    <UserCog className="w-4 h-4" />
                    <span>Administrator Login</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Sri Lanka Unique Digital Identity System
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                Powered by Blockchain
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Secure, Convenient, and Trusted Digital Identity for Every Sri
              Lankan Citizen
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("/digitalIdentity")}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-lg"
              >
                Apply Now
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-white opacity-20 rounded-full animate-ping"></div>
        <div className="absolute top-35 left-80 w-20 h-20 border border-white bg-sky-400 opacity-20 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-20 w-16 h-16 border border-green-400 opacity-30 rounded-full animate-bounce"></div>
        <div className="absolute top-60 right-20 w-16 h-16 border border-green-400 opacity-30 rounded-full animate-bounce"></div>
        <div className="absolute top-80 right-20 w-16 h-16 border border-green-400 opacity-30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 left-40 w-25 h-25 border border-blue-400  opacity-50 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-20 w-25 h-25 border border-blue-400 opacity-50 rounded-full animate-ping"></div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Key Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105 fade-in"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-blue-50 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Benefits for Citizens
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the advantages of decentralized identity management
              with enhanced privacy and control
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 bg-[#f0f9ff] rounded-xl hover:bg-blue-100 transition-all fade-in"
              >
                <div className="flex-shrink-0 mt-1">{benefit.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-br from-blue-50 to-green-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to get your blockchain-based digital identity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center fade-in">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                    {step.number}
                  </div>
                  {index < steps.length - 2 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-green-300 transform -translate-y-0.5"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="mobile" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Mobile Image - will stack above text on mobile */}
            <div className="w-full lg:w-1/2 flex justify-center fade-in">
              <Mobile className="w-full max-w-md lg:max-w-lg xl:max-w-xl" />
            </div>

            {/* Text Content - will stack below image on mobile */}
            <div className="w-full lg:w-1/2 text-center lg:text-left fade-in">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Digital Wallet
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Access your digital identity anywhere, anytime through our
                user-friendly mobile app and web platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Secure Your Digital Identity?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of Sri Lankan citizens who have already embraced
              the future of secure, decentralized identity management
            </p>
            <button
              onClick={() => setShowApplyForm(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-4 rounded-full text-xl font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all shadow-lg"
            >
              Apply for SLUID Today
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">🇱🇰</div>
                <div>
                  <h3 className="text-xl font-bold">SLUID</h3>
                  <p className="text-sm text-gray-400">Blockchain Identity</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Secure, decentralized digital identity system powered by
                blockchain technology for Sri Lankan citizens.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">
                Quick Links
              </h4>
              <div className="space-y-2">
                <a
                  href="#apply"
                  className="block text-gray-300 hover:text-white transition"
                >
                  Apply Now
                </a>
                <a
                  href="#support"
                  className="block text-gray-300 hover:text-white transition"
                >
                  Support Center
                </a>
                <a
                  href="#faq"
                  className="block text-gray-300 hover:text-white transition"
                >
                  FAQ
                </a>
                <a
                  href="#downloads"
                  className="block text-gray-300 hover:text-white transition"
                >
                  App Downloads
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">
                Services
              </h4>
              <div className="space-y-2">
                <a
                  href="#government"
                  className="block text-gray-300 hover:text-white transition"
                >
                  Government Services
                </a>
                <a
                  href="#banking"
                  className="block text-gray-300 hover:text-white transition"
                >
                  Banking Integration
                </a>
                <a
                  href="#healthcare"
                  className="block text-gray-300 hover:text-white transition"
                >
                  Healthcare Access
                </a>
                <a
                  href="#education"
                  className="block text-gray-300 hover:text-white transition"
                >
                  Education Portal
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-400">
                Contact
              </h4>
              <div className="space-y-2 text-gray-300">
                <p>📞 +94 11 712 3456</p>
                <p>✉️ info@sluid.gov.lk</p>
                <p>🏢 Colombo 07, Sri Lanka</p>
                <p>🕒 24/7 Support Available</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 SLUID - Sri Lanka Unique Digital Identity System. All
              rights reserved.
            </p>
            <p className="mt-2">
              Powered by Hyperledger Fabric | Ministry of Digital Technology
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLoginModal && <LoginModal />}
      {showApplyForm && <ApplyForm />}

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Signin;
