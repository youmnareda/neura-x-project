// src/components/WhyChooseUs.jsx
import React, { useEffect, useRef } from "react";
import "../../assets/styles/WhyChooseUs.css";
import slid1 from "../../assets/images/slid1.jpg";
import slid2 from "../../assets/images/slid2.jpg";
import slid3 from "../../assets/images/slid3.jpg";

const cardData = [
  {
    image: slid1,
    alt: "AI Revolution",
    title: "Revolutionizing Healthcare with AI",
    text: `  Our AI-powered platform is redefining medical diagnostics by analyzing
          X-ray and CT scan images with unmatched precision. By enabling early
          detection of critical conditions such as brain cancer, tumors, and
          aneurysms, we empower doctors to make informed decisions quickly.
          Early diagnosis leads to more effective treatments, ultimately
          improving patient outcomes and saving lives.`,
    className: "animate-right",
  },
  {
    image: slid2,
    alt: "Accurate Diagnosis",
    title: "Accurate and Fast Diagnoses",
    text: ` Speed and accuracy are essential in medical diagnostics. Our system
          leverages cutting-edge deep learning algorithms to analyze images in
          seconds, providing highly accurate results. By minimizing the risk of
          misdiagnosis and reducing wait times, our AI-powered tool supports
          healthcare professionals in delivering timely and effective patient
          care.`,
    className: "card2 reverse animate-left",
  },
  {
    image: slid3,
    alt: "Empowering Patients",
    title: "Empowering Patients and Doctors",
    text: ` We bridge the gap between technology and healthcare by providing an
          intuitive and reliable diagnostic tool. Patients gain access to quick
          preliminary assessments, while medical professionals receive
          AI-assisted insights to support their expertise. Our goal is to
          enhance collaboration between doctors and patients, leading to more
          proactive and personalized healthcare solutions.`,
    className: "animate-right",
  },
];

const WhyChooseUs = () => {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((ref) => observer.observe(ref));
  }, []);

  return (
    <div className="container">
      <h2 className="text-center choose-title my-5 fw-bold">Why Choose Us</h2>
      {cardData.map((card, idx) => (
        <div
          key={idx}
          className={`card-section ${card.className}`}
          ref={(el) => (cardRefs.current[idx] = el)}
        >
          <div className="card-img">
            <img src={card.image} alt={card.alt} />
          </div>
          <div className="card-text">
            <h5>{card.title}</h5>
            <p>{card.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WhyChooseUs;
