import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

const TARGET = new Date(2026, 6, 9, 20, 0, 0) // 9 julio 2026, 20:00

function useCountdown(targetDate) {
  const [diff, setDiff] = useState({ days: 0, hours: 0, mins: 0, secs: 0, isPast: false })
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const ms = targetDate - now
      if (ms <= 0) {
        setDiff({ days: 0, hours: 0, mins: 0, secs: 0, isPast: true })
        return
      }
      const days = Math.floor(ms / (1000 * 60 * 60 * 24))
      const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
      const secs = Math.floor((ms % (1000 * 60)) / 1000)
      setDiff({ days, hours, mins, secs, isPast: false })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return diff
}

function Countdown() {
  const { days, hours, mins, secs, isPast } = useCountdown(TARGET)
  if (isPast) {
    return (
      <p className="font-body text-sm text-[var(--ink-soft)] text-center">
        La fiesta fue el 9 de julio
      </p>
    )
  }
  return (
    <div className="text-center py-8">
      <p className="font-body text-xs tracking-[0.15em] uppercase text-[var(--ink-soft)] mb-4">
        Quedan
      </p>
      <div className="flex justify-center gap-6 sm:gap-8">
        {[
          { v: days, l: 'días' },
          { v: hours, l: 'h' },
          { v: mins, l: 'min' },
          { v: secs, l: 's' },
        ].map(({ v, l }) => (
          <div key={l} className="flex flex-col items-center min-w-[3rem]">
            <span className="font-heading text-2xl sm:text-3xl font-semibold tabular-nums text-[var(--navy)]">
              {String(v).padStart(2, '0')}
            </span>
            <span className="font-body text-[10px] sm:text-xs text-[var(--ink-soft)] mt-0.5 tracking-wide">
              {l}
            </span>
          </div>
        ))}
      </div>
      <p className="font-body text-xs text-[var(--ink-soft)] mt-4 tracking-wide">
        9 de julio · 20:00
      </p>
    </div>
  )
}

const BUCKET = 'photos-blanca'
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'

