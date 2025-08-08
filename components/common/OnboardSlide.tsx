type OnboardSlideProps = {
  title: string;
  description: string;
  subpoints: string[];
  visible: boolean;
};

export default function OnboardSlide({
  title,
  description,
  subpoints,
  visible,
}: OnboardSlideProps) {
  return (
    <div
      className={`transition-opacity duration-500 ease-in-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">{title}</h1>
      <p className="mt-4 text-sm md:text-lg text-white/90 leading-relaxed">{description}</p>
      <ul className="mt-4 md:mt-6 space-y-1 md:space-y-2 text-white/80 list-disc list-inside text-xs md:text-sm">
        {subpoints.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
