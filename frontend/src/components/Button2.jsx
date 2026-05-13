import '../styles/Button.css'

function Button2({ label, onClick }) {
  return (
    <button type="button" className="btn2" onClick={onClick}>{label}</button>
  )
}

export default Button2