function PhotosUpload() {
  const [uploaded, setUploaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [nombre, setNombre] = useState('')
  const [file, setFile] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Selecciona una foto.')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('La foto no puede superar 5 MB.')
      return
    }
    setLoading(true)
    setError(null)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`
    const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (uploadErr) {
      setLoading(false)
      setError(uploadErr.message || 'No se pudo subir la foto.')
      return
    }
    await supabase.from('photos').insert({ storage_path: path, nombre: nombre.trim() || null })
    setLoading(false)
    setUploaded(true)
    setFile(null)
    setNombre('')
  }

  return (
    <div>
      <h2 className="font-heading text-xl sm:text-2xl font-semibold text-[var(--navy)] mb-1">
        Comparte una foto con Blanca
      </h2>
      <p className="font-body text-sm text-[var(--ink-soft)] mb-6">
        Sube una foto que tengas con ella para tener un álbum especial
      </p>
      {uploaded ? (
        <div className="text-center py-10 px-6 bg-[var(--paper)] rounded-sm border border-[var(--border)]">
          <p className="text-2xl text-[var(--sage)] mb-3">✓</p>
          <p className="font-heading text-xl font-semibold text-[var(--ink)] mb-2">
            ¡Gracias!
          </p>
          <p className="font-body text-sm text-[var(--ink-soft)] leading-relaxed">
            La foto se ha subido correctamente. Puedes subir otra si quieres.
          </p>
          <button
            type="button"
            onClick={() => setUploaded(false)}
            className="font-body text-sm text-[var(--navy)] font-medium mt-4 hover:underline"
          >
            Subir otra foto
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="font-body text-sm text-red-600 bg-red-50 py-2 px-3 rounded-sm border border-red-100">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="photo-nombre" className="block font-body text-sm text-[var(--ink)] mb-1">
              ¿Quién envía la foto? (opcional)
            </label>
            <input
              type="text"
              id="photo-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="w-full px-4 py-3 rounded-sm border border-[var(--border)] bg-[var(--paper)] font-body text-[var(--ink)] placeholder:text-[var(--ink-soft)]/70 focus:outline-none focus:ring-1 focus:ring-[var(--sage)] focus:border-[var(--sage)] transition"
            />
          </div>
          <div>
            <label htmlFor="photo-file" className="block font-body text-sm text-[var(--ink)] mb-1">
              Foto *
            </label>
            <input
              type="file"
              id="photo-file"
              accept={ACCEPT}
              required
              onChange={(e) => {
                setFile(e.target.files?.[0] || null)
                setError(null)
              }}
              className="w-full px-4 py-3 rounded-sm border border-[var(--border)] bg-[var(--paper)] font-body text-[var(--ink)] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-[var(--navy)] file:text-white file:cursor-pointer hover:file:bg-[var(--navy)]/90 focus:outline-none focus:ring-1 focus:ring-[var(--sage)] focus:border-[var(--sage)] transition"
            />
            <p className="font-body text-xs text-[var(--ink-soft)] mt-1">
              JPG, PNG, WebP o GIF. Máximo 5 MB.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-sm font-heading text-lg font-semibold text-white bg-[var(--navy)] hover:bg-[var(--navy)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--sage)] focus:ring-offset-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Subiendo…' : 'Subir foto'}
          </button>
        </form>
      )}
    </div>
  )
}

function App() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
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
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: err } = await supabase.from('rsvps').insert({
      nombre: formData.nombre,
      asiste: formData.asiste,
      personas: formData.personas,
      contacto: formData.contacto,
      mensaje: formData.mensaje || null,
    })
    setLoading(false)
    if (err) {
      setError(err.message || 'No se pudo enviar. Inténtalo de nuevo.')
      return
    }
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen paper-texture py-6 sm:py-10 px-4 sm:px-6">
      <article className="w-full max-w-6xl mx-auto bg-[var(--paper-card)] rounded-sm frame-watercolor overflow-hidden">
        {/* Hero: ilustración + texto a ancho completo */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 px-6 sm:px-10 lg:px-14 pt-8 sm:pt-10 pb-6">
          {/* Ilustración — ocupa menos en desktop para dar espacio al texto */}
          <div className="lg:col-span-2 flex justify-center lg:justify-start items-start">
            <figure className="w-[60%] sm:w-[45%] lg:w-full max-w-[240px] lg:max-w-none aspect-[3/4] rounded-sm overflow-hidden bg-[var(--paper)] shrink-0">
              <img
                src="/blanca-invite.png"
                alt="Blanca"
                className="w-full h-full object-cover object-top"
              />
            </figure>
          </div>
          {/* Texto + countdown */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <p className="font-heading text-sm tracking-[0.2em] uppercase text-[var(--navy)] mb-3">
              Estás invitado a los
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--ink)] leading-tight">
              60 años de Blanca
            </h1>
            <p className="font-heading text-base sm:text-lg text-[var(--coral)] mt-2 italic">
              Fiesta sorpresa
            </p>
            <div className="deco-line my-6 mx-0 lg:mx-0 w-24 rounded-full" />
            <div className="text-left space-y-4 text-[var(--ink)]">
              <p className="font-body text-sm sm:text-base lg:text-lg leading-relaxed">
                El <strong className="font-semibold text-[var(--navy)]">jueves 9 de julio</strong> Blanca cumple 60 años, y nos gustaría que nos acompañases en una pequeña fiesta sorpresa.
              </p>
              <p className="font-body text-sm sm:text-base lg:text-lg leading-relaxed">
                Será el mismo 9 de julio sobre las 8 de la tarde. El sitio está por confirmar. En cuanto sepamos el número de personas, os lo diremos.
              </p>
              <p className="font-body text-sm sm:text-base leading-relaxed">
                Por favor, confirma tu asistencia y comparte una foto si quieres.
              </p>
              <p className="font-body text-sm font-semibold text-[var(--ink)]">
                ¡Muchas gracias!
              </p>
              <p className="font-body text-sm text-[var(--ink-soft)]">
                Marta y Javier
              </p>
            </div>
            <Countdown />
          </div>
        </div>

        {/* RSVP y Fotos: dos columnas en desktop, apiladas en móvil */}
        <div className="border-t border-[var(--border)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)]">
            {/* RSVP */}
            <div className="px-6 sm:px-10 lg:px-14 py-8 sm:py-10">
              <h2 className="font-heading text-xl sm:text-2xl font-semibold text-[var(--navy)] mb-1">
                Confirma tu asistencia
              </h2>
              <p className="font-body text-sm text-[var(--ink-soft)] mb-6">
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
              {error && (
                <p className="font-body text-sm text-red-600 bg-red-50 py-2 px-3 rounded-sm border border-red-100">
                  {error}
                </p>
              )}
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
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="contacto"
                  name="contacto"
                  required
                  value={formData.contacto}
                  onChange={handleChange}
                  placeholder="Tu número de teléfono"
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
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-sm font-heading text-lg font-semibold text-white bg-[var(--navy)] hover:bg-[var(--navy)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--sage)] focus:ring-offset-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando…' : 'Enviar respuesta'}
              </button>
            </form>
          )}
            </div>

            {/* Subir fotos — misma altura que RSVP en desktop */}
            <div className="px-6 sm:px-10 lg:px-14 py-8 sm:py-10">
              <PhotosUpload />
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

export default App
