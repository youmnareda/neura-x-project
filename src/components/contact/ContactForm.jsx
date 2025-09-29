import React, { useEffect } from "react";
import "../../assets/styles/Contact.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
 
const Contact = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  return (
     <div className="container">
      <div className="contact-center">
    <div className="Contact">
     
        <div className="row">
          {/* Contact Text Column */}
          <div className="cotact-text col-md-5" data-aos="fade-right">
            <div className="box">
              <h3 className="title-contact">Contact</h3>
              <p className="prg-contact">
                Whether you have a question about your brain scan report, need assistance navigating our platform, or simply want to learn more about our AI diagnosis system, we're ready to listen.
              </p>
            </div>
            <div className="box">
              <h4 className="title2">Address</h4>
               <ul className="txt">
                 <li>[Neura-X]</li>
                 <li>[Ismailia, Egypt]</li>
               </ul>
    
            </div>
            <div className="box">
              <h4 className="title2">Phone</h4>
              <p className="txt">+126454575774</p>
            </div>
            <div className="box">
              <h4 className="title2 ">Email</h4>
              <a href="mailto:Neura-X@gmail.com" id="lin" className="txt">Neura-X@gmail.com</a>
            </div>
          </div>

          <div className="col-md-1 p-4 mt-3"></div>

          {/* Contact Form Column */}
          <div className="contact-form col-md-5 p-4 mt-1" data-aos="fade-left">
            <div className="col-lg-10   form-text">
              <div className="row">
                <div className="col-lg-6 mt-3 ">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                  />
                </div>
                <div className="col-lg-6 mt-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                  />
                </div>
                <div className="col-12 mt-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone"
                  />
                </div>
                <div className="col-12 mt-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                  />
                </div>
              </div>
              <label htmlFor="message" className="form-label "></label>
              <textarea
                className="form-control"
                id="message"
                placeholder="Message"
                rows="2"
              ></textarea>
              <div className="text-center mt-3">
                <button type="submit" className="btn btn-secondary btn-contact">
                  Send a Message
                </button>
              </div>
            </div>
          </div>
        </div>
</div>
       
      </div>
    </div>
  );
};

export default Contact;