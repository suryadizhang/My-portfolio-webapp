"use client"

import Image from 'next/image'

interface ProjectImageProps {
  src: string
  alt: string
  title: string
  className?: string
}

export function ProjectImage({ src, alt, title, className }: ProjectImageProps) {
  const baseClasses = "relative h-48 bg-gradient-to-br from-primary/20 to-primary/40"
  const finalClasses = className ? `${baseClasses} ${className}`.replace('h-48', '') : baseClasses
  
  return (
    <div className={finalClasses}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={(e) => {
          // Fallback to placeholder if image fails to load
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-primary font-medium opacity-50">{title}</span>
      </div>
    </div>
  )
}