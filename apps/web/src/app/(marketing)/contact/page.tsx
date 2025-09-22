'use client'

import React, { useState } from 'react'
import { profileData } from '@/lib/profile-data'
import { Button } from '@portfolio/ui'
import { Mail, MapPin, Phone, Send, Github, Linkedin } from 'lucide-react'
import { ContactModal } from '@/components/ContactModal'

export default function ContactPage() {
  const profile = profileData
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modal, setModal] = useState<{
    isOpen: boolean
    type: 'success' | 'error'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)
      
      const firstName = (formData.get('firstName') as string)?.trim()
      const lastName = (formData.get('lastName') as string)?.trim()
      const email = (formData.get('email') as string)?.trim()
      const subject = (formData.get('subject') as string)?.trim()
      const message = (formData.get('message') as string)?.trim()

      // Client-side validation
      if (!firstName || !lastName) {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Invalid Form Data',
          message: 'Please fill in both first name and last name.'
        })
        setIsSubmitting(false)
        return
      }

      if (!email || !email.includes('@')) {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Invalid Form Data', 
          message: 'Please enter a valid email address.'
        })
        setIsSubmitting(false)
        return
      }

      if (!subject || subject.length < 5) {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Invalid Form Data',
          message: 'Subject must be at least 5 characters long.'
        })
        setIsSubmitting(false)
        return
      }

      if (!message || message.length < 10) {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Invalid Form Data',
          message: 'Message must be at least 10 characters long.'
        })
        setIsSubmitting(false)
        return
      }

      const requestBody = {
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        subject: subject,
        message: message
      }

      // Debug logging
      console.log('Form data being sent:', requestBody)

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (response.ok) {
        setModal({
          isOpen: true,
          type: 'success',
          title: 'Message Sent Successfully!',
          message: 'Thank you for reaching out! I\'ve received your message and will get back to you soon.'
        })
        form.reset()
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.log('API error response:', errorData)
        
        let errorMessage = 'Something went wrong while sending your message. Please try again or contact me directly via email.'
        
        if (errorData.details && Array.isArray(errorData.details)) {
          // Format Zod validation errors
          const validationErrors = errorData.details.map((err: any) => 
            `${err.path?.join('.')}: ${err.message}`
          ).join(', ')
          errorMessage = `Invalid form data: ${validationErrors}`
        } else if (errorData.error) {
          errorMessage = errorData.error
        }

        setModal({
          isOpen: true,
          type: 'error',
          title: 'Failed to Send Message',
          message: errorMessage
        })
      }
    } catch (error) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Network Error',
        message: 'Unable to send your message due to a network issue. Please check your connection and try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }))
  }

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
                  href={`mailto:${profile.contact.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {profile.contact.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <span className="text-muted-foreground">
                  Available upon request
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
              <div className="p-3 bg-primary/10 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-muted-foreground">{profile.location}</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Find me online</h3>
            <div className="flex gap-4">
              <Button variant="outline" size="icon" asChild>
                <a href={profile.contact.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
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
          
          <form className="space-y-6" onSubmit={handleSubmit}>
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
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              By submitting this form, you agree that I may contact you regarding your inquiry.
            </p>
          </form>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        fallbackEmail={profile.contact.email}
      />
    </div>
  )
}