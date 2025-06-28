"use client";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserCheck, 
  Shield, 
  Clock, 
  Search, 
  FileText, 
  MessageSquare 
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: UserCheck,
      title: "Easy Registration",
      description: "Quick and simple sign-up process for residents with document verification."
    },
    {
      icon: Shield,
      title: "Admin Validation",
      description: "Comprehensive verification system for administrators to validate resident details."
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Instant notifications and status updates throughout the registration process."
    },
    {
      icon: Search,
      title: "Property Search",
      description: "Advanced filtering options to find the perfect PG accommodation."
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Secure upload and management of all required documents and certificates."
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Direct messaging between residents and administrators for seamless communication."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive features designed to make PG management effortless for everyone involved.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;