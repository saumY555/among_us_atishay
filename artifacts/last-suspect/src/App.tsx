import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';

type WireColor = 'coral' | 'sky' | 'purple';
const wires: { id: WireColor; name: string; color: string }[] = [
  { id: 'coral', name: 'Life support', color: '#FF454F' },
  { id: 'sky', name: 'Navigation', color: '#50DDF5' },
  { id: 'purple', name: 'Comms array', color: '#B69CFF' },
];

type CrewTone = 'coral' | 'sky' | 'yellow' | 'purple' | 'mint';
const crewTones: Record<CrewTone, { light: string; mid: string; dark: string; outline: string }> = {
  coral: { light: '#FF9298', mid: '#FF454F', dark: '#C7223B', outline: '#A91E34' },
  sky: { light: '#B4F5FF', mid: '#50DDF5', dark: '#168EAE', outline: '#176A89' },
  yellow: { light: '#FFF0A6', mid: '#FFD75E', dark: '#D99024', outline: '#A96B1D' },
  purple: { light: '#E2D5FF', mid: '#B69CFF', dark: '#7759D3', outline: '#5B49A6' },
  mint: { light: '#C3FFE0', mid: '#70E8B2', dark: '#27A976', outline: '#217B5C' },
};

function CrewArt({ className = '', tone = 'coral' }: { className?: string; tone?: CrewTone }) {
  const colors = crewTones[tone];
  const suitId = `suit-${tone}`;
  const visorId = `visor-${tone}`;
  const metalId = `metal-${tone}`;
  return (
    <svg className={`crew-art ${className}`} viewBox="0 0 220 300" role="img" aria-label={`Illustration of a ${tone} spaceship crewmate`}>
      <defs>
        <linearGradient id={suitId} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={colors.light} /><stop offset=".48" stopColor={colors.mid} /><stop offset="1" stopColor={colors.dark} /></linearGradient>
        <linearGradient id={visorId} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E8FCFF" /><stop offset=".35" stopColor="#50DDF5" /><stop offset="1" stopColor="#256A91" /></linearGradient>
        <linearGradient id={metalId} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#667092" /><stop offset="1" stopColor="#293451" /></linearGradient>
      </defs>
      <ellipse cx="110" cy="279" rx="65" ry="10" fill="#050813" opacity=".42" />
      <path d="M70 186h80l10 76q-1 12-13 12h-24l-8-51-8 51H84q-13 0-13-12z" fill={`url(#${suitId})`} stroke={colors.outline} strokeWidth="2" />
      <path d="M82 244h24l-2 17H81q-10 0-10-9v-5zM115 244h24l7 3v5q0 9-10 9h-20z" fill={`url(#${metalId})`} stroke="#202744" strokeWidth="2" />
      <path d="M69 105q0-45 41-49 44 3 44 50v67q-1 25-27 31H91q-22-5-22-29z" fill={`url(#${suitId})`} stroke={colors.outline} strokeWidth="2.5" />
      <path d="M62 118q-22 4-23 37l5 36q2 13 14 12l17-3-4-78zM157 118q22 4 24 37l-6 36q-2 13-14 12l-16-3 4-78z" fill={`url(#${suitId})`} stroke={colors.outline} strokeWidth="2.5" />
      <path d="M70 108q-2-51 40-58 43 5 42 57l-8 24H77z" fill={`url(#${suitId})`} stroke={colors.outline} strokeWidth="2.5" />
      <path d="M76 102q3-23 26-27l34 3q16 5 17 22l-4 24q-2 12-16 13H93q-16-1-18-14z" fill={`url(#${visorId})`} stroke="#50DDF5" strokeWidth="3" />
      <path d="M91 86q14-8 36-3" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity=".62" strokeLinecap="round" />
      <path d="M77 181q32 12 67 0v18q-29 17-62 0z" fill={`url(#${metalId})`} stroke="#202744" strokeWidth="2" />
      <rect x="96" y="183" width="29" height="13" rx="2" fill="#101426" stroke="#FFD75E" strokeWidth="1.5" />
      <circle cx="103" cy="189.5" r="2.2" fill="#FF454F" /><circle cx="111" cy="189.5" r="2.2" fill="#FFD75E" /><circle cx="119" cy="189.5" r="2.2" fill="#70E8B2" />
      <path d="M81 146l-8 28M149 146l8 28" stroke="#FFF1C2" strokeWidth="2" opacity=".8" />
      <path d="M93 217h35" stroke={colors.outline} strokeWidth="2" opacity=".65" />
    </svg>
  );
}

function FixedCrewmate() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      if (reducedMotion.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const progress = max > 0 ? window.scrollY / max : 0;
        const bounds = node.getBoundingClientRect();
        const gutter = Math.min(20, window.innerWidth * .05);
        const horizontalTravel = Math.max(0, (window.innerWidth - bounds.width - gutter * 2) / 2);
        const startY = Math.max(gutter, window.innerHeight * .14);
        const verticalTravel = Math.max(0, window.innerHeight - bounds.height - gutter - startY);
        const horizontal = Math.sin(progress * Math.PI * 2 + Math.PI / 2) * horizontalTravel;
        const vertical = startY + progress * verticalTravel + Math.sin(progress * Math.PI * 4) * 8;
        const rotation = Math.sin(progress * Math.PI * 2) * 3;
        node.style.transform = `translate3d(calc(${horizontal}px - 50%), ${vertical}px, 0) rotate(${rotation}deg)`;
      });
    };
    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        cancelAnimationFrame(frame);
        node.style.transform = '';
      } else {
        update();
      }
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    reducedMotion.addEventListener('change', handleMotionPreference);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      reducedMotion.removeEventListener('change', handleMotionPreference);
    };
  }, []);
  return <div className="crewmate-fixed" ref={ref} aria-hidden="true"><CrewArt /></div>;
}

type AlarmHandle = { activate: () => void };

const Alarm = forwardRef<AlarmHandle, { onActivate: () => void }>(function Alarm({ onActivate }, ref) {
  const [open, setOpen] = useState(false);
  const [alarming, setAlarming] = useState(false);
  const [message, setMessage] = useState('SEAL IS ENGAGED — LIFT THE COVER TO ACCESS');
  const timer = useRef<number | undefined>(undefined);
  const alarmButton = useRef<HTMLButtonElement>(null);
  function pressAlarm() {
    if (alarming) return;
    setOpen(true);
    setAlarming(true);
    setMessage('IMPOSTOR ALERT — TRUST NO ONE.');
    onActivate();
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setAlarming(false);
      setMessage('ALERT LOGGED — THE CREW HAS BEEN NOTIFIED.');
    }, 2350);
  }
  function activateFromHero() {
    setOpen(true);
    pressAlarm();
  }
  function liftCover() {
    setOpen(true);
    setMessage('COVER OPEN — PRESS THE ALARM TO WARN THE CREW');
    window.requestAnimationFrame(() => alarmButton.current?.focus());
  }
  useImperativeHandle(ref, () => ({ activate: activateFromHero }), [alarming, onActivate]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <div className={`alarm-panel ${alarming ? 'is-alarming' : ''}`} data-testid="panel-emergency-alarm">
      <div className="panel-top"><span>Emergency protocol / 01</span><span>Manual override</span></div>
      <div className="alarm-well">
        <div className="alarm-light" aria-hidden="true" />
        <button ref={alarmButton} id="alarm-button" className="alarm-button" type="button" onClick={pressAlarm} disabled={!open || alarming} aria-label="Activate emergency impostor alarm" data-testid="button-emergency-alarm">ALARM</button>
        <button className={`alarm-cover ${open ? 'open' : ''}`} type="button" onClick={liftCover} disabled={open} aria-expanded={open} aria-controls="alarm-button" aria-hidden={open} tabIndex={open ? -1 : 0} aria-label="Lift protective cover" data-testid="button-lift-cover">LIFT COVER</button>
      </div>
      <div className={`alarm-status ${alarming ? 'alert' : ''}`} role="status" aria-live="assertive" data-testid="status-alarm">{message}</div>
      <div className="alarm-caption"><span>Do not use for routine tasks</span><span>Level 03 / Security</span></div>
    </div>
  );
});

function WireGame() {
  const [selected, setSelected] = useState<{ id: WireColor; side: 'left' | 'right' } | null>(null);
  const [connected, setConnected] = useState<WireColor[]>([]);
  const [feedback, setFeedback] = useState('Select a port on either side, then its matching port.');
  const done = connected.length === wires.length;
  function choose(id: WireColor, side: 'left' | 'right') {
    if (connected.includes(id)) return;
    if (!selected) {
      setSelected({ id, side });
      setFeedback(`Port selected. Find the ${wires.find((wire) => wire.id === id)?.name} match.`);
      return;
    }
    if (selected.id === id && selected.side !== side) {
      setConnected((current) => [...current, id]);
      setSelected(null);
      const nextCount = connected.length + 1;
      setFeedback(nextCount === wires.length ? 'All circuits restored. Crew link is stable.' : `Connection confirmed — ${wires.find((wire) => wire.id === id)?.name} online.`);
    } else {
      setSelected({ id, side });
      setFeedback(selected.side === side ? 'Choose the matching port on the opposite terminal bank.' : 'That pairing is crossed. Select the correct color on the opposite bank.');
    }
  }
  function reset() {
    setSelected(null); setConnected([]);
    setFeedback('Select a port on either side, then its matching port.');
  }
  return (
    <div className="game-console" data-testid="game-wire-console">
      <div className="console-head"><div><h3>Restore the ship’s signal</h3><p>Three live circuits. Match each port by color to bring the comms array back online.</p></div><span className="game-count" data-testid="text-wire-count">{connected.length} / 3 LINKED</span></div>
      <div className="wire-game">
        <div className="wire-progress"><span>Repair progress</span><div className="progress-track" role="progressbar" aria-label="Circuit repair progress" aria-valuemin={0} aria-valuemax={3} aria-valuenow={connected.length}><div className="progress-fill" style={{ width: `${connected.length / 3 * 100}%` }} /></div><span>{Math.round(connected.length / 3 * 100)}%</span></div>
        <div className="terminal-board">
          <div className="terminal-column" role="group" aria-label="Source terminals">
            {wires.map((wire) => <button key={`left-${wire.id}`} type="button" className={`terminal-button ${selected?.id === wire.id && selected.side === 'left' ? 'selected' : ''} ${connected.includes(wire.id) ? 'connected' : ''}`} style={{ '--wire': wire.color } as CSSProperties} disabled={connected.includes(wire.id)} onClick={() => choose(wire.id, 'left')} aria-pressed={selected?.id === wire.id && selected.side === 'left'} data-testid={`button-wire-source-${wire.id}`}><span className="terminal-dot" /><span>{wire.name}</span></button>)}
          </div>
          <div className="wire-paths" aria-hidden="true">{wires.map((wire) => <span key={wire.id} className={`wire-path ${connected.includes(wire.id) ? 'done' : ''}`} style={{ '--wire': wire.color } as CSSProperties} />)}</div>
          <div className="terminal-column" role="group" aria-label="Destination terminals">
            {wires.map((wire) => <button key={`right-${wire.id}`} type="button" className={`terminal-button ${selected?.id === wire.id && selected.side === 'right' ? 'selected' : ''} ${connected.includes(wire.id) ? 'connected' : ''}`} style={{ '--wire': wire.color } as CSSProperties} disabled={connected.includes(wire.id)} onClick={() => choose(wire.id, 'right')} aria-pressed={selected?.id === wire.id && selected.side === 'right'} data-testid={`button-wire-target-${wire.id}`}><span className="terminal-dot" /><span>{wire.name}</span></button>)}
          </div>
        </div>
        <div className="game-controls"><div className="wire-feedback" role="status" aria-live="polite" data-testid="status-wire-game">{done ? 'SYSTEM RESTORED — GOOD WORK, CREW.' : feedback}</div><button className="subtle-button" type="button" onClick={reset} data-testid="button-reset-wires">{done ? 'Play again' : 'Reset circuit'}</button></div>
      </div>
    </div>
  );
}

