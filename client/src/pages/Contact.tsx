import { useState, type FormEvent } from "react";
import { ArrowRight, ArrowUpRight, CheckCircle2, Mail, MapPin, Clock } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/MotionPrimitives";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Appointment");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="catalog-page max-w-6xl mx-auto">
      <div className="breadcrumbs">
        <Link href="/" className="hover:text-[var(--blue)] transition-colors">
          HOME
        </Link>{" "}
        <span>/</span> CONTACT
      </div>

      <ScrollReveal>
        <div className="mb-10 sm:mb-14">
          <span className="glass-pill px-4 py-1.5 rounded-full eyebrow">
            主人公 STUDIO · BENGALURU
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight mt-4 mb-3">
            Come through<span className="blue-period">.</span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)] max-w-xl leading-relaxed">
            Questions about sizing, orders, or booking a private fitting at our Bengaluru
            studio.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Studio Details */}
        <ScrollReveal className="lg:col-span-5">
          <div className="rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-[#002b99] via-[#0057ff] to-[#0094ff] text-white shadow-[0_24px_64px_rgba(0,87,255,0.22)] border border-white/20 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 font-display text-[10px] font-bold tracking-[0.18em] uppercase text-white mb-4">
                MC / 001 FLAGSHIP
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Bengaluru Studio
              </h2>
              <p className="text-xs sm:text-sm text-white/85 mt-2 leading-relaxed">
                A calm space to try silhouettes in person, explore archival drops, and
                talk fabric.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-white/90 pt-2 border-t border-white/20">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#7fd4ff] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-display text-white">Location</strong>
                  <span>Indiranagar, Bengaluru, India</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-[#7fd4ff] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-display text-white">Hours</strong>
                  <span>Opening soon · By appointment</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-[#7fd4ff] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-display text-white">Direct</strong>
                  <a
                    href="mailto:hello@maincharacter.example"
                    className="underline underline-offset-4 hover:text-white"
                  >
                    hello@maincharacter.example
                  </a>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Bengaluru"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#0047ff] hover:bg-[#eef5ff] font-display text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:-translate-y-0.5"
            >
              <span>Open in Maps</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </ScrollReveal>

        {/* Inquiry Form */}
        <ScrollReveal delay={0.08} className="lg:col-span-7">
          <div className="glass-card p-6 sm:p-9">
            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#0047ff] to-[#00aeff] text-white flex items-center justify-center shadow-lg">
                  <CheckCircle2 size={26} />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold">
                  Message received.
                </h2>
                <p className="text-sm text-[var(--muted)] max-w-md mx-auto">
                  Thanks, {name.trim()}. Our studio team will reply to {email.trim()}{" "}
                  shortly.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    className="button-primary"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                  >
                    Send another note
                  </button>
                  <Link href="/collections" className="text-link px-4">
                    Browse collection <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                <div>
                  <span className="eyebrow">DROP A LINE</span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1">
                    Get in touch
                  </h2>
                </div>

                {error && (
                  <p className="form-alert error" role="alert">
                    {error}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-field">
                    <label htmlFor="contact-name" className="field-label">
                      Your name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Aarav"
                      className="field-input"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-email" className="field-label">
                      Email address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="field-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-topic" className="field-label">
                    Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="field-input"
                  >
                    <option value="Appointment">Bengaluru studio appointment</option>
                    <option value="Sizing">Fit &amp; sizing guidance</option>
                    <option value="Order">Order &amp; shipping support</option>
                    <option value="Press">Press &amp; collaborations</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message" className="field-label">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what piece or fit you are looking for..."
                    className="field-input py-3 h-auto min-h-[116px] resize-y"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  className="button-primary auth-submit"
                >
                  <span>Send message</span>
                  <ArrowRight size={16} />
                </motion.button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
