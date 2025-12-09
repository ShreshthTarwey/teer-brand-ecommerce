import React from 'react';
import './WhoWeAre.css'; // Ensure this matches your CSS filename

const WhoWeAre = () => {
  return (
    <div className="who-we-are-page">
      
      {/* 1. HERO BANNER */}
      <section className="hero-banner">
        <h1>Who We Are</h1>
      </section>

      {/* 2. COMPANY PROFILE */}
      <section className="company-profile">
        <img src="/images/Teer_Brand_Mascot_v3.jpg" alt="Teer Brand Mascot" className="company-profile-image" />

        <div className="company-profile-text">
          <h2 style={{fontSize: 'larger'}}>
            Company <span style={{color: '#ec3136', fontSize: '2.5rem'}}>Profile</span>
          </h2>
          {/* SVG Block */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="#ec3136" width="40%" height="70" viewBox="0 0 50 40" stroke="#ec3136" strokeWidth="1" preserveAspectRatio="none" style={{height: '10px'}}>
            <polygon points="0,0 0,50 50,50"></polygon>
          </svg>
          
          <p>As part of our commitment to bringing authentic flavors to every kitchen, <strong>Teer Brand</strong> has steadily grown into a trusted name in the world of spices and salt. Our focus on hygiene, quality, and tradition ensures that every pack we deliver enhances the taste of your meals.</p>
          <p>In addition to our core range of spices, we also offer <strong>premium quality salt</strong>, carefully processed to retain its natural goodness. Each product reflects our dedication to purity and our desire to serve households with ingredients they can trust.</p>
          <p>While we are currently a <strong>local brand</strong>, our customer base continues to grow through word-of-mouth and community trust. You'll find Teer Brand products in a variety of retail outlets including local kirana stores and general stores, thanks to the support of our distribution partners.</p>
          <p>At <strong>Teer Brand</strong>, we take pride in our carefully curated product line that includes essential spices like turmeric, chili powder, coriander, garam masala, and more. With every product, we aim to deliver not just taste, but also the <strong>trust of quality and hygiene</strong>.</p>
        </div>
      </section>

      {/* 3. SPICES & FOOD SECTION */}
      <section className="section spices-food-section">
        <div className="section-content">
          <div className="section-text">
            <div className="section-header">
              <h2>Spices and <span className="red-text">Food</span> Products</h2>
              <svg xmlns="http://www.w3.org/2000/svg" fill="#ec3136" width="40%" height="90" viewBox="0 0 50 50" stroke="#ec3136" strokeWidth="1" preserveAspectRatio="none" style={{height: '10px'}}>
                <polygon points="0,0 0,50 50,50"></polygon>
              </svg>
            </div>
            <p style={{color: '#666', lineHeight: '1.6', marginBottom: '15px'}}>
              <strong>Teer Brand</strong> offers a select range of high-quality spices and salt, carefully sourced and processed with a strong focus on hygiene and purity. Our commitment to maintaining traditional flavors and clean processing methods ensures that each product meets the everyday culinary needs of our valued customers.
            </p>
          </div>
          <div className="section-image">
            <img src="/images/Spices_in_bowls_main.png" alt="Spices in a Bowl" />
          </div>
        </div>
      </section>

      {/* 4. MANUFACTURING FACILITY */}
      <section className="manufacturing-facility">
        <div className="section-header">
          <h2>Manufacturing <span className="red-text">Facility</span></h2>
          <svg xmlns="http://www.w3.org/2000/svg" fill="#ec3136" width="40%" height="90" viewBox="0 0 50 40" stroke="#ec3136" strokeWidth="1" preserveAspectRatio="none" style={{height: '10px', marginLeft: "525px"}}>
            <polygon points="0,0 0,50 50,50"></polygon>
          </svg>
        </div>

        <div className="manufacturing-grid">
          <div className="grid-item">
            <img src="/images/chilli-1.jpg" alt="Chilli" />
            <div className="grid-item-label">CHILLI</div>
          </div>
          <div className="grid-item">
            <img src="/images/Turmeric_powder.jpg" alt="Turmeric" />
            <div className="grid-item-label">TURMERIC</div>
          </div>
          <div className="grid-item">
            <img src="/images/Blended_spices.jpg" alt="Blended Spices" />
            <div className="grid-item-label">BLENDED SPICES</div>
          </div>
          <div className="grid-item">
            <img src="/images/Coriender.png" alt="Coriander" />
            <div className="grid-item-label">CORIANDER</div>
          </div>
          <div className="grid-item">
            <img src="/images/Cold_Storage.png" alt="In-House Cold Storage" />
            <div className="grid-item-label">IN-HOUSE COLD STORAGE</div>
          </div>
          <div className="grid-item">
            <img src="/images/Spice_meachine.jpg" alt="Cryogenic Grinding" />
            <div className="grid-item-label">GRINDING QUALITY, ONE SPICE AT A TIME</div>
          </div>
        </div>
      </section>

      {/* 5. INFRASTRUCTURE SECTION */}
      <section className="company-infrastructure">
        <div className="section-header">
          <h2>Company <span className="red-text">Infrastructure</span></h2>
          <svg xmlns="http://www.w3.org/2000/svg" fill="#ec3136" width="38%" height="90" viewBox="0 0 50 40" stroke="#ec3136" strokeWidth="1" preserveAspectRatio="none" style={{height: '10px', marginLeft: "525px"}}>
            <polygon points="0,0 0,50 50,50"></polygon>
          </svg>
        </div>

        <div className="infrastructure-content">
          <div className="infrastructure-text">
            <h3>The Essence of Authentic Indian Flavour</h3>
            {/* SVG here */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="#ec3136" width="40%" height="90" viewBox="0 0 50 40" stroke="#ec3136" strokeWidth="1" preserveAspectRatio="none" style={{height: '10px'}}>
              <polygon points="0,0 0,50 50,50"></polygon>
            </svg>
            <p>The administrative office and production unit of <strong>Teer Brand</strong> is located in our hometown, where we operate a clean and well-organized spice grinding facility. Our setup includes sturdy, motor-based machines that help us maintain consistency and hygiene in every batch. While we currently cater to local market needs, our focus remains on delivering spices that are pure, flavorful, and trustworthy.</p>
          </div>
          <div className="infrastructure-image">
            <img src="/images/Teer_Brand_Manufacturing_Unit.png" alt="Teer Brand Manufacturing Plant" />
          </div>
        </div>
      </section>

    </div>
  );
};

export default WhoWeAre;