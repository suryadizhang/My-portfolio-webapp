import { Mail, MapPin, Phone, Send } from 'lucide-react'

export const metadata = {
  title: 'Contact - Your Name',
  description: 'Get in touch with me for project collaborations, job opportunities, or just to say hello.',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          I'm always open to discussing new opportunities, interesting projects, 
          or just having a chat about technology and development.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Let's Connect</h2>
            <p className="text-muted-foreground mb-8">
              Whether you're looking to hire a developer, collaborate on a project, 
              or just want to say hello, I'd love to hear from you.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <a 
                  href="mailto:hello@yourname.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  hello@yourname.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <a 
                  href="tel:+1234567890"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +1 (234) 567-8900
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
              <div className="p-3 bg-primary/10 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-muted-foreground">San Francisco, CA</p>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="font-semibold mb-2">Current Status</h3>
            <p className="text-sm text-muted-foreground">
              🟢 Available for new projects and opportunities
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              I typically respond to messages within 24 hours.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card p-8 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
          
          <form className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Project Collaboration"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Tell me about your project or how I can help you..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>

            <p className="text-xs text-muted-foreground text-center">
              By submitting this form, you agree that I may contact you regarding your inquiry.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}