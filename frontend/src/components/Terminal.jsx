import { useEffect, useMemo, useRef, useState } from 'react';
import {
  aboutContent,
  education,
  internshipsList,
  leadershipList,
  moodMeta,
  personalInfo,
  projects,
  softSkillsList,
  socialLinks,
  technicalSkills,
} from '../data/portfolioData';
import useTheme from '../hooks/useTheme';

// ---------------------------------------------------------------------------
// Interactive portfolio shell. Every command reads live from portfolioData.js,
// so the terminal can never drift out of sync with the site content.
// ---------------------------------------------------------------------------

const PROMPT_USER = 'guest@ByteHacker';
const PROMPT_SUFFIX = ':~$';
const HISTORY_LIMIT = 60;
const SNIPPET_LENGTH = 150;

const stripHtml = (value = '') => String(value).replace(/<[^>]*>/g, '');

const truncate = (value, limit = SNIPPET_LENGTH) => {
  const clean = stripHtml(value);
  return clean.length > limit ? `${clean.slice(0, limit).trimEnd()}…` : clean;
};

const progressBar = (level) => {
  const filled = Math.max(0, Math.min(10, Math.round(level / 10)));
  return `${'█'.repeat(filled)}${'░'.repeat(10 - filled)}`;
};

const padRight = (value, width) => String(value).padEnd(width, ' ');

const bannerLines = () => [
  ['accent', '[samprt.sh] portfolio shell — v2.0'],
  ['muted', `${personalInfo.name} · ${personalInfo.location}`],
  ['muted', 'Type "help" for commands · ↑/↓ history · Tab autocompletes'],
  ['muted', ''],
];

// Monotonic id generator — only ever advanced from event handlers.
let lineSequence = 0;

const createLine = (kind, value) => {
  lineSequence += 1;
  return { id: lineSequence, kind, text: value };
};

