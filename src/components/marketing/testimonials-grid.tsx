interface Testimonial {
  names: string;
  city: string;
  message: string;
}

export function TestimonialsGrid({ testimonials }: { testimonials: readonly Testimonial[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {testimonials.map(({ names, city, message }) => (
        <div
          key={names}
          className="bg-white border-l-4 border-salmon rounded-2xl p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
          style={{ boxShadow: "0 4px 20px rgba(107,66,57,0.06)" }}
        >
          <p className="font-['Georgia',serif] italic text-gray-700 leading-relaxed mb-4">
            &ldquo;{message}&rdquo;
          </p>
          <p className="font-sans text-sm font-bold text-dark-brown">{names}</p>
          <p className="font-sans text-xs text-gray-400">{city}</p>
        </div>
      ))}
    </div>
  );
}