function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    const format = String(data.get('format') || '');
    const team = String(data.get('team') || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid college email address to continue.');
      return;
    }
    if (format === 'team' && !team) {
      setError('Add your team name or member details to continue.');
      return;
    }
    setError('');
    setSubmitted(true);
    form.reset();
  }
  return (
    <div className="form-shell">
      {submitted ? <div className="form-success" role="status" data-testid="status-registration-success"><strong>Transmission received.</strong><p>This is a demo confirmation only. Your details were not sent or saved. Registration will open once event information is confirmed.</p><button className="subtle-button" type="button" onClick={() => setSubmitted(false)} style={{ marginTop: 18 }} data-testid="button-register-another">Submit another response</button></div> : (
        <form onSubmit={submit} noValidate data-testid="form-registration">
          <div className="form-grid">
            <div className="field"><label htmlFor="reg-name">Full name</label><input id="reg-name" name="name" autoComplete="name" placeholder="Your name" required minLength={2} data-testid="input-registration-name" /></div>
            <div className="field"><label htmlFor="reg-email">College email</label><input id="reg-email" name="email" type="email" autoComplete="email" placeholder="you@college.edu" required data-testid="input-registration-email" /></div>
            <div className="field full"><label htmlFor="reg-college">College / institute</label><input id="reg-college" name="college" placeholder="Your institution" required minLength={2} data-testid="input-registration-college" /></div>
            <div className="field"><label htmlFor="reg-format">Participation</label><select id="reg-format" name="format" required defaultValue="" data-testid="select-registration-format"><option value="" disabled>Select format</option><option value="solo">Solo — place me in a crew</option><option value="team">I have a team</option></select></div>
            <div className="field"><label htmlFor="reg-team">Team name / members</label><input id="reg-team" name="team" placeholder="Required if joining as a team" data-testid="input-registration-team" /></div>
          </div>
          {error && <p className="wire-feedback" role="alert" data-testid="status-registration-error">{error}</p>}
          <p className="form-note">No confirmed schedule yet. Joining this demo form does not reserve a place or notify an organizer.</p>
          <button className="button-primary form-submit" type="submit" data-testid="button-registration-submit">Send a transmission <span aria-hidden="true">↗</span></button>
        </form>
      )}
    </div>
  );
}

