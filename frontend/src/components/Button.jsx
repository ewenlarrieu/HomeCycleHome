import '../styles/Button.css'

function Button({ label, type = 'button', form, onClick }) {
  return (
    <button type={type} className="btn" form={form} onClick={onClick}>{label}</button>
  )
}

export default Button
