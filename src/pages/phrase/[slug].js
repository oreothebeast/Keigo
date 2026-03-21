import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import { keigoData } from "../data/keigoData"; // adjust path as needed

export default function PhraseDetail() {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug) return <div className={styles.page} />;

  const data = keigoData[slug];

  if (!data) {
    return (
      <div className={styles.notFound}>
        <h1>Phrase not found!</h1>
        <p>We haven't added this specific guide yet.</p>
        <Link href="/">Go back to the translator →</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>

        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>›</span>
          Phrase Guide
        </nav>
        <article>
          <h1 className={styles.title}>{data.title}</h1>

          {/* Phrase Card */}
          <div className={styles.phraseCard}>
            <div className={styles.cardHeader}>
              <span className={styles.typeBadge}>{data.type}</span>
              <button
                className={styles.copyBtn}
                onClick={() => navigator.clipboard.writeText(data.japanese)}
              >
                Copy Phrase
              </button>
            </div>
            <p className={styles.japanese}>{data.japanese}</p>
            <p className={styles.english}>"{data.english}"</p>
          </div>

          {/* Context Section */}
          <div className={styles.contextSection}>
            <h2 className={styles.sectionTitle}>Usage & Context</h2>
            <p className={styles.contextText}>{data.context}</p>
          </div>

          {/* CTA */}
          <div className={styles.cta}>
            <h2 className={styles.ctaTitle}>Translating something else?</h2>
            <p className={styles.ctaSubtitle}>
              Our AI-powered translator handles complex Keigo for any situation.
            </p>
            <Link href="/" className={styles.ctaBtn}>
              Open Keigo-its Translator
            </Link>
          </div>
        </article>

        <footer className={styles.footer}>
          <p>© 2026 Keigo-its | Built for PEARL and International Students in Japan</p>
        </footer>

      </main>
    </div>
  );
}