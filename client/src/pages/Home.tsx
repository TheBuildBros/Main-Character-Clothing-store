import { ArrowRight, ArrowUpRight, MapPin, MoveUpRight } from "lucide-react";
import { Link } from "wouter";
import { ProductRail } from "@/store/Storefront";

const edits = [
  { title: "The blue edit", text: "A little electricity for the everyday.", label: "01 / COLOR STORY", image: "/manus-storage/async-images/jejcmacjEjsVpNlSiawNE2/image-2.webp", filter: "color=electric" },
  { title: "Off-duty, on point", text: "Good layers. Better instincts.", label: "02 / AFTER HOURS", image: "/manus-storage/async-images/jejcmacjEjsVpNlSiawNE2/image-4.webp", filter: "category=Outerwear" },
  { title: "Everyday characters", text: "The pieces that become yours.", label: "03 / THE ESSENTIALS", image: "/manus-storage/async-images/jejcmacjEjsVpNlSiawNE2/image-3.webp", filter: "category=T-shirts" },
];
export default function Home() {
  return <>
    <section className="hero" aria-label="Main Character"><div className="hero-image" /><h1>MAIN<br className="hero-mobile-break" /> CHARACTER<span>.</span></h1></section>
    <ProductRail items={undefined} />
    <section className="flagship-section" id="flagship"><div className="flagship-image" role="img" aria-label="Sunlit minimal fashion studio interior" /><div className="flagship-copy"><span className="eyebrow">COME THROUGH · BENGALURU</span><p className="flagship-kicker">A place to meet your next favourite.</p><h2>More than a<br />changing room.</h2><p className="flagship-description">A considered space for good clothes, good conversations and trying something on just because.</p><div className="store-meta"><span><MapPin size={16} /> Bengaluru, India</span><span><span className="open-dot" /> Opening soon · By appointment</span></div><a className="text-link" href="https://maps.google.com/?q=Bengaluru" target="_blank" rel="noreferrer">Find our flagship <ArrowUpRight size={16} /></a></div><span className="flagship-index">MC / 001</span></section>
    <section className="section-shell collection-section"><div className="section-heading"><div><span className="eyebrow">A WORLD OF YOUR OWN</span><h2>Find your edit.</h2></div><Link href="/collections" className="text-link">All collections <ArrowRight size={16} /></Link></div><div className="edit-grid">{edits.map((edit, index) => <Link href={`/collections?${edit.filter}`} className={`edit-card edit-card-${index + 1}`} key={edit.title}><div className="edit-image" style={{ backgroundImage: `url('${edit.image}')` }} /><div className="edit-content"><span className="eyebrow">{edit.label}</span><h3>{edit.title}</h3><p>{edit.text}</p><span className="edit-arrow"><MoveUpRight size={19} /></span></div></Link>)}</div></section>
    <section className="closing-note"><span className="eyebrow">A NOTE TO SELF</span><p>Not dressed for the part.<br /><em>Dressed as the point.</em></p><Link href="/collections" className="text-link">Meet the collection <ArrowRight size={16} /></Link></section>
  </>;
}