const buildCommands = ({ theme, setTheme, history }) => {
  const definitions = {
    banner: {
      description: 'print the welcome banner again',
      run: () => ({ lines: bannerLines() }),
    },
    whoami: {
      description: 'quick facts — name, role, location, status',
      run: () => ({
        lines: [
          ['accent', `${personalInfo.name} — ${personalInfo.title}`],
          ['muted', ''],
          ['', `${padRight('location', 11)}${personalInfo.location}`],
          ['', `${padRight('education', 11)}${education.degree}`],
          ['', `${padRight('institute', 11)}${education.institution}`],
          ['', `${padRight('stack', 11)}React · Node.js · Python · AI / ML`],
          ['success', `${padRight('status', 11)}open to internships & freelance work`],
          ['muted', ''],
          ['muted', 'next: about · skills · projects · contact'],
        ],
      }),
    },
    about: {
      description: 'who I am, in one paragraph',
      run: () => ({
        lines: [
          ['accent', '▍ about'],
          ['', stripHtml(aboutContent.bio)],
          ['muted', ''],
          ['muted', `core stack: ${aboutContent.techStack.join(' · ')}`],
          ['', personalInfo.summary],
        ],
      }),
    },
    skills: {
      description: 'tech stack with levels (try: skills frontend)',
      run: (args) => {
        const filter = (args[0] || '').toLowerCase();
        const matches = technicalSkills.categories.filter(
          (category) => !filter || category.title.toLowerCase().includes(filter),
        );

        if (!matches.length) {
          return {
            lines: [
              ['error', `no skill group matches "${args[0]}"`],
              ['muted', `available: ${technicalSkills.categories.map((category) => category.title).join(' · ')}`],
            ],
          };
        }

        const lines = [];
        matches.forEach((category, index) => {
          if (index) lines.push(['muted', '']);
          lines.push(['accent', `▍ ${category.title}`]);
          const width = Math.max(...category.skills.map((skill) => skill.name.length)) + 2;
          category.skills.forEach((skill) => {
            lines.push(['', `${padRight(skill.name, width)}${progressBar(skill.level)}  ${skill.level}%`]);
          });
        });
        return { lines };
      },
    },
    projects: {
      description: 'what I have built (try: projects 3)',
      run: (args) => {
        const query = (args[0] || '').toLowerCase();

        if (!query) {
          const lines = [['accent', '▍ projects — 4 shipped experiments'], ['muted', '']];
          projects.forEach((project) => {
            lines.push(['', `${project.number}. ${project.title}${project.isFlagship ? '  ★ flagship' : ''}`]);
            lines.push(['muted', `    ${project.badge} · ${project.techTags.join(', ')} · id: ${project.id}`]);
          });
          lines.push(['muted', '']);
          lines.push(['muted', 'details: projects <id|number> · links: open <id>']);
          return { lines };
        }

        const project = projects.find((item) => item.id === query || item.number === query);

        if (!project) {
          return {
            lines: [
              ['error', `no project matches "${args[0]}"`],
              ['muted', `try: ${projects.map((item) => item.id).join(' · ')}`],
            ],
          };
        }

        const links = [
          project.links.demo ? `demo: ${project.links.demo}` : null,
          project.links.github ? `github: ${project.links.github}` : null,
        ].filter(Boolean);

        return {
          lines: [
            ['accent', `${project.number} · ${project.title}`],
            ['info', project.badge],
            ['', project.description],
            ['muted', ''],
            ['muted', `tech: ${project.techTags.join(', ')}`],
            ...(links.length
              ? links.map((link) => ['success', link])
              : [['muted', 'no public link yet — happy to demo it in person']]),
            ['muted', `open it with: open ${project.id}`],
          ],
        };
      },
    },
    open: {
      description: 'open a project link (e.g. open kickresume)',
      run: (args) => {
        const query = (args[0] || '').toLowerCase();
        if (!query) {
          return { lines: [['error', 'usage: open <project id|number>'], ['muted', 'try: open kickresume']] };
        }

        const project = projects.find((item) => item.id === query || item.number === query);
        if (!project) {
          return { lines: [['error', `unknown project "${args[0]}"`], ['muted', 'run "projects" to see the list']] };
        }

        const url = project.links.demo || project.links.github;
        if (!url) {
          return {
            lines: [
              ['error', `${project.title} has no public link yet`],
              ['muted', 'try: open kickresume — it has a live demo'],
            ],
          };
        }

        window.open(url, '_blank', 'noopener,noreferrer');
        return { lines: [['success', `opening ${url}`]] };
      },
    },
    experience: {
      description: 'internships, freelance & open-source work',
      run: () => {
        const lines = [];
        internshipsList.forEach((entry, index) => {
          if (index) lines.push(['muted', '']);
          lines.push(['accent', `▍ ${entry.role} — ${entry.organization}`]);
          lines.push(['muted', `   ${entry.duration}`]);
          lines.push(['', `   skills: ${entry.skills.join(', ')}`]);
          lines.push(['', `   tech: ${entry.tech.join(', ')}`]);
        });
        return { lines };
      },
    },
    journey: {
      description: 'the story beyond code (7 chapters)',
      run: () => {
        const lines = [];
        leadershipList.forEach((chapter, index) => {
          if (index) lines.push(['muted', '']);
          lines.push(['accent', `▍ ${chapter.category} — ${chapter.title}`]);
          lines.push(['', `   ${truncate(chapter.description)}`]);
        });
        return { lines };
      },
    },
    education: {
      description: 'degree, institute and graduation year',
      run: () => ({
        lines: [
          ['accent', '▍ education'],
          ['', education.degree],
          ['muted', education.institution],
          ['', `graduation: ${education.graduation}`],
          ...(education.cgpa ? [['', `cgpa: ${education.cgpa}`]] : []),
          ['muted', ''],
          ['muted', 'the rest of the curriculum is the "projects" list — shipped beats theory'],
        ],
      }),
    },
    'soft-skills': {
      description: 'the human skills behind the code',
      run: () => ({
        lines: softSkillsList.map((skill) => ['', `${padRight(skill.name, 22)}${skill.desc}`]),
      }),
    },
    contact: {
      description: 'how to reach me (--mail opens your mail app)',
      run: (args) => {
        if (args.includes('--mail')) {
          window.location.href = `mailto:${personalInfo.emails.primary}?subject=Hello%20Samprit`;
          return { lines: [['success', 'opening your mail app…']] };
        }
        return {
          lines: [
            ['accent', '▍ contact'],
            ['', `${padRight('email', 11)}${personalInfo.emails.primary}`],
            ['', `${padRight('phone', 11)}${personalInfo.phone}`],
            ['', `${padRight('location', 11)}${personalInfo.location}`],
            ['muted', ''],
            ['success', 'fastest reply: email · usually within 24h'],
            ['muted', 'or run: contact --mail'],
          ],
        };
      },
    },
    social: {
      description: 'GitHub, LinkedIn and my website',
      run: () => {
        const rows = [
          ['github', socialLinks.github],
          ['linkedin', socialLinks.linkedin],
          ['website', socialLinks.website],
        ].filter(([, url]) => Boolean(url));
        return {
          lines: [
            ['accent', '▍ social'],
            ...rows.map(([label, url]) => ['', `${padRight(label, 11)}${url}`]),
            ['muted', ''],
            ['muted', 'the footer links open these too'],
          ],
        };
      },
    },
    resume: {
      description: 'open my resume PDF in a new tab',
      run: () => {
        window.open(personalInfo.resumeUrl, '_blank', 'noopener,noreferrer');
        return { lines: [['success', `opening ${personalInfo.resumeUrl}…`]] };
      },
    },
    mood: {
      description: 'the songs on loop while I build (mood <set> [n] opens one)',
      run: (args) => {
        const query = (args[0] || '').toLowerCase();

        if (!query) {
          const width = Math.max(...moodMeta.map((entry) => entry.label.length)) + 2;
          return {
            lines: [
              ['accent', '▍ mood deck — pick a set'],
              ['muted', ''],
              ...moodMeta.map((entry) => [
                '',
                `  ${padRight(entry.label, width)}${entry.emoji}  ${entry.count} tracks · ${entry.tagline}`,
              ]),
              ['muted', ''],
              ['muted', `browse one with: mood ${moodMeta[0].id} · playback lives in the mood deck`],
            ],
          };
        }

        const match = moodMeta.find(
          (entry) => entry.id === query || entry.label.toLowerCase() === query,
        );

        if (!match) {
          return {
            lines: [
              ['error', `no mood set matches "${args[0]}"`],
              ['muted', `try: ${moodMeta.map((entry) => entry.id).join(' · ')}`],
            ],
          };
        }

        // The discography itself ships as its own chunk — only fetched when a
        // set is actually opened here (the mood deck loads it the same way).
        return import('../data/moodData')
          .then((mod) => {
            const tab = mod.moodContent.tabs.find((entry) => entry.id === match.id);
            const songs = [];
            if (tab.groups) {
              tab.groups.forEach((group) =>
                group.albums.forEach((album) => album.songs.forEach((song) => songs.push({ song, artist: group.artist }))),
              );
            } else {
              tab.songs.forEach((song) => songs.push({ song, artist: null }));
            }

            const index = Number.parseInt(args[1], 10);
            if (Number.isInteger(index) && !songs[index - 1]) {
              return {
                lines: [
                  ['error', `${match.label} has ${songs.length} tracks — pick 1-${songs.length}`],
                ],
              };
            }

            if (Number.isInteger(index)) {
              const picked = songs[index - 1];
              const url =
                picked.song.kind === 'playlist'
                  ? picked.song.url
                  : `https://open.spotify.com/track/${picked.song.id}`;
              window.open(url, '_blank', 'noopener,noreferrer');
              const who = picked.artist ? ` — ${picked.artist}` : '';
              return {
                lines: [
                  ['success', `opening ${picked.song.title}${who}`],
                  ['muted', url],
                ],
              };
            }

            const cap = 40;
            return {
              lines: [
                ['accent', `▍ ${match.label} — ${songs.length} tracks`],
                ['muted', ''],
                ...songs.slice(0, cap).map((entry, position) => [
                  '',
                  `  ${padRight(String(position + 1).padStart(2, '0'), 4)}${entry.song.title} — ${entry.artist || 'playlist'}`,
                ]),
                ...(songs.length > cap
                  ? [
                      ['muted', ''],
                      ['muted', `  … +${songs.length - cap} more — the full rail lives in the mood deck`],
                    ]
                  : []),
                ['muted', ''],
                ['muted', `open one with: mood ${match.id} 2 · the full player lives in the mood deck`],
              ],
            };
          })
          .catch(() => ({
            lines: [
              ['error', 'could not load the discography — playback lives in the mood deck'],
            ],
          }));
      },
    },
    theme: {
      description: 'switch this site between dark and light',
      run: (args) => {
        const requested = (args[0] || '').toLowerCase();
        if (requested && requested !== 'dark' && requested !== 'light') {
          return {
            lines: [
              ['error', `unknown theme "${args[0]}"`],
              ['muted', 'usage: theme dark · theme light · theme (toggles)'],
            ],
          };
        }
        const nextTheme = requested || (theme === 'dark' ? 'light' : 'dark');
        setTheme(nextTheme);
        return {
          lines: [
            ['success', `theme → ${nextTheme}`],
            ['muted', 'the navbar toggle follows along · saved for your next visit'],
          ],
        };
      },
    },
    history: {
      description: 'commands you have run in this session',
      run: () => {
        const entries = history;
        if (!entries.length) {
          return { lines: [['muted', 'no commands yet — type "help" to start']] };
        }
        return {
          lines: [
            ['accent', '▍ history'],
            ...entries.map((entry, index) => ['muted', `${String(index + 1).padStart(2, '0')}  ${entry}`]),
          ],
        };
      },
    },
    clear: {
      description: 'wipe the screen',
      run: () => ({ clear: true, lines: [] }),
    },
    sudo: {
      description: 'you know you want to',
      run: () => ({
        lines: [['error', 'permission denied: nice try 😄 this incident has been reported to the portfolio owner']],
      }),
    },
    coffee: {
      description: 'brew some fuel',
      run: () => ({ lines: [['success', '☕ brewing… done. now shipping features.']] }),
    },

  };

  const help = {
    description: 'list every available command',
    run: () => {
      const names = Object.keys(definitions);
      const width = Math.max(...names.map((name) => name.length)) + 2;
      const lines = [['accent', '▍ available commands'], ['muted', '']];
      names.forEach((name) => {
        lines.push(['', `  ${padRight(name, width)}${definitions[name].description}`]);
      });
      lines.push(['muted', '']);
      lines.push(['muted', 'examples: skills frontend · projects 3 · open kickresume · contact --mail · theme dark']);
      return { lines };
    },
  };

  return { help, ...definitions };
};

