import '../styles/Home.css'
import Button from '../components/Button'
import HeroImage from '../assets/images/Heroimage.png'

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Réparez votre vélo sans vous déplacer</h1>
              <p className="hero-desc">Prenez rendez-vous avec un technicien à domicile, choisissez votre forfait d'entretien et suivez facilement vos interventions depuis votre espace client.</p>
              <Button label="Commencer" />
            </div>
            <img src={HeroImage} alt="Technicien vélo" className="hero-image" />
          </div>
        </div>
      </section>
    </main>
  )
}