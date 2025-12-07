import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Building2, Smartphone, LogIn, Menu, MapPin, Camera, Clock, BarChart3, WifiOff, ShieldCheck, Check, Mail, Phone, Map } from "lucide-react";
import generatedImage from "@assets/generated_images/minimalist_logo_for_field_workforce_app.png";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to send message",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: data.message || "Your message has been sent successfully!",
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  const features = [
    {
      icon: MapPin,
      title: "Live GPS Tracking",
      description: "Monitor your field team's real-time location on an interactive map. Know who is where, instantly."
    },
    {
      icon: Clock,
      title: "Smart Attendance",
      description: "Geofence-based punch-in/out ensures employees are actually at the work site when they mark attendance."
    },
    {
      icon: Camera,
      title: "Visit Verification",
      description: "Require photo proof and location tags for every client visit. Eliminate fake reporting forever."
    },
    {
      icon: WifiOff,
      title: "Offline Mode",
      description: "No internet? No problem. The app works offline and auto-syncs data once connectivity is restored."
    },
    {
      icon: BarChart3,
      title: "Productivity Reports",
      description: "Get automated daily summaries of tasks completed, distance travelled, and hours worked."
    },
    {
      icon: ShieldCheck,
      title: "Task Management",
      description: "Assign daily routes and tasks directly from the admin panel. Track completion in real-time."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for small teams just getting started.",
      features: ["Up to 5 Employees", "Basic GPS Tracking", "30 Days History", "Standard Support"],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Professional",
      price: "$5",
      period: "/user/month",
      description: "For growing businesses needing full visibility.",
      features: ["Unlimited Employees", "Advanced Geofencing", "Visit Photo Proofs", "Route Optimization", "Priority Support"],
      cta: "Start 14-Day Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for large organizations.",
      features: ["Dedicated Account Manager", "API Access", "Custom Integrations", "White Label App", "SLA Guarantee"],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Navbar */}
      <header className="h-16 border-b bg-white/80 backdrop-blur sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between shadow-sm">
        <Logo className="text-xl" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link href="/login">
            <Button size="sm" className="font-bold">Get Started</Button>
          </Link>
        </nav>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link href="/login">
                <Button className="w-full font-bold">Get Started</Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 py-16">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center">
          
          {/* Brand Side */}
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-tight">
              Workforce Management <br />
              <span className="text-primary">Without The Hardware</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
              Track attendance, manage tasks, and verify field visits using just a smartphone. Zero equipment needed.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
               <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white px-3 py-1.5 rounded-full border shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  GPS Verified
               </div>
               <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white px-3 py-1.5 rounded-full border shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Offline Mode
               </div>
               <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white px-3 py-1.5 rounded-full border shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  Battery Efficient
               </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="w-full max-w-sm mx-auto md:ml-auto">
             <Card className="border-0 shadow-2xl ring-1 ring-black/5 overflow-hidden hover:scale-[1.02] transition-transform duration-300">
               <CardHeader className="bg-primary text-primary-foreground pb-8 pt-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Logo light className="scale-150" />
                 </div>
                 <CardTitle className="font-heading text-2xl relative z-10">Welcome to FieldForce</CardTitle>
                 <CardDescription className="text-primary-foreground/80 relative z-10">
                   Secure access for Admins & Employees
                 </CardDescription>
               </CardHeader>
               
               <CardContent className="-mt-4 relative z-20 px-6 pb-6 bg-white rounded-t-xl pt-6 space-y-4">
                 <Link href="/login">
                   <Button className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 group relative overflow-hidden">
                     <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                     <span className="relative flex items-center gap-2">
                       Login to Portal <LogIn className="w-5 h-5" />
                     </span>
                   </Button>
                 </Link>
                 <p className="text-center text-xs text-muted-foreground px-4">
                   By logging in, you agree to our Terms of Service and Privacy Policy.
                 </p>
               </CardContent>
             </Card>
          </div>

        </div>
      </main>

      {/* About Section */}
      <section id="about" className="py-20 bg-white border-t scroll-mt-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">Why Choose FieldForce?</h2>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
               Small to mid-sized businesses struggle with tracking field teams. Biometrics are expensive, and WhatsApp reporting is messy. We built a solution that just works.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-muted/30 border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-heading">100% Hardware Free</h3>
              <p className="text-muted-foreground">
                No biometric devices. No RFID tags. No expensive GPS trackers. We use the smartphone your employees already have.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-muted/30 border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-heading">Real-Time Visibility</h3>
              <p className="text-muted-foreground">
                Know exactly where your team is. View live locations, attendance status, and task progress from a single dashboard.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-muted/30 border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <LogIn className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-heading">Trust, But Verify</h3>
              <p className="text-muted-foreground">
                Prevent fake attendance with GPS geofencing. Ensure client visits are genuine with photo proofs and location stamps.
              </p>
            </div>
          </div>
          
          <div className="mt-16 p-8 rounded-3xl bg-primary text-primary-foreground text-center space-y-6">
             <h3 className="text-2xl font-heading font-bold">Ready to modernize your workforce?</h3>
             <p className="opacity-90 max-w-xl mx-auto">
               Join thousands of businesses saving time and increasing productivity with our simple, mobile-first solution.
             </p>
             <Link href="/login">
               <Button size="lg" variant="secondary" className="font-bold">
                 Start Free Trial
               </Button>
             </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30 border-t scroll-mt-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Everything You Need</h2>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
               Powerful features designed to solve the real-world problems of managing a distributed force tracker team.
             </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="font-heading text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white border-t scroll-mt-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Simple, Transparent Pricing</h2>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
               Choose the plan that fits your team size. No hidden fees. Cancel anytime.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {pricingPlans.map((plan, idx) => (
              <Card key={idx} className={`border-2 relative overflow-hidden transition-all duration-300 hover:shadow-xl ${plan.popular ? 'border-primary shadow-lg scale-105 z-10' : 'border-muted'}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="font-heading text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-2 min-h-[40px]">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6 pt-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold font-heading">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                  </div>
                  
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/login" className="w-full">
                    <Button className="w-full font-bold" variant={plan.popular ? "default" : "outline"}>
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30 border-t scroll-mt-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Get In Touch</h2>
                <p className="text-lg text-muted-foreground">
                  Have questions about enterprise plans or need a custom demo? Our team is ready to help.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Map className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Headquarters</h3>
                    <p className="text-muted-foreground">123 Business Park, Sector 62<br />Noida, UP 201309, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Email Us</h3>
                    <p className="text-muted-foreground">sales@fieldforce.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Call Us</h3>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-lg ring-1 ring-border bg-white">
              <CardHeader>
                <CardTitle className="font-heading text-xl">Send us a message</CardTitle>
                <CardDescription>We usually reply within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">First Name</label>
                      <Input 
                        placeholder="John" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Last Name</label>
                      <Input 
                        placeholder="Doe" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                    <Input 
                      type="email" 
                      placeholder="john@company.com" 
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Company (Optional)</label>
                    <Input 
                      placeholder="Your Company" 
                      name="company"
                      value={formData.company}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</label>
                    <Textarea 
                      placeholder="How can we help you?" 
                      className="min-h-[120px]" 
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="w-full font-bold" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t bg-white text-center text-xs text-muted-foreground">
        <p>&copy; 2025 FieldForce Systems. All rights reserved.</p>
      </footer>
    </div>
  );
}
