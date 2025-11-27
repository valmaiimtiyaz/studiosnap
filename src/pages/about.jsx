import React from "react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-[#610049] mb-20">
          About StudioSnap
        </h1>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-[#610049] mb-3">
            More Than Just Photos
          </h2>
          <p className="text-lg text-[#610049] leading-relaxed">
            At StudioSnap, a photo isn't just a click. We want every moment to
            feel effortless and fun. With sharp cameras, aesthetic layouts, and
            an easy flow, all you need to do is pose, we'll take care of the
            rest.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div className="p-6 bg-[#FCF9E9] rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-[#610049] mb-2">
              Fully Customizable Layouts
            </h3>
            <p className="text-[#610049]">
              Pick a layout you like and personalize it by choosing the frame color that fits your event
            </p>
          </div>

          <div className="p-6 bg-[#FCF9E9] rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-[#610049] mb-2">
              Sharp & Stunning Photos
            </h3>
            <p className="text-[#610049]">
              Even though it's online, we keep everything looking clean, bright,
              and photo-ready. Your guests get pictures that actually look good,
              not blurry screenshots
            </p>
          </div>

          <div className="p-6 bg-[#FCF9E9] rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-[#610049] mb-2">
              Instant Digital Access
            </h3>
            <p className="text-[#610049]">
              Download your photos instantly and share them right away. No
              waiting. No hassle. Just snap, save, and share
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
