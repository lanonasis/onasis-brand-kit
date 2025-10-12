"use client"

import {
  CardTransformed,
  CardsContainer,
  ContainerScroll,
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

function getSectionClass(dark = true) {
  return dark
    ? "bg-slate-900 text-white px-8 py-12"
    : "bg-blue-50 px-8 py-12"
}

function getReviewStarsClass(dark = true) {
  return dark ? "text-blue-400" : "text-blue-500"
}

function getTextClass(dark = true) {
  return dark ? "text-gray-200" : ""
}

function getAvatarClass(dark = true) {
  return dark
    ? "!size-12 border border-gray-700"
    : "!size-12 border border-blue-200"
}

function getCardVariant(dark = true) {
  return dark ? "dark" : "light"
}

export function Testimonials() {
  return (
    <section className={getSectionClass(true)}>
      <div>
        <h2 className="text-center text-4xl font-semibold">Client Testimonials</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-gray-300">
          Hear from our partners across Africa's financial and technology sectors
        </p>
      </div>
      <ContainerScroll className="container h-[300vh]">
        <div className="sticky left-0 top-0 h-svh w-full py-12">
          <CardsContainer className="mx-auto size-full h-[450px] w-[350px]">
            {TESTIMONIALS.map((testimonial, index) => (
              <CardTransformed
                arrayLength={TESTIMONIALS.length}
                key={testimonial.id}
                variant={getCardVariant(true)}
                index={index + 2}
                role="article"
                aria-labelledby={`card-${testimonial.id}-title`}
                aria-describedby={`card-${testimonial.id}-content`}
              >
                <div className="flex flex-col items-center space-y-4 text-center">
                  <ReviewStars
                    className={getReviewStarsClass(true)}
                    rating={testimonial.rating}
                  />
                  <div className={`mx-auto w-4/5 text-lg ${getTextClass(true)}`}>
                    <blockquote cite="#">{testimonial.description}</blockquote>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className={getAvatarClass(true)}>
                    <AvatarImage
                      src={testimonial.avatarUrl}
                      alt={`Portrait of ${testimonial.name}`}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="block text-lg font-semibold tracking-tight md:text-xl">
                      {testimonial.name}
                    </span>
                    <span className="block text-sm text-gray-400">
                      {testimonial.profession}
                    </span>
                  </div>
                </div>
              </CardTransformed>
            ))}
          </CardsContainer>
        </div>
      </ContainerScroll>
    </section>
  );
}
