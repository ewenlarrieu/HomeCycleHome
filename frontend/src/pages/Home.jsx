import '../styles/Home.css'
import Button from '../components/Button'
import HeroImage from '../assets/images/Heroimage.png'
import CalendarIcon from '../assets/images/calendar.png'
import PointIcon from '../assets/images/point.png'
import SettingIcon from '../assets/images/setting.png'
import HomeIcon from '../assets/images/home.png'
import ProfileIcon from '../assets/images/profile.png'
import SpeedIcon from '../assets/images/speed.png'
import LockIcon from '../assets/images/lock.png'
import Button2 from '../components/Button2'

export default function Home() {
  return (
    <main>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 id="hero-title" className="hero-title">Réparez votre vélo sans vous déplacer</h1>
              <p className="hero-desc">Prenez rendez-vous avec un technicien à domicile, choisissez votre forfait d'entretien et suivez facilement vos interventions depuis votre espace client.</p>
              <Button label="Commencer" />
            </div>
            <img src={HeroImage} alt="Technicien réparant un vélo à domicile" className="hero-image" />
          </div>
        </div>
      </section>

      <section id="comment-ca-marche" className="how-it-works" aria-labelledby="how-it-works-title">
        <h2 id="how-it-works-title" className="section-title">Comment ça marche ?</h2>
        <div className="how-it-works-cards">
          <div className="how-it-works-card">
            <img src={CalendarIcon} alt="Icône calendrier" className="how-it-works-icon" />
            <h3 className="card-title">Choisissez votre intervention</h3>
            <p className="card-desc">Sélectionnez votre type de vélo, indiquez votre adresse et choisissez le forfait d'entretien ou de réparation adapté à vos besoins.</p>
          </div>
          <div className="how-it-works-card">
            <img src={PointIcon} alt="Icône localisation" className="how-it-works-icon" />
            <h3 className="card-title">Réservez un créneau</h3>
            <p className="card-desc">L'application vous propose les disponibilités selon votre zone géographique et la durée estimée de l'intervention.</p>
          </div>
          <div className="how-it-works-card">
            <img src={SettingIcon} alt="Icône paramètres" className="how-it-works-icon" />
            <h3 className="card-title">Un technicien intervient</h3>
            <p className="card-desc">Un technicien qualifié se déplace à domicile, réalise l'intervention, ajoute les photos du travail effectué et finalise le paiement.</p>
          </div>
        </div>
      </section>

      <section className="advantages" aria-labelledby="advantages-title">
        <h2 id="advantages-title" className="section-title">Les avantages</h2>
        <div className="advantages-grid">
          <div className="advantages-card">
            <img src={HomeIcon} alt="Icône domicile" className="advantages-icon" />
            <h3 className="card-title">Intervention à domicile</h3>
            <p className="card-desc">Plus besoin de vous déplacer, nos techniciens interviennent directement chez vous.</p>
          </div>
          <div className="advantages-card">
            <img src={ProfileIcon} alt="Icône profil" className="advantages-icon" />
            <h3 className="card-title">Techniciens qualifiés</h3>
            <p className="card-desc">Des experts formés assurent un entretien et des réparations de qualité.</p>
          </div>
          <div className="advantages-card">
            <img src={SpeedIcon} alt="Icône rapidité" className="advantages-icon" />
            <h3 className="card-title">Service rapide</h3>
            <p className="card-desc">Des créneaux adaptés à votre emploi du temps pour une intervention efficace.</p>
          </div>
          <div className="advantages-card">
            <img src={LockIcon} alt="Icône sécurité" className="advantages-icon" />
            <h3 className="card-title">Paiement sécurisé</h3>
            <p className="card-desc">Réglez vos interventions en toute sécurité directement depuis l'application.</p>
          </div>
        </div>
      </section>

      <section className="cta" aria-labelledby="cta-title">
        <h2 id="cta-title" className="section-title">Besoin d'une réparation pour votre vélo ?</h2>
        <p className="cta-desc">Prenez rendez-vous en quelques clics et profitez d'une intervention à domicile rapide et fiable.</p>
        <Button label="Prendre rendez-vous" />
      </section>

      <section className="contact" aria-labelledby="contact-title">
        <Button2 label="Contactez nous" />
        <p className="contact-desc">Une question sur nos interventions ou nos services ? Envoyez-nous un message, notre équipe vous répond rapidement.</p>
      </section>
    </main>
  )
}
