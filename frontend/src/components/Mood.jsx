import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { siSpotify } from 'simple-icons';

// ---------------------------------------------------------------------------
// MOOD DECK
// One tab per language (Bengali / Hindi / English) plus a lyric-free Focus
// tab. The rail expands each artist into their albums and each album into
// its tracks — the full studio discography, every track the complete song
// (Spotify's embed plays full tracks for a logged-in user, never a sample).
// Playback is Spotify only; embed players are always dark and cannot be
// re-themed, so the deck keeps a constant surface from the --term-* tokens
// (same as the terminal section) and stays colour-theme-safe.
//
// Nothing third-party loads until the visitor presses play: the facade
// renders first, the iframe mounts on click (plus loading="lazy"), and
// plain links — the track, its album, its artist, and a Genius search for
// its lyrics — are always one tab away. Cueing another song unmounts the
// player, so a tab switch or a skip stops the audio.
//
// Tab data (whole discographies) ships as its own chunk: ../data/moodData
// is imported when this section mounts, so the rest of the site never waits
// for it. Until it lands the deck shows a skeleton.
// ---------------------------------------------------------------------------

const COPY = {
  badge: 'Off the clock',
  heading: 'The songs I build to',
  description:
    'Bengali first — Anjan da, Rupam Islam, Anupam Roy, Rupankar, Cactus, Fossils, Chandrabindoo — then the Hindi world (Kishore Kumar, Lata Mangeshkar, Arijit Singh, Shreya Ghoshal, Atif Aslam, Pritam and more) and English picks from Ed Sheeran, Bruno Mars, The Weeknd, Coldplay, Queen, Linkin Park, Pink Floyd and Elvis Presley. Every artist brings their full studio albums: whole discographies, whole songs, full length from Spotify.',
  footnote:
    "Spotify's own player — full songs, never samples · nothing re-hosted · nothing loads until you press play, and cueing another song stops the music.",
};

// Platform metadata. The deck plays Spotify only — add another platform here
// (and in `frames`) if a song ever has to come from somewhere else. `frames`
// reserves each embed's real height so nothing jumps while a player loads:
// a single Spotify track is 152px tall, a Spotify playlist 352px.
const platforms = {
  spotify: { label: 'Spotify', icon: siSpotify },
};

const frames = {
  spotify: { track: 'h-[152px]', playlist: 'h-[352px]' },
};

const BrandGlyph = ({ icon }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d={icon.path} />
  </svg>
);

const PlayGlyph = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
    <path d="M8 5.2v13.6L19,12z" />
  </svg>
);

// Songs store only their Spotify id — the page and embed URLs are derived so
// the data chunk stays small. Playlists keep a full url.
const trackUrl = (song) => (song.kind === 'playlist' ? song.url : `https://open.spotify.com/track/${song.id}`);

const embedUrlFor = (song) =>
  song.kind === 'playlist'
    ? song.url.replace('open.spotify.com/', 'open.spotify.com/embed/') + '?utm_source=generator&theme=0'
    : `https://open.spotify.com/embed/track/${song.id}?utm_source=generator&theme=0`;

// Spotify's embeds show no lyrics, so every track links out to a Genius
// search for "artist title lyrics" instead.
const lyricsUrl = (artist, title) =>
  `https://genius.com/search?q=${encodeURIComponent(`${artist} ${title} lyrics`)}`;