const Terminal = () => {
  const screenRef = useRef(null);
  const inputRef = useRef(null);
  const { theme, setTheme } = useTheme();

  const [lines, setLines] = useState(() =>
    bannerLines().map(([kind, value], index) => ({ id: `seed-${index}`, kind, text: value })),
  );
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const commands = useMemo(
    () => buildCommands({ theme, setTheme, history }),
    [theme, setTheme, history],
  );

  useEffect(() => {
    const screen = screenRef.current;
    if (screen) screen.scrollTop = screen.scrollHeight;
  }, [lines]);

  const pushLines = (entries) => {
    setLines((previous) => [...previous, ...entries.map(([kind, value]) => createLine(kind, value))]);
  };

  const executeCommand = (raw) => {
    const [name, ...args] = raw.split(/\s+/);
    const command = name ? commands[name.toLowerCase()] : null;

    if (!command) {
      return {
        lines: [
          ['error', `command not found: ${name || ''}`],
          ['muted', 'type "help" to see everything this shell can do'],
        ],
      };
    }

    return command.run(args);
  };

  const runCommand = (raw) => {
    const command = raw.trim();
    if (!command) return;

    const result = executeCommand(command);

    // Some commands (the mood deck's discographies) load their data chunk
    // first and resolve with their lines a tick later.
    if (result && typeof result.then === 'function') {
      pushLines([['command', command]]);
      result
        .then((resolved) => {
          if (resolved.clear) {
            setLines([]);
          } else {
            pushLines(resolved.lines || []);
          }
        })
        .catch((error) => {
          pushLines([['error', `command failed: ${(error && error.message) || error}`]]);
        });
    } else if (result.clear) {
      setLines([]);
    } else {
      pushLines([['command', command], ...(result.lines || [])]);
    }

    setHistory((previous) => [command, ...previous].slice(0, HISTORY_LIMIT));
    setHistoryIndex(-1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runCommand(inputValue);
    setInputValue('');
  };

  const focusInput = () => {
    const selection = window.getSelection();
    if (selection && String(selection).length) return; // let visitors copy output first
    inputRef.current?.focus();
  };

  const moveThroughHistory = (step) => {
    if (!history.length) return;
    const nextIndex = Math.min(Math.max(historyIndex + step, -1), history.length - 1);
    setHistoryIndex(nextIndex);
    setInputValue(nextIndex === -1 ? '' : history[nextIndex]);
  };

  const completeInput = () => {
    const partial = inputValue.trim().toLowerCase();
    if (!partial) return;
    const matches = Object.keys(commands).filter((name) => name.startsWith(partial));
    if (matches.length === 1) {
      setInputValue(matches[0]);
    } else if (matches.length > 1) {
      pushLines([['muted', matches.join('   ')]]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveThroughHistory(1);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveThroughHistory(-1);
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      completeInput();
      return;
    }
    if (event.key === 'Escape') setInputValue('');
  };

  const renderLine = (line) =>
    line.kind === 'command' ? (
      <div key={line.id} className="terminal-line terminal-line-command">
        <span className="terminal-prompt">
          <span className="terminal-prompt-user">{PROMPT_USER}</span>
          {PROMPT_SUFFIX}
        </span>{' '}
        {line.text}
      </div>
    ) : (
      <div key={line.id} className={`terminal-line${line.kind ? ` terminal-line-${line.kind}` : ''}`}>
        {line.text}
      </div>
    );

  const themeChip = theme === 'dark' ? 'theme light' : 'theme dark';
  const chips = ['help', 'whoami', 'skills', 'projects', 'experience', 'mood', 'contact', themeChip];

  return (
    <section
      id="terminal"
      className="relative w-full overflow-hidden bg-[#f6f5f2] px-6 pb-32 pt-28 font-sans md:px-12 md:pt-36"
    >
      <div className="pointer-events-none absolute right-[-9rem] top-24 h-96 w-96 rounded-full bg-amber-700/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div data-aos="fade-up" className="max-w-3xl">
          <span className="inline-block rounded-full border border-slate-300 bg-white px-5 py-1.5 text-sm font-bold text-slate-600 shadow-sm">
            INTERACTIVE SHELL
          </span>
          <h2 className="mt-7 text-4xl font-black leading-[1.02] tracking-tight text-slate-900 md:text-6xl">
            Talk To My Portfolio
          </h2>
          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-slate-600 md:text-lg">
            A playful but real terminal wired to this site&rsquo;s data. Run{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-amber-700">whoami</code>, browse{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-amber-700">projects</code>, or flip the whole theme with{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-amber-700">theme dark</code>.
          </p>
        </div>

        <div data-aos="fade-up" data-aos-delay="120" className="mt-12">
          <div className="terminal-shell" onClick={focusInput}>
            <div className="terminal-bar">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
              <span className="terminal-title">samprt — interactive shell</span>
              <span className="terminal-badge">v2.0</span>
            </div>

            <div
              ref={screenRef}
              className="terminal-screen"
              role="log"
              aria-live="polite"
              aria-label="Terminal output"
            >
              {lines.map(renderLine)}

              <form className="terminal-row" onSubmit={handleSubmit}>
                <span className="terminal-prompt" aria-hidden="true">
                  <span className="terminal-prompt-user">{PROMPT_USER}</span>
                  {PROMPT_SUFFIX}
                </span>
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={handleKeyDown}
                  className="terminal-input"
                  placeholder="type a command and press Enter…"
                  aria-label="Terminal command input"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
              </form>
            </div>

            <div className="terminal-chips">
              {chips.map((command) => (
                <button
                  key={command}
                  type="button"
                  className="terminal-chip"
                  onClick={() => {
                    runCommand(command);
                    inputRef.current?.focus();
                  }}
                >
                  {command}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            ↑/↓ history · Tab autocomplete · click the shell to type
          </p>
        </div>
      </div>
    </section>
  );
};

export default Terminal;


