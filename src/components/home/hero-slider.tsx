"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

const slides = [
  {
    image: "https://picsum.photos/seed/slide1/1920/1080",
    imageHint: "fashion sale",
    headline: "Up to 50% Off",
    description: "On all women's fashion. Discover the latest trends.",
    buttonLink: "/categories/fashion",
    buttonText: "Shop Now",
  },
  {
    image: "https://picsum.photos/seed/slide2/1920/1080",
    imageHint: "electronics gadget",
    headline: "Latest Gadgets",
    description: "Explore the newest arrivals in electronics.",
    buttonLink: "/categories/electronics",
    buttonText: "Explore",
  },
  {
    image: "https://picsum.photos/seed/slide3/1920/1080",
    imageHint: "home decor",
    headline: "Transform Your Home",
    description: "Find the perfect decor for every room.",
    buttonLink: "/categories/home-kitchen",
    buttonText: "Discover",
  },
]

export function HeroSlider() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="relative w-full h-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative h-full w-full">
                <Image
                  src={slide.image}
                  alt={slide.headline}
                  fill
                  className="object-cover"
                  data-ai-hint={slide.imageHint}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                  <h2 className="text-4xl md:text-6xl font-bold font-headline mb-4" data-aos="fade-up">
                    {slide.headline}
                  </h2>
                  <p className="text-lg md:text-xl max-w-2xl mb-8" data-aos="fade-up" data-aos-delay="200">
                    {slide.description}
                  </p>
                  <Button asChild size="lg" data-aos="fade-up" data-aos-delay="400">
                    <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