const fmtDur = (ms) => {
  if (!ms) return '';
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

// Total songs of the group a flat cue entry belongs to (facade note).
const countGroup = (flat, entry) => {
  let n = 0;
  for (const item of flat) {
    if (item.group === entry.group) n += 1;
  }
  return n;
};

const Mood = () => {
  const deckRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const deckInView = useInView(deckRef, { once: true, amount: 0.2 });
  const activeBtnRef = useRef(null);

  // Tab data arrives as its own lazy chunk once the section exists.
  const [tabs, setTabs] = useState(null);
  // The discography chunk only loads once the deck is actually on screen —
  // the rest of the site never waits for a megabyte of track metadata.
  useEffect(() => {
    if (!deckInView) return undefined;
    let alive = true;
    import('../data/moodData')
      .then((mod) => {
        if (alive) setTabs(mod.moodContent.tabs);
      })
      .catch(() => {
        if (alive) setTabs([]);
      });
    return () => {
      alive = false;
    };
  }, [deckInView]);

  const [activeTabId, setActiveTabId] = useState('bengali');
  const [activeTrack, setActiveTrack] = useState(0);
  const [loadedKey, setLoadedKey] = useState(null);
  const [openArtists, setOpenArtists] = useState({});

  const tab = tabs && tabs.length ? tabs.find((entry) => entry.id === activeTabId) || tabs[0] : null;

  // One flat, ordered cue list per tab — artist → album → song — so prev/next
  // walks the whole tab while the rail keeps the nested view.
  const flat = useMemo(() => {
    if (!tab) return [];
    if (!tab.groups) return tab.songs.map((song) => ({ song, group: null, album: null }));
    const out = [];
    tab.groups.forEach((group) => {
      group.albums.forEach((album) => {
        album.songs.forEach((song) => out.push({ song, group, album }));
      });
    });
    return out;
  }, [tab]);

  const posOf = useMemo(() => {
    const map = new Map();
    flat.forEach((entry, i) => map.set(entry.song, i));
    return map;
  }, [flat]);

  const index = flat.length ? Math.min(activeTrack, flat.length - 1) : 0;
  const entry = flat[index];
  const song = entry ? entry.song : null;
  const platform = platforms.spotify;
  const frame = frames.spotify[song && song.kind === 'playlist' ? 'playlist' : 'track'];
  const songKey = tab && song ? `${tab.id}:${index}` : null;
  const isLoaded = Boolean(songKey) && loadedKey === songKey;

  const isPlaylistTab = Boolean(tab && !tab.groups);
  const artistCount = tab && tab.groups ? tab.groups.length : 0;

  // The rail expands the group of whatever song is cued, so the active track
  // is always on screen; every other artist stays a compact header. Only the
  // user's explicit toggles live in state — the cued group opens by default,
  // so nothing has to be synced back in through an effect.
  const activeGroupName = entry && entry.group ? entry.group.artist : null;
  const isGroupOpen = (name) =>
    Object.prototype.hasOwnProperty.call(openArtists, name) ? openArtists[name] : name === activeGroupName;

  useEffect(() => {
    if (activeBtnRef.current) activeBtnRef.current.scrollIntoView({ block: 'nearest' });
  }, [index, activeTabId, tabs]);


  // One player at a time — cueing another song (or another tab) clears the
  // loaded key, which unmounts the iframe and stops the audio.
  const selectTab = (id) => {
    setActiveTabId(id);
    setActiveTrack(0);
    setLoadedKey(null);
    setOpenArtists({});
  };

  const selectTrack = (next) => {
    setActiveTrack(next);
    setLoadedKey(null);
  };

  const stepTrack = (delta) => selectTrack((index + delta + flat.length) % flat.length);

  const loadPlayer = () => setLoadedKey(songKey);
  const stopPlayer = () => setLoadedKey(null);

  const toggleArtist = (name) => setOpenArtists((prev) => ({ ...prev, [name]: !isGroupOpen(name) }));

  // Facade note: position inside the current artist's discography.
  let artistStart = index;
  while (artistStart > 0 && entry && flat[artistStart - 1].group === entry.group) artistStart -= 1;
  const artistPos = entry ? index - artistStart + 1 : 0;
  const artistTotal = entry ? countGroup(flat, entry) : 0;
  const currentLyrics = entry && entry.group ? lyricsUrl(entry.group.artist, entry.song.title) : null;

  return (
    <section
      id="mood"
      className="relative w-full overflow-hidden bg-[#f6f5f2] px-6 pb-32 pt-28 font-sans bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:80px_80px] md:px-12 md:pt-36"
    >
      <div className="pointer-events-none absolute left-[-9rem] top-24 h-96 w-96 rounded-full bg-amber-700/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="mb-12 max-w-3xl md:mb-16"
        >
          <span className="inline-block rounded-full border border-slate-300 bg-white px-5 py-1.5 text-sm font-bold text-slate-600 shadow-sm">
            {COPY.badge}
          </span>
          <h2 className="mt-7 text-4xl font-black leading-[1.02] tracking-tight text-slate-900 md:text-6xl">
            {COPY.heading}
          </h2>
          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-slate-600 md:text-lg">
            {COPY.description}
          </p>
        </motion.div>

        <div ref={deckRef}>
          {!tab || !song ? (
            <div className="mood-skeleton" aria-hidden="true" />
          ) : (
            <>
              <div
                className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2"
                role="group"
                aria-label="Pick a song set"
              >
                {tabs.map((tabEntry) => {
                  const isActive = tabEntry.id === activeTabId;

                  return (
                    <button
                      key={tabEntry.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => selectTab(tabEntry.id)}
                      className={`flex shrink-0 snap-start items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 ${
                        isActive
                          ? 'border-slate-900 bg-slate-900 text-white shadow-[0_12px_28px_rgba(32,38,43,0.18)]'
                          : 'border-slate-200 bg-white/70 text-slate-600 hover:border-slate-900 hover:text-slate-900'
                      }`}
                    >
                      <span aria-hidden="true" className="text-base leading-none">
                        {tabEntry.emoji}
                      </span>
                      {tabEntry.label}
                    </button>
                  );
                })}
              </div>


              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 28 }}
                whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mood-deck mt-5"
              >
                <div className="mood-deck-bar">
                  <span className="mood-deck-dot mood-deck-dot-red" />
                  <span className="mood-deck-dot mood-deck-dot-yellow" />
                  <span className="mood-deck-dot mood-deck-dot-green" />
                  <span className="mood-deck-title">samprt — mood deck · {tab.label}</span>
                  {isLoaded ? (
                    <button type="button" className="mood-stop" onClick={stopPlayer}>
                      ■ stop
                    </button>
                  ) : (
                    <span className="mood-deck-badge">{platform.label} player</span>
                  )}
                </div>

                <div className="mood-body">
                  <div className="mood-rail">
                    <p className="mood-rail-head">
                      <span>
                        {tab.script} · {tab.tagline}
                      </span>
                      <span className="mood-rail-count">
                        {flat.length} {isPlaylistTab ? 'playlists' : 'songs'}
                        {artistCount ? ` · ${artistCount} artists` : ''}
                      </span>
                    </p>

                    <ul className="mood-tracks">
                      {isPlaylistTab
                        ? flat.map((item, i) => {
                            const isCurrent = i === index;
                            const isPlaying = isCurrent && isLoaded;

                            return (
                              <li key={item.song.url} className="mood-track-row">
                                <button
                                  type="button"
                                  ref={isCurrent ? activeBtnRef : undefined}
                                  className={`mood-track${isCurrent ? ' is-current' : ''}`}
                                  onClick={() => selectTrack(i)}
                                  aria-current={isCurrent ? 'true' : undefined}
                                >
                                  <span className="mood-track-index" aria-hidden="true">
                                    {String(i + 1).padStart(2, '0')}
                                  </span>
                                  <span className="mood-track-copy">
                                    <span className="mood-track-title">{item.song.title}</span>
                                  </span>
                                  <span className={`mood-track-state${isPlaying ? '' : ' is-idle'}`}>
                                    {isPlaying ? 'playing' : isCurrent ? 'cued' : ''}
                                  </span>
                                </button>
                              </li>
                            );
                          })
                        : tab.groups.map((group) => {

                            const open = isGroupOpen(group.artist);
                            const groupTotal = group.albums.reduce((n, album) => n + album.songs.length, 0);

                            return (
                              <Fragment key={group.artist}>
                                <li className="mood-artist-row">
                                  <button
                                    type="button"
                                    className="mood-artist-toggle"
                                    aria-expanded={open}
                                    onClick={() => toggleArtist(group.artist)}
                                  >
                                    <span className="mood-artist-caret" aria-hidden="true">
                                      {open ? '▾' : '▸'}
                                    </span>
                                    <span className="mood-artist-name">{group.artist}</span>
                                  </button>
                                  <span className="mood-artist-count">
                                    {groupTotal} songs · {group.albums.length}{' '}
                                    {group.albums.length === 1 ? 'album' : 'albums'}
                                  </span>
                                  <a
                                    className="mood-artist-link"
                                    href={`https://open.spotify.com/artist/${group.artistId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Open ${group.artist} on Spotify`}
                                  >
                                    open ↗
                                  </a>
                                </li>
                                {open
                                  ? group.albums.map((album) => (
                                      <Fragment key={album.id || album.title}>
                                        <li className="mood-album-row">
                                          <span className="mood-album-title">
                                            {album.title}
                                            {album.year ? ` · ${album.year}` : ''}
                                          </span>
                                          <span className="mood-album-meta">{album.songs.length} songs</span>
                                          <a
                                            className="mood-album-link"
                                            href={`https://open.spotify.com/album/${album.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Open ${album.title} on Spotify`}
                                          >
                                            ↗
                                          </a>
                                        </li>
                                        {album.songs.map((item, songIdx) => {
                                          const i = posOf.get(item) || 0;
                                          const isCurrent = i === index;
                                          const isPlaying = isCurrent && isLoaded;
                                          const sub = [item.feat, fmtDur(item.dur)].filter(Boolean).join(' · ');

                                          return (
                                            <li key={item.id} className="mood-track-row">
                                              <button
                                                type="button"
                                                ref={isCurrent ? activeBtnRef : undefined}
                                                className={`mood-track${isCurrent ? ' is-current' : ''}`}
                                                onClick={() => selectTrack(i)}
                                                aria-current={isCurrent ? 'true' : undefined}
                                              >
                                                <span className="mood-track-index" aria-hidden="true">
                                                  {String(songIdx + 1).padStart(2, '0')}
                                                </span>
                                                <span className="mood-track-copy">
                                                  <span className="mood-track-title">{item.title}</span>
                                                  {sub ? <span className="mood-track-artist">{sub}</span> : null}
                                                </span>
                                                <span className={`mood-track-state${isPlaying ? '' : ' is-idle'}`}>
                                                  {isPlaying ? 'playing' : isCurrent ? 'cued' : ''}
                                                </span>
                                              </button>

                                              <a
                                                className="mood-lyrics"
                                                href={lyricsUrl(group.artist, item.title)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`Lyrics for ${item.title} on Genius`}
                                                title="lyrics on Genius"
                                              >
                                                ly
                                              </a>
                                            </li>
                                          );
                                        })}
                                      </Fragment>
                                    ))
                                  : null}
                              </Fragment>
                            );
                          })}
                    </ul>
                  </div>


                  <div
                    className="mood-stage"
                    role="region"
                    aria-label={`${song.title} by ${entry.group ? entry.group.artist : 'Spotify'} — ${platform.label} player`}
                  >
                    {!deckInView ? (
                      <div className="mood-skeleton" aria-hidden="true" />
                    ) : isLoaded ? (
                      <iframe
                        key={songKey}
                        className={`mood-frame ${frame}`}
                        src={embedUrlFor(song)}
                        title={`${song.title} — ${entry.group ? entry.group.artist : tab.label} on ${platform.label}`}
                        loading="lazy"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        type="button"
                        className="mood-facade"
                        onClick={loadPlayer}
                        aria-label={`Load ${song.title} by ${entry.group ? entry.group.artist : tab.label} from ${platform.label}`}
                      >
                        <span className="mood-facade-art" aria-hidden="true">
                          {tab.emoji}
                        </span>
                        <span className="mood-facade-copy">
                          <span className="mood-facade-eyebrow">
                            {platform.label} {song.kind === 'playlist' ? 'playlist' : 'song'}
                          </span>
                          <span className="mood-facade-title">{song.title}</span>
                          <span className="mood-facade-note">
                            {entry.group
                              ? `${entry.group.artist}${
                                  entry.album
                                    ? ` · ${entry.album.title}${entry.album.year ? ` (${entry.album.year})` : ''}`
                                    : ''
                                } · song ${artistPos} of ${artistTotal} on this artist`
                              : tab.tagline}
                          </span>
                        </span>
                        <span className="mood-facade-play">
                          <PlayGlyph />
                          press play
                        </span>
                      </button>
                    )}
                  </div>
                </div>


                <div className="mood-transport">
                  <button type="button" className="mood-transport-btn" onClick={() => stepTrack(-1)}>
                    ◀ prev
                  </button>
                  <button type="button" className="mood-transport-btn" onClick={() => stepTrack(1)}>
                    next ▶
                  </button>
                  <span className="mood-transport-count">
                    {index + 1} / {flat.length} · {tab.label}
                  </span>
                </div>

                <div className="mood-deck-foot">
                  <span className="mood-deck-note">
                    <span className="mood-deck-brand">
                      <BrandGlyph icon={platform.icon} />
                    </span>
                    {COPY.footnote}
                  </span>
                  {currentLyrics ? (
                    <a className="mood-fallback" href={currentLyrics} target="_blank" rel="noopener noreferrer">
                      Lyrics ↗
                    </a>
                  ) : null}
                  <a className="mood-fallback" href={trackUrl(song)} target="_blank" rel="noopener noreferrer">
                    Open in {platform.label} ↗
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Mood;

