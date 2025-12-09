import React from 'react';

const Footer = () => {
  return (
    <>
      {/* --- PRE-FOOTER: CONTACT SECTION --- */}
      <section className="contact-section">
         <h2>Contact <span className="us-red">Us</span></h2>
         {/* Re-added the SVG separator for consistent design */}
         <svg xmlns="http://www.w3.org/2000/svg" fill="#ec3136" width="20%" height="10" viewBox="0 -4 30 30" preserveAspectRatio="none" style={{height: '10px'}}>
             <polygon points="0,0 0,50 50,50"></polygon>
         </svg>
         <div style={{marginBottom: '20px'}}></div>

         <div className="contact-container">
            <div className="contact-column">
               <h3>CONTACT</h3>
               <div className="contact-info">
                  <div className="contact-icon"><i className="fas fa-phone-alt"></i></div>
                  <div className="contact-detail">
                      <p>+91 993453xxxx</p>
                      <p>+91 98357xxxxx</p>
                  </div>
               </div>
               <div className="contact-info">
                  <div className="contact-icon"><i className="fas fa-globe"></i></div>
                  <div className="contact-detail"><p>www.teermasala.com</p></div>
               </div>
            </div>

            <div className="contact-column">
               <h3>CUSTOMER CARE</h3>
               <div className="contact-info">
                  <div className="contact-icon"><i className="fas fa-phone"></i></div>
                  <div className="contact-detail"><p>(Toll Free) xxxx xxx xxx xxx</p></div>
               </div>
               <div className="contact-info">
                  <div className="contact-icon"><i className="fab fa-whatsapp"></i></div>
                  <div className="contact-detail"><p>+91 -993453xxxx</p></div>
               </div>
               <div className="contact-info">
                  <div className="contact-icon"><i className="fas fa-envelope"></i></div>
                  <div className="contact-detail"><p>xxxx@gmail.com</p></div>
               </div>
            </div>

            <div className="contact-column">
               <h3>ADDRESS</h3>
               <div className="contact-info">
                  <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
                  <div className="contact-detail"><p><b>Teer Brand (Pankaj Salt Mill)</b>, Tara Tand, Jhumri Telaiya, Koderma, Jharkhand, Ward 13, PIN - 825409</p></div>
               </div>
            </div>
         </div>
      </section>

      {/* --- MAIN FOOTER --- */}
      <footer className="footer">
        <p className="foot-para">
          © 2025 Copyright Teer Brand | <a href="#" className="foot">Privacy Policy</a> | 
          Designed and Developed By <a href="https://github.com/ShreshthTarwey" className="foot" target="_blank" rel="noreferrer">Shreshth Tarwey</a>
        </p>
      </footer>
    </>
  );
};

export default Footer;