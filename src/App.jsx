import { useState } from 'react'

function App() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    asiste: '',
    personas: '1',
    contacto: '',
    mensaje: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('RSVP:', formData)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen paper-texture py-8 sm:py-12 px-4 flex justify-center items-start">
      {/* Una sola tarjeta-invitación */}
      <article className="w-full max-w-lg bg-[var(--paper-card)] rounded-sm frame-watercolor overflow-hidden">
        {/* Ilustración acuarela */}
        <div className="relative pt-8 px-6 sm:px-10 flex justify-center">
          <figure className="w-[72%] max-w-[280px] aspect-[3/4] rounded-sm overflow-hidden bg-[var(--paper)]">
            <img
              src="/blanca-invite.png"
              alt="Blanca"
              className="w-full h-full object-cover object-top"
            />
          </figure>
        </div>

        {/* Texto de la invitación */}
        <div className="px-8 sm:px-12 pt-8 pb-6 text-center">
          <p className="font-heading text-sm tracking-[0.2em] uppercase text-[var(--navy)] mb-4">
            Estás invitado a los
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-[var(--ink)] leading-tight">
            60 años de Blanca
          </h1>
          <p className="font-heading text-lg text-[var(--coral)] mt-2 italic">
            Fiesta sorpresa
          </p>

          <div className="deco-line my-8 mx-auto w-24 rounded-full" />

          <div className="text-left space-y-5 text-[var(--ink)]">
            <p className="font-body text-base sm:text-lg leading-relaxed">
              El <strong className="font-semibold text-[var(--navy)]">jueves 9 de julio</strong> Blanca cumple 60 años, y nos gustaría que nos acompañases en una pequeña fiesta sorpresa.
            </p>
            <p className="font-body text-base sm:text-lg leading-relaxed">
              Será el mismo 9 de julio sobre las 8 de la tarde. El sitio está por confirmar. En cuanto sepamos el número de personas, os lo diremos.
            </p>
            <p className="font-body text-base sm:text-lg leading-relaxed">
              Por favor, confirma tu asistencia en el formulario que encontrarás abajo.
            </p>
            <p className="font-body text-base font-semibold text-[var(--ink)] pt-2">
              ¡Muchas gracias!
            </p>
            <p className="font-body text-sm text-[var(--ink-soft)]">
              Marta y Javier
            </p>
          </div>
        </div>

        {/* Línea suave antes del formulario */}
        <div className="px-8 sm:px-12">
          <div className="h-px bg-[var(--border)]" />
        </div>

        {/* RSVP */}
        <div className="px-8 sm:px-12 py-8 sm:py-10">
          <h2 className="font-heading text-2xl font-semibold text-[var(--navy)] text-center mb-1">
            Confirma tu asistencia
          </h2>
          <p className="font-body text-sm text-[var(--ink-soft)] text-center mb-8">
            Rellena el formulario para que sepamos si nos acompañas
          </p>

          {submitted ? (
            <div className="text-center py-10 px-6 bg-[var(--paper)] rounded-sm border border-[var(--border)]">
              <p className="text-2xl text-[var(--sage)] mb-3">✓</p>
              <p className="font-heading text-xl font-semibold text-[var(--ink)] mb-2">
                ¡Gracias!
              </p>
              <p className="font-body text-sm text-[var(--ink-soft)] leading-relaxed">
                Hemos recibido tu respuesta. Os diremos el lugar en cuanto lo tengamos confirmado.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="nombre" className="block font-body text-sm text-[var(--ink)] mb-1">
                  Nombre(s) *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre o los de tu grupo"
                  className="w-full px-4 py-3 rounded-sm border border-[var(--border)] bg-[var(--paper)] font-body text-[var(--ink)] placeholder:text-[var(--ink-soft)]/70 focus:outline-none focus:ring-1 focus:ring-[var(--sage)] focus:border-[var(--sage)] transition"
                />
              </div>

              <div>
                <span className="block font-body text-sm text-[var(--ink)] mb-2">
                  ¿Asistirás? *
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center justify-center py-3 px-4 rounded-sm border cursor-pointer transition font-body text-sm has-[:checked]:border-[var(--sage)] has-[:checked]:bg-[var(--sage)]/10 has-[:checked]:text-[var(--navy)] border-[var(--border)] hover:border-[var(--sage)]/60">
                    <input
                      type="radio"
                      name="asiste"
                      value="sí"
                      required
                      checked={formData.asiste === 'sí'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    Sí, estaré
                  </label>
                  <label className="flex items-center justify-center py-3 px-4 rounded-sm border cursor-pointer transition font-body text-sm has-[:checked]:border-[var(--ink-soft)] has-[:checked]:bg-[var(--ink)]/5 border-[var(--border)] hover:border-[var(--ink-soft)]/50">
                    <input
                      type="radio"
                      name="asiste"
                      value="no"
                      required
                      checked={formData.asiste === 'no'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    No podré
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="personas" className="block font-body text-sm text-[var(--ink)] mb-1">
                  Número de personas
                </label>
                <select
                  id="personas"
                  name="personas"
                  value={formData.personas}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-sm border border-[var(--border)] bg-[var(--paper)] font-body text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--sage)] focus:border-[var(--sage)] transition"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'persona' : 'personas'}
                    </option>
                  ))}
                  <option value="10+">Más de 10</option>
                </select>
              </div>

              <div>
                <label htmlFor="contacto" className="block font-body text-sm text-[var(--ink)] mb-1">
                  Email o teléfono *
                </label>
                <input
                  type="text"
                  id="contacto"
                  name="contacto"
                  required
                  value={formData.contacto}
                  onChange={handleChange}
                  placeholder="Para confirmaciones"
                  className="w-full px-4 py-3 rounded-sm border border-[var(--border)] bg-[var(--paper)] font-body text-[var(--ink)] placeholder:text-[var(--ink-soft)]/70 focus:outline-none focus:ring-1 focus:ring-[var(--sage)] focus:border-[var(--sage)] transition"
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block font-body text-sm text-[var(--ink)] mb-1">
                  Mensaje (opcional)
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={3}
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Algo que quieras decirnos..."
                  className="w-full px-4 py-3 rounded-sm border border-[var(--border)] bg-[var(--paper)] font-body text-[var(--ink)] placeholder:text-[var(--ink-soft)]/70 focus:outline-none focus:ring-1 focus:ring-[var(--sage)] focus:border-[var(--sage)] transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-sm font-heading text-lg font-semibold text-white bg-[var(--navy)] hover:bg-[var(--navy)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--sage)] focus:ring-offset-2 transition"
              >
                Enviar respuesta
              </button>
            </form>
          )}
        </div>
      </article>
    </div>
  )
}

export default App
