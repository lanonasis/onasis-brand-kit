"use client"

import {
  ReviewStars,
} from "../components/blocks/animated-cards-stack"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

const TESTIMONIALS = [
  {
    id: "testimonial-3",
    name: "Michael O.",
    profession: "FinTech Director",
    rating: 5,
    description:
      "VortexCore AI has transformed our approach to compliance across multiple African markets. Their innovative solutions and quick turnaround time made our partnership incredibly successful.",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "testimonial-1",
    name: "Amina K.",
    profession: "Compliance Officer",
    rating: 4.5,
    description:
      "The attention to detail and regulatory knowledge in Lan Onasis's compliance technology is exceptional. Their platform has significantly reduced our risk exposure across our operations in Ghana and Kenya.",
    avatarUrl:
      "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "testimonial-2",
    name: "Chike N.",
    profession: "Bank Executive",
    rating: 5,
    description:
      "Working with the Lan Onasis team was a game-changer for our digital transformation strategy. Their expertise in financial technology and deep understanding of African markets exceeded our expectations.",
    avatarUrl:
      "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGUlMjBhZnJpY2FufGVufDB8fDB8fHww",
  },
  {
    id: "testimonial-4",
    name: "Fatima M.",
    profession: "RegTech Analyst",
    rating: 4.5,
    description:
      "The quality of Lan Onasis's financial services platform and communication throughout our implementation was outstanding. Their team truly understands the unique challenges of operating in emerging African markets.",
    avatarUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D",
  },
];

function getReviewStarsColorClass(isDarkMode: boolean): string {
  const textColor = isDarkMode ? 'text-blue-400' : 'text-blue-500';
  return textColor;
}

export function Testimonials() {
  const isDarkMode = true; // Assuming dark mode is enabled for this example

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Client Testimonials
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hear from our partners across Africa's financial and technology sectors
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="flex items-center mb-6">
                <Avatar className="w-16 h-16 border-2 border-slate-600">
                  <AvatarImage
                    src={testimonial.avatarUrl}
                    alt={`Portrait of ${testimonial.name}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-slate-700 text-white text-lg font-semibold">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-blue-400 font-medium">
                    {testimonial.profession}
                  </p>
                </div>
                <div className="ml-auto">
                  <ReviewStars
                    className={getReviewStarsColorClass(isDarkMode)}
                    rating={testimonial.rating}
                  />
                </div>
              </div>
              
              <blockquote className="text-gray-300 leading-relaxed text-lg italic">
                "{testimonial.description}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
