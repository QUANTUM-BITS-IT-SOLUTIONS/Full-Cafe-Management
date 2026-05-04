'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Volume2, VolumeX, Menu, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function Hero() {
  const [isMuted, setIsMuted] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const prefersReducedMotion = useReducedMotion() || false

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Video setup with proper event handling and cleanup
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.volume = 0
    video.muted = true
    video.defaultMuted = true

    const handleError = () => setVideoError(true)
    const handlePlay = () => {
      video.muted = isMuted
      video.volume = isMuted ? 0 : 0.7
    }

    video.addEventListener('error', handleError)
    video.addEventListener('play', handlePlay)

    // Try to play the video
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => setVideoError(true))
    }

    return () => {
      video.removeEventListener('error', handleError)
      video.removeEventListener('play', handlePlay)
    }
  }, [])

  // Update video mute state when isMuted changes
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = isMuted
      video.volume = isMuted ? 0 : 0.7
    }
  }, [isMuted])

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isMobileMenuOpen])

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMobileMenuOpen])



  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* MASSIVE VIDEO - Takes up 95% of space */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-110"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://mojli.s3.us-east-2.amazonaws.com/Mojli+Website+upscaled+(12mb).webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Full-Width Navbar */}
      <motion.nav
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.3 }}
        className="fixed top-0 left-0 right-0 w-full z-50"
      >
        <div 
          className={`w-full px-6 sm:px-8 lg:px-12 py-4 transition-all duration-300 ease-out ${
            isScrolled 
              ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' 
              : 'bg-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              className="flex items-center cursor-pointer"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
              }}
            >
              <span className="font-bagel text-white text-xl tracking-wider">MOJJU</span>
            </motion.div>

            {/* Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="#portfolio" 
                className="text-white hover:text-white/80 font-medium gentle-animation hover:scale-105"
              >
                Work
              </a>
              <a 
                href="#about" 
                className="text-white hover:text-white/80 font-medium gentle-animation hover:scale-105"
              >
                Process
              </a>
              <a 
                href="#services" 
                className="text-white hover:text-white/80 font-medium gentle-animation hover:scale-105"
              >
                Capabilities
              </a>
              <a 
                href="#team" 
                className="text-white hover:text-white/80 font-medium gentle-animation hover:scale-105"
              >
                Team
              </a>
              <a 
                href="#contact" 
                className="text-white hover:text-white/80 font-medium gentle-animation hover:scale-105"
              >
                Contact
              </a>
            </div>

            {/* Right Side - Video Controls + CTA + Mobile Menu */}
            <div className="flex items-center space-x-3 relative">
              {/* Video Controls with Sound On indicator */}
              <div className="relative">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="glass-effect p-3 rounded-full text-white hover:bg-white/20 gentle-animation cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                
                {/* Sound On indicator - only show when muted */}
                {isMuted && (
                  <div className="absolute -bottom-10 right-0 flex items-center text-white/80">
                    <span className="whitespace-nowrap font-medium text-sm mr-2">Sound On</span>
                    <span className="text-lg">↗</span>
                  </div>
                )}
              </div>
              
              {/* CTA Button - Hidden on mobile */}
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                onClick={() => {
                  const contactSection = document.getElementById('contact')
                  contactSection?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
                }}
                className="hidden sm:block bg-red-600 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-md hover:bg-red-700 gentle-animation ml-4 cursor-pointer"
              >
                Book a Call
              </motion.button>

              {/* Mobile Hamburger Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden glass-effect p-3 rounded-full text-white hover:bg-white/20 active:bg-white/30 gentle-animation cursor-pointer z-50 relative"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-md z-40 cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isMobileMenuOpen ? '0%' : '100%' }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', damping: 25, stiffness: 200 }}
        className="md:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-black/90 backdrop-blur-xl border-l border-white/10 z-50 mobile-menu-panel pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Close Button at the top */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="glass-effect p-3 rounded-full text-white hover:bg-white/20 active:bg-white/30 gentle-animation cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col px-6 pb-6 h-full">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-4 text-white">
              <a 
                href="#portfolio" 
                className="mobile-menu-link px-4 py-3 hover:text-white/80 hover:bg-white/10 rounded-lg gentle-animation font-medium text-lg active:bg-white/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Work
              </a>
              <a 
                href="#about" 
                className="mobile-menu-link px-4 py-3 hover:text-white/80 hover:bg-white/10 rounded-lg gentle-animation font-medium text-lg active:bg-white/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Process
              </a>
              <a 
                href="#services" 
                className="mobile-menu-link px-4 py-3 hover:text-white/80 hover:bg-white/10 rounded-lg gentle-animation font-medium text-lg active:bg-white/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Capabilities
              </a>
              <a 
                href="#team" 
                className="mobile-menu-link px-4 py-3 hover:text-white/80 hover:bg-white/10 rounded-lg gentle-animation font-medium text-lg active:bg-white/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Team
              </a>
              <a 
                href="#contact" 
                className="mobile-menu-link px-4 py-3 hover:text-white/80 hover:bg-white/10 rounded-lg gentle-animation font-medium text-lg active:bg-white/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
            </div>

            {/* Mobile CTA Button */}
            <motion.button
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              onClick={() => {
                const contactSection = document.getElementById('contact')
                contactSection?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
                setIsMobileMenuOpen(false)
              }}
              className="bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 active:bg-red-800 gentle-animation mt-8 cursor-pointer"
            >
              Book a Call
            </motion.button>
          </div>
        </div>
      </motion.div>



      {/* Big Studio Title - Lower Left */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-12 left-6 sm:left-8 lg:left-12 z-40"
      >
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight text-white">
            <span className="block">AI FILM</span>
            <span className="block">PRODUCTION</span>
            <span className="block">WITHOUT LIMITS</span>
          </h1>
        </div>
      </motion.div>


    </div>
  )
}