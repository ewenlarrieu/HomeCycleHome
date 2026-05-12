import '../styles/Button.css'

function Button({ label, type = 'button', form }) {
  return (
    <button type={type} className="btn" form={form}>{label}</button>
  )
}

export default Button
