import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Analytics } from '@vercel/analytics/react';
import { keigoData } from '../data/keigoData';
import Link from "next/link";

//I used gemini for learning the fundementals of react and debugging

export default function Home() { // Capitalized for React conventions
    const [type, setType] = useState('email');
    const [level, setLevel] = useState('low');
    const [userContent, setUserContent] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false)
    const [showAll, setShowAll] = useState(false);
    const INITIAL_COUNT = 4;
    const keys = Object.keys(keigoData);
    const visibleKeys = showAll ? keys : keys.slice(0, INITIAL_COUNT);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult('');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, level, userContent, isChecked }),
            });

            const data = await response.json();

            if (data.result) {
                setResult(data.result);
            } else {
                setResult("Error");
            }
        } catch (error) {
            if (response.status == 504 || response.status === 500) {
                setResult("The server is busy right now, please try again later.")
            }else{
                setResult("Error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Keigo-its | AI Japanese Assistant</title>
            </Head>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.header}>
                    <button type='button' onClick={() => { setType('email'); setUserContent(''); setResult(''); setIsChecked(false);}} className={`${styles.emailBtn} ${type === 'email' ? styles.active : ''}`}>email</button>
                    <button type='button' onClick={() => { setType('call'); setUserContent(''); setResult(''); setIsChecked(false);}} className={`${styles.callBtn} ${type === 'call' ? styles.active : ''}`}>call</button>
                </div>

                {type === 'email' && (
                    <>
                        <label>What do you want to say? / 何を言いたいですか？</label>
                        <label className= {styles.checkbox_container}><input type = "checkbox" checked = {isChecked} onChange = {(e) => setIsChecked(e.target.checked? true : false)}/>Enable Romaji</label>
                        <textarea 
                            required 
                            value={userContent} 
                            onChange={(e) => setUserContent(e.target.value)} 
                            placeholder='e.g. 休みが欲しいです (I want a day off)'
                        ></textarea>
                    </>
                )}

                {type === 'call' && (
                    <>
                        <label>Where/What do you want to call? / どこにどのような理由で電話しますか？</label>
                        <label className= {styles.checkbox_container}><input type = "checkbox" checked = {isChecked} onChange = {(e) => setIsChecked(e.target.checked? true : false)}/>Enable Romaji</label>
                        <textarea 
                            required 
                            value={userContent} 
                            onChange={(e) => setUserContent(e.target.value)} 
                            placeholder='e.g. レストランの予約を取りたい (I want get a reservation for a restaurant)'
                        ></textarea>
                    </>
                )}

                <button type='submit' disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Thinking...' : 'Generate Keigo'}
                </button>

                {result && (
                    <div className={styles.resultContainer}>
                        <h2>AI Result: </h2>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{result}</p>
                    </div>
                )}

                <div className={styles.scale}>
                    <h2>Respect Scale: </h2>
                    <div className={styles.levelsBtn}>
                        <button type='button' onClick={() => setLevel('casual')} className={level === 'casual' ? styles.activeLevelBtn : ''}>casual</button>
                        <button type='button' onClick={() => setLevel('low')}    className={level === 'low'    ? styles.activeLevelBtn : ''}>low</button>
                        <button type='button' onClick={() => setLevel('medium')} className={level === 'medium' ? styles.activeLevelBtn : ''}>medium</button>
                        <button type='button' onClick={() => setLevel('high')}   className={level === 'high'   ? styles.activeLevelBtn : ''}>high</button>
                    </div>
                </div>
            </form>

            <div className={styles.guideContainer}>
                <h3 className={styles.guideTitle}>Level Guide / レベルガイド</h3>

                <div className={`${styles.levelCard} ${styles.casualCard}`}>
                    <h4>Casual <span className={styles.jpText}>(ため口)</span></h4>
                    <p className={styles.enText}>Friends and family. Informal and relaxed.</p>
                    <p className={styles.jpText}>友達や家族、年下の人との日常会話に。</p>
                </div>

                <div className={`${styles.levelCard} ${styles.lowCard}`}>
                    <h4>Low <span className={styles.jpText}>(丁寧語)</span></h4>
                    <p className={styles.enText}>Standard politeness (Desu/Masu) for strangers or public use.</p>
                    <p className={styles.jpText}>標準的な丁寧語。知らない人や外出先でのやり取りに。</p>
                </div>

                <div className={`${styles.levelCard} ${styles.mediumCard}`}>
                    <h4>Medium <span className={styles.jpText}>(ビジネス敬語)</span></h4>
                    <p className={styles.enText}>Professional business Japanese for bosses and clients.</p>
                    <p className={styles.jpText}>一般的なビジネス敬語。上司や取引先、目上の人に。</p>
                </div>

                <div className={`${styles.levelCard} ${styles.highCard}`}>
                    <h4>High <span className={styles.jpText}>(最高敬語)</span> <span className={styles.warningLabel}>Rare</span></h4>
                    <p className={styles.enText}><strong>Extreme cases only.</strong> Reserved for the Emperor or Royalty.</p>
                    <p className={styles.jpText}>極めて特殊な表現。天皇陛下や皇族に対してのみ使用されます。</p>
                </div>
            </div>

            <section className="keigo-guides-container">
                <h2 className={styles.guidesTitle}>Popular Keigo Guides</h2>
                <div className={styles.guidesContainer}>
                    {visibleKeys.map((key) => (
                    <Link key={key} href={`/phrase/${key}`} className={styles.guideCard}>
                        <div className={styles.guideCardContent}>
                        <span className={styles.guideTag}>{keigoData[key].type}</span>
                        <h3 className={styles.guideText}>
                            {keigoData[key].title
                            .replace("How to say ", "")
                            .replace(" in Keigo", "")}
                        </h3>
                        <span className={styles.guideArrow}>→</span>
                        </div>
                    </Link>
                    ))}
                </div>

                {keys.length > INITIAL_COUNT && (
                    <button
                    className={styles.seeMoreBtn}
                    onClick={() => setShowAll((prev) => !prev)}
                    >
                    {showAll ? "Show less ↑" : `See all ${keys.length} guides ↓`}
                    </button>
                )}
            </section>

            <Analytics />
        </div>
    );
}