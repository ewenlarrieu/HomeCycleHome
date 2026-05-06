import '../styles/Home.css'
import Button from '../components/Button'
import HeroImage from '../assets/images/Heroimage.png'
import CalendarIcon from '../assets/images/calendar.png'
import PointIcon from '../assets/images/point.png'
import SettingIcon from '../assets/images/setting.png'

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

      <section className="how-it-works" aria-labelledby="how-it-works-title">
        <h2 id="how-it-works-title" className="how-it-works-title">Comment ça marche ?</h2>
        <div className="how-it-works-cards">
          <div className="how-it-works-card">
            <img src={CalendarIcon} alt="Icône calendrier" className="how-it-works-icon" />
            <h3 className="how-it-works-card-title">Choisissez votre intervention</h3>
            <p className="how-it-works-card-desc">Sélectionnez votre type de vélo, indiquez votre adresse et choisissez le forfait d'entretien ou de réparation adapté à vos besoins.</p>
          </div>
          <div className="how-it-works-card">
            <img src={PointIcon} alt="Icône localisation" className="how-it-works-icon" />
            <h3 className="how-it-works-card-title">Réservez un créneau</h3>
            <p className="how-it-works-card-desc">L'application vous propose les disponibilités selon votre zone géographique et la durée estimée de l'intervention.</p>
          </div>
          <div className="how-it-works-card">
            <img src={SettingIcon} alt="Icône paramètres" className="how-it-works-icon" />
            <h3 className="how-it-works-card-title">Un technicien intervient</h3>
            <p className="how-it-works-card-desc">Un technicien qualifié se déplace à domicile, réalise l'intervention, ajoute les photos du travail effectué et finalise le paiement.</p>
          </div>
        </div>
      </section>
    </main>
  )
}