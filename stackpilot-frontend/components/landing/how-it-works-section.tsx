"use client";

const steps = [
  {
    title: "Upload Your Resume",
    description:
      "Simply drag and drop your resume or paste the content. Our AI will instantly analyze it.",
  },
  {
    title: "Get AI Analysis",
    description:
      "Receive comprehensive ATS scoring, skill analysis, and personalized recommendations.",
  },
  {
    title: "Find Perfect Matches",
    description:
      "Browse through AI-matched job opportunities tailored to your skills and experience.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-navy mb-4">How it works</h2>
          <p className="text-lg text-gray-600">Get started in 3 simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
