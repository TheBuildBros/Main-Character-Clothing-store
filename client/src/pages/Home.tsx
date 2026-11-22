import { ArrowRight, ArrowUpRight, MapPin, MoveUpRight } from "lucide-react";
import { Link } from "wouter";
import { ProductRail } from "@/store/Storefront";
import AnimatedContent from "@/components/AnimatedContent";
import BlurText from "@/components/BlurText";
import "@google/model-viewer";

const ModelViewer = "model-viewer" as any;

const edits = [
  { title: "The blue edit", text: "A little electricity for the everyday.", label: "01 / COLOR STORY", image: "/images/main-character-2.webp", filter: "color=electric" },
  { title: "Off-duty, on point", text: "Good layers. Better instincts.", label: "02 / AFTER HOURS", image: "/images/main-character-4.webp", filter: "category=Outerwear" },
  { title: "Everyday characters", text: "The pieces that become yours.", label: "03 / THE ESSENTIALS", image: "/images/main-character-3.webp", filter: "category=T-shirts" },
];
export default function Home() {
  return <>
    <section className="hero" aria-label="主人公"><div className="hero-image" /><ModelViewer className="hero-logo-3d" src="/models/maincharacter_coin_final.glb" alt="主人公の回転する3Dロゴ" auto-rotate rotation-per-second="4deg" interaction-prompt="none" disable-zoom camera-orbit="0deg 75deg 105%" shadow-intensity="0.65" exposure="1" aria-hidden="true" /><h1 lang="ja" className="hero-wordmark">主人公<span>。</span></h1></section>
    <ProductRail items={undefined} />
    <section className="flagship-section" id="flagship"><div className="flagship-image" role="img" aria-label="Sunlit minimal fashion studio interior" /><div className="flagship-copy"><span className="eyebrow">COME THROUGH · BENGALURU</span><p className="flagship-kicker">A place to meet your next favourite.</p><h2>More than a<br />changing room.</h2><p className="flagship-description">A considered space for good clothes, good conversations and trying something on just because.</p><div className="store-meta"><span><MapPin size={16} /> Bengaluru, India</span><span><span className="open-dot" /> Opening soon · By appointment</span></div><a className="text-link" href="https://maps.google.com/?q=Bengaluru" target="_blank" rel="noreferrer">Find our flagship <ArrowUpRight size={16} /></a></div><span className="flagship-index">MC / 001</span></section>
    <section className="section-shell collection-section"><div className="section-heading"><div><span className="eyebrow">A WORLD OF YOUR OWN</span><h2 className="collection-heading"><BlurText text="Find your edit." delay={65} stepDuration={0.28} blur={5} distance={16} trigger="view" /></h2></div><Link href="/collections" className="text-link">All collections <ArrowRight size={16} /></Link></div><AnimatedContent className="edit-grid-reveal" distance={34} duration={0.7} stagger={0.12} threshold={0.12}><div className="edit-grid">{edits.map((edit, index) => <Link href={`/collections?${edit.filter}`} className={`edit-card edit-card-${index + 1}`} key={edit.title}><div className="edit-image" style={{ backgroundImage: `url('${edit.image}')` }} /><div className="edit-content"><span className="eyebrow">{edit.label}</span><h3>{edit.title}</h3><p>{edit.text}</p><span className="edit-arrow"><MoveUpRight size={19} /></span></div></Link>)}</div></AnimatedContent></section>
    <section className="closing-note"><span className="eyebrow">A NOTE TO SELF</span><p>Not dressed for the part.<br /><em>Dressed as the point.</em></p><Link href="/collections" className="text-link">Meet the collection <ArrowRight size={16} /></Link></section>
  </>;
}