function Home() {
  const alarmRef = useRef<AlarmHandle>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const soundEnabledRef = useRef(soundEnabled);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeOscillatorRef = useRef<OscillatorNode | null>(null);
  const soundActiveRef = useRef(false);
  soundEnabledRef.current = soundEnabled;

  function stopEmergencyBeep() {
    soundActiveRef.current = false;
    const oscillator = activeOscillatorRef.current;
    activeOscillatorRef.current = null;
    if (!oscillator) return;
    oscillator.onended = null;
    try { oscillator.stop(); } catch { /* It may already have ended. */ }
    try { oscillator.disconnect(); } catch { /* The node may already be disconnected. */ }
  }

  function playEmergencyBeep() {
    if (!soundEnabledRef.current || soundActiveRef.current || !window.AudioContext) return;
    soundActiveRef.current = true;
    try {
      const context = audioContextRef.current ?? new window.AudioContext();
      audioContextRef.current = context;
      const startTone = () => {
        if (!soundEnabledRef.current || !soundActiveRef.current) return;
        const now = context.currentTime;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(660, now);
        oscillator.frequency.exponentialRampToValueAtTime(440, now + .18);
        oscillator.frequency.setValueAtTime(660, now + .23);
        oscillator.frequency.exponentialRampToValueAtTime(440, now + .5);
        gain.gain.setValueAtTime(.0001, now);
        gain.gain.exponentialRampToValueAtTime(.085, now + .025);
        gain.gain.setValueAtTime(.07, now + .32);
        gain.gain.exponentialRampToValueAtTime(.0001, now + .54);
        oscillator.connect(gain);
        gain.connect(context.destination);
        activeOscillatorRef.current = oscillator;
        oscillator.onended = () => {
          if (activeOscillatorRef.current === oscillator) activeOscillatorRef.current = null;
          soundActiveRef.current = false;
          oscillator.disconnect();
          gain.disconnect();
        };
        oscillator.start(now);
        oscillator.stop(now + .55);
      };
      if (context.state === 'suspended') {
        void context.resume().then(startTone).catch(() => { soundActiveRef.current = false; });
      } else {
        startTone();
      }
    } catch {
      soundActiveRef.current = false;
    }
  }

  useEffect(() => {
    if (!soundEnabled) stopEmergencyBeep();
  }, [soundEnabled]);
  useEffect(() => () => {
    stopEmergencyBeep();
    void audioContextRef.current?.close();
  }, []);

  function triggerHeroAlarm() {
    alarmRef.current?.activate();
    document.querySelector('#protocol')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="page-shell">
      <FixedCrewmate />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Operation Last Suspect home" data-testid="link-brand-home"><span className="brand-mark"><span>S</span></span><span className="brand-text"><strong>SPARK</strong><small><span>×</span> IIIT BHOPAL</small></span></a>
        <nav className="nav-links" aria-label="Main navigation"><a href="#protocol" data-testid="link-nav-protocol">Protocol</a><a href="#game" data-testid="link-nav-game">Training</a><a href="#details" data-testid="link-nav-details">Mission file</a><button className={`sound-toggle ${soundEnabled ? 'is-on' : ''}`} type="button" onClick={() => setSoundEnabled((enabled) => !enabled)} aria-pressed={soundEnabled} aria-label={`Turn sound ${soundEnabled ? 'off' : 'on'}`} data-testid="button-sound-toggle"><span className="sound-indicator" aria-hidden="true" />Sound {soundEnabled ? 'on' : 'off'}</button><a className="header-cta" href="#register" data-testid="link-nav-register">Join the crew <span aria-hidden="true">↗</span></a></nav>
      </header>
      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="stars" aria-hidden="true" />
          <div className="hero-art" aria-hidden="true">
            <span className="hero-orbit hero-orbit-one" />
            <span className="hero-orbit hero-orbit-two" />
            <span className="hero-spark hero-spark-one" />
            <span className="hero-spark hero-spark-two" />
            <div className="hero-crew hero-crew-sky"><CrewArt tone="sky" /></div>
            <div className="hero-crew hero-crew-yellow"><CrewArt tone="yellow" /></div>
            <div className="hero-crew hero-crew-purple"><CrewArt tone="purple" /></div>
            <span className="hero-sticker">CREW<br />NOT CLEAR</span>
          </div>
          <div className="hero-content">
            <div className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />The campus mystery event <span className="mono">/ field operation 01</span></div>
            <h1 id="hero-title"><span>One of you is</span><span className="line-two">lying!</span></h1>
            <p className="hero-copy">A crew. A compromised ship. One impostor hiding in plain sight. Read the room, finish the mission, and decide who makes it back.</p>
            <div className="hero-actions"><button className="button-primary hero-emergency" type="button" onClick={triggerHeroAlarm} data-testid="button-hero-emergency"><span className="button-alert-dot" aria-hidden="true" />Emergency meeting</button><a className="text-link" href="#game" data-testid="link-hero-brief">Explore the mission <span aria-hidden="true">↓</span></a></div>
          </div>
          <span className="hero-index mono">TRANSMISSION 001 — PRIVATE</span>
          <div className="hero-coordinates">SHIP STATUS: COMPROMISED<br />CREW TRUST: UNVERIFIED<br />LOCATION: <span className="placeholder">[TO BE ANNOUNCED]</span></div>
        </section>
        <div className="ticker" aria-label="Mission update"><strong>CREW ALERT</strong><span>—</span><span>One impostor. No second chances.</span><span>—</span><strong>SPARK / IIIT BHOPAL</strong></div>
        <section className="section emergency-section" id="protocol" aria-labelledby="protocol-title">
          <div className="section-inner alarm-layout"><div><div className="section-kicker"><span>01</span> Emergency meeting</div><h2 className="section-title" id="protocol-title">Trust your<br /><em>instinct.</em></h2><p className="section-intro">Something feels wrong. In the operation, suspicion is a tool — but every accusation has consequences. Try the emergency system below. You have to break the seal first.</p></div><Alarm ref={alarmRef} onActivate={playEmergencyBeep} /></div>
        </section>
        <section className="section wire-section" id="game" aria-labelledby="game-title">
          <div className="section-inner"><div className="section-kicker"><span>02</span> Training simulation</div><h2 className="section-title" id="game-title">Patch the<br /><em>signal.</em></h2><p className="section-intro">A quiet minute before the ship goes dark. Reconnect each circuit and see if your hands are steadier than your suspicions.</p>
            <WireGame />
            <div className="highlights" aria-label="Event highlights">
              <article className="highlight" data-testid="highlight-deduction"><span className="highlight-no">01 / READ</span><h3>People are the puzzle</h3><p>Watch the little details. Listen for the story that changes halfway through.</p></article>
              <article className="highlight" data-testid="highlight-mission"><span className="highlight-no">02 / REPAIR</span><h3>Keep the ship alive</h3><p>Work through mission tasks while the crew tries to tell truth from performance.</p></article>
              <article className="highlight" data-testid="highlight-vote"><span className="highlight-no">03 / DECIDE</span><h3>Make your case</h3><p>Bring your evidence to the table. The crew decides who stays aboard.</p></article>
            </div>
          </div>
        </section>
        <section className="section details-section" id="details" aria-labelledby="details-title">
          <div className="section-inner"><div className="section-kicker"><span>03</span> Mission file</div><h2 className="section-title" id="details-title">Before you<br /><em>board.</em></h2><p className="section-intro">The operation is being prepared by SPARK at IIIT Bhopal. The confirmed brief will land here first. No invented coordinates, no phantom prizes.</p>
            <div className="details-grid">
              <div className="detail-row"><span className="detail-label">Date & time</span><span className="detail-value placeholder">[TO BE ANNOUNCED]</span></div>
              <div className="detail-row"><span className="detail-label">Venue</span><span className="detail-value placeholder">[TO BE ANNOUNCED]</span></div>
              <div className="detail-row"><span className="detail-label">Prizes</span><span className="detail-value placeholder">[TO BE ANNOUNCED]</span></div>
              <div className="detail-row"><span className="detail-label">Organizers</span><span className="detail-value">SPARK × IIIT Bhopal <span className="placeholder">/ CONTACT DETAILS TO BE ANNOUNCED</span></span></div>
              <div className="detail-row"><span className="detail-label">Who can join</span><span className="detail-value">Students ready to observe, collaborate, and make a call under pressure.</span></div>
              <div className="detail-row"><span className="detail-label">Crew format</span><span className="detail-value">Solo players and pre-formed teams can register interest.</span></div>
            </div>
          </div>
        </section>
        <section className="section rules-section" id="rules" aria-labelledby="rules-title">
          <div className="section-inner rules-layout"><div><div className="section-kicker"><span>04</span> Crew conduct</div><h2 className="section-title" id="rules-title">Clear rules.<br /><em>Clean play.</em></h2><p className="section-intro">The game is about reading the room, not making anyone uncomfortable. Keep the mission sharp and the space respectful.</p></div>
            <ol className="rules-list"><li>Listen to the host and follow the event format and safety instructions.</li><li>Keep accusations inside the game. No harassment, personal attacks, or real-world targeting.</li><li>Play honestly: no outside messages, collusion, or sharing hidden-role information.</li><li>Give every crewmate room to speak. The host may pause or end a round when needed.</li><li>Event schedule, eligibility, team size, and final rules will be confirmed by organizers.</li></ol>
          </div>
        </section>
        <section className="section register-section" id="register" aria-labelledby="register-title">
          <div className="section-inner registration-layout"><div><div className="section-kicker"><span>05</span> Join the operation</div><h2 className="section-title" id="register-title">Your crew<br />is <em>waiting.</em></h2><p className="section-intro">Send your details to the local terminal. This prototype has no connection to an organizer; submission only displays a local demo confirmation.</p><p className="disclaimer">Demo form only: this page does not send, store, or share your information. Official registration details will be published when confirmed.</p></div><RegistrationForm /></div>
        </section>
      </main>
      <footer className="site-footer"><span className="footer-brand">SPARK × IIIT Bhopal <span>— OPERATION: LAST SUSPECT</span></span><nav className="footer-links" aria-label="Footer navigation"><a href="#top" data-testid="link-footer-top">Back to top ↑</a><a href="#rules" data-testid="link-footer-rules">Crew rules</a><a href="#register" data-testid="link-footer-register">Registration demo</a></nav><span>DATE / VENUE: TBA</span></footer>
    </div>
  );
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>;
}

function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter>;
}

export default App;
