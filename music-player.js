// ============================================================
// DJ SIX – Floating Music Player
// ============================================================

class MusicPlayer {
  constructor() {
    this.songs = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isShuffle = false;
    this.isRepeat = false;
    this.isMinimized = false;
    this.isPlaylistOpen = false;
    this.audio = new Audio();
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.el = null;
    this.init();
  }

  async init() {
    this.render();
    this.bindAudio();
    this.bindDrag();
    await this.loadSongs();
  }

  async loadSongs() {
    // Demo songs while Firebase loads
    this.songs = [
      { id: '1', title: 'Club Nights', artist: 'DJ SIX', cover: 'https://picsum.photos/seed/song1/100/100', audioUrl: '', duration: '4:22' },
      { id: '2', title: 'Lagos Vibes', artist: 'DJ SIX ft. Afrobeats', cover: 'https://picsum.photos/seed/song2/100/100', audioUrl: '', duration: '3:55' },
      { id: '3', title: 'Midnight Mix', artist: 'DJ SIX', cover: 'https://picsum.photos/seed/song3/100/100', audioUrl: '', duration: '5:10' },
      { id: '4', title: 'AfroFusion Vol.1', artist: 'DJ SIX', cover: 'https://picsum.photos/seed/song4/100/100', audioUrl: '', duration: '6:03' },
      { id: '5', title: 'Wedding Bells', artist: 'DJ SIX', cover: 'https://picsum.photos/seed/song5/100/100', audioUrl: '', duration: '4:47' },
    ];
    this.renderPlaylist();
    this.loadTrack(0);
    // Load from Firebase
    try {
      if (typeof db !== 'undefined') {
        const snap = await db.collection('songs').orderBy('createdAt', 'desc').get();
        if (!snap.empty) {
          this.songs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          this.renderPlaylist();
          this.loadTrack(0);
        }
      }
    } catch (e) { /* use demo songs */ }
  }

  render() {
    const el = document.createElement('div');
    el.id = 'music-player';
    el.innerHTML = `
      <div class="player-header" id="player-drag-handle">
        <div class="player-drag-handle">
          <img class="player-mini-cover" id="pm-cover" src="https://picsum.photos/seed/default/100/100" alt="cover">
          <div class="player-mini-info">
            <div class="player-mini-title" id="pm-title">Loading…</div>
            <div class="player-mini-artist" id="pm-artist">DJ SIX</div>
          </div>
        </div>
        <div class="player-header-btns">
          <button class="player-ctrl-btn" id="pm-play-mini" title="Play/Pause">▶</button>
          <button class="player-ctrl-btn" id="pm-minimize" title="Expand">⬆</button>
          <button class="player-ctrl-btn" id="pm-close-btn" title="Close">✕</button>
        </div>
      </div>
      <div class="player-expanded" id="player-expanded">
        <div class="player-visualizer paused" id="player-viz"></div>
        <div class="player-cover-wrapper">
          <div class="player-cover-glow" id="pm-glow"></div>
          <img class="player-cover" id="pm-cover-big" src="https://picsum.photos/seed/default/100/100" alt="cover">
        </div>
        <div class="player-info">
          <div class="player-title" id="pm-title-big">Loading…</div>
          <div class="player-artist" id="pm-artist-big">DJ SIX</div>
        </div>
        <div class="player-progress">
          <div class="progress-bar-track" id="pm-progress-track">
            <div class="progress-bar-fill" id="pm-progress-fill"></div>
          </div>
          <div class="progress-times">
            <span id="pm-current">0:00</span>
            <span id="pm-duration">0:00</span>
          </div>
        </div>
        <div class="player-controls">
          <button class="player-btn" id="pm-shuffle" title="Shuffle">⇌</button>
          <button class="player-btn" id="pm-prev" title="Previous">⏮</button>
          <button class="player-btn player-play-btn" id="pm-play" title="Play/Pause">▶</button>
          <button class="player-btn" id="pm-next" title="Next">⏭</button>
          <button class="player-btn" id="pm-repeat" title="Repeat">↺</button>
        </div>
        <div class="player-volume">
          <span class="player-volume-icon">🔉</span>
          <div class="player-volume-track">
            <div class="player-volume-fill" id="pm-vol-fill"></div>
            <input type="range" id="pm-volume" min="0" max="100" value="70">
          </div>
        </div>
        <div class="player-playlist-toggle" id="pm-playlist-toggle">
          <span>📋 Playlist</span>
          <span id="pm-playlist-arrow">▾</span>
        </div>
        <div class="player-playlist" id="pm-playlist">
          <input type="text" class="player-playlist-search" id="pm-search" placeholder="Search songs…">
          <div id="pm-playlist-items"></div>
        </div>
      </div>`;
    document.body.appendChild(el);
    this.el = el;
    this.buildVisualizer();
    this.bindControls();
  }

  buildVisualizer() {
    const viz = document.getElementById('player-viz');
    if (!viz) return;
    viz.innerHTML = '';
    const heights = [6,10,14,18,14,10,6,12,16,20,16,12,8,14,18,14,8];
    const delays  = [0,.1,.2,.15,.05,.25,.1,.2,.05,.15,.3,.1,.2,.05,.15,.25,.1];
    heights.forEach((h, i) => {
      const bar = document.createElement('div');
      bar.className = 'viz-bar';
      bar.style.cssText = `--h:${h}px;--d:${0.3+delays[i]}s;animation-delay:${delays[i]}s`;
      viz.appendChild(bar);
    });
  }

  bindControls() {
    document.getElementById('pm-play').addEventListener('click', () => this.togglePlay());
    document.getElementById('pm-play-mini').addEventListener('click', () => this.togglePlay());
    document.getElementById('pm-prev').addEventListener('click', () => this.prevTrack());
    document.getElementById('pm-next').addEventListener('click', () => this.nextTrack());
    document.getElementById('pm-shuffle').addEventListener('click', () => this.toggleShuffle());
    document.getElementById('pm-repeat').addEventListener('click', () => this.toggleRepeat());
    document.getElementById('pm-minimize').addEventListener('click', () => this.toggleMinimize());
    document.getElementById('pm-close-btn').addEventListener('click', () => this.toggleMinimize());
    document.getElementById('pm-playlist-toggle').addEventListener('click', () => this.togglePlaylist());
    document.getElementById('pm-progress-track').addEventListener('click', (e) => this.seek(e));
    document.getElementById('pm-volume').addEventListener('input', (e) => this.setVolume(e.target.value));
    document.getElementById('pm-search').addEventListener('input', (e) => this.filterPlaylist(e.target.value));
  }

  bindAudio() {
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.onEnded());
    this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    this.audio.volume = 0.7;
  }

  bindDrag() {
    const handle = document.getElementById('player-drag-handle');
    if (!handle) return;
    handle.addEventListener('mousedown', (e) => {
      if (e.target.closest('.player-ctrl-btn')) return;
      this.isDragging = true;
      const rect = this.el.getBoundingClientRect();
      this.dragOffsetX = e.clientX - rect.left;
      this.dragOffsetY = e.clientY - rect.top;
      this.el.style.transition = 'none';
    });
    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const x = e.clientX - this.dragOffsetX;
      const y = e.clientY - this.dragOffsetY;
      const maxX = window.innerWidth - this.el.offsetWidth;
      const maxY = window.innerHeight - this.el.offsetHeight;
      this.el.style.right = 'auto';
      this.el.style.bottom = 'auto';
      this.el.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
      this.el.style.top  = Math.max(0, Math.min(y, maxY)) + 'px';
    });
    document.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.el.style.transition = '';
    });
    // Touch drag
    handle.addEventListener('touchstart', (e) => {
      if (e.target.closest('.player-ctrl-btn')) return;
      this.isDragging = true;
      const rect = this.el.getBoundingClientRect();
      this.dragOffsetX = e.touches[0].clientX - rect.left;
      this.dragOffsetY = e.touches[0].clientY - rect.top;
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      const x = e.touches[0].clientX - this.dragOffsetX;
      const y = e.touches[0].clientY - this.dragOffsetY;
      this.el.style.right = 'auto';
      this.el.style.bottom = 'auto';
      this.el.style.left = Math.max(0, x) + 'px';
      this.el.style.top  = Math.max(0, y) + 'px';
    }, { passive: true });
    document.addEventListener('touchend', () => { this.isDragging = false; });
  }

  loadTrack(index) {
    if (!this.songs.length) return;
    this.currentIndex = index;
    const song = this.songs[index];
    document.getElementById('pm-title').textContent      = song.title;
    document.getElementById('pm-artist').textContent     = song.artist || 'DJ SIX';
    document.getElementById('pm-title-big').textContent  = song.title;
    document.getElementById('pm-artist-big').textContent = song.artist || 'DJ SIX';
    const coverSrc = song.cover || `https://picsum.photos/seed/${song.id}/100/100`;
    document.getElementById('pm-cover').src     = coverSrc;
    document.getElementById('pm-cover-big').src = coverSrc;
    document.getElementById('pm-duration').textContent = song.duration || '0:00';
    document.getElementById('pm-progress-fill').style.width = '0%';
    document.getElementById('pm-current').textContent = '0:00';
    if (song.audioUrl) {
      this.audio.src = song.audioUrl;
      if (this.isPlaying) this.audio.play().catch(() => {});
    }
    this.highlightPlaylistItem(index);
  }

  togglePlay() {
    if (!this.songs[this.currentIndex]?.audioUrl) {
      showToast('No audio URL set for this track', 'warning');
      this.isPlaying = !this.isPlaying;
      this.updatePlayUI();
      return;
    }
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play().catch(() => showToast('Audio playback requires a valid URL', 'warning'));
      this.isPlaying = true;
    }
    this.updatePlayUI();
  }

  updatePlayUI() {
    const icon = this.isPlaying ? '⏸' : '▶';
    document.getElementById('pm-play').textContent = icon;
    document.getElementById('pm-play-mini').textContent = icon;
    const cover = document.getElementById('pm-cover-big');
    const glow  = document.getElementById('pm-glow');
    const viz   = document.getElementById('player-viz');
    if (this.isPlaying) {
      cover.classList.add('player-cover-spin', 'playing');
      glow.classList.add('playing');
      viz.classList.remove('paused');
    } else {
      cover.classList.remove('playing');
      glow.classList.remove('playing');
      viz.classList.add('paused');
    }
  }

  prevTrack() {
    let idx = this.currentIndex - 1;
    if (idx < 0) idx = this.songs.length - 1;
    this.loadTrack(idx);
    if (this.isPlaying) this.audio.play().catch(() => {});
  }

  nextTrack() {
    let idx;
    if (this.isShuffle) {
      idx = Math.floor(Math.random() * this.songs.length);
    } else {
      idx = (this.currentIndex + 1) % this.songs.length;
    }
    this.loadTrack(idx);
    if (this.isPlaying) this.audio.play().catch(() => {});
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    document.getElementById('pm-shuffle').classList.toggle('active', this.isShuffle);
  }

  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    this.audio.loop = this.isRepeat;
    document.getElementById('pm-repeat').classList.toggle('active', this.isRepeat);
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    this.el.classList.toggle('minimized', this.isMinimized);
    document.getElementById('pm-minimize').textContent = this.isMinimized ? '⬇' : '⬆';
  }

  togglePlaylist() {
    this.isPlaylistOpen = !this.isPlaylistOpen;
    document.getElementById('pm-playlist').classList.toggle('open', this.isPlaylistOpen);
    document.getElementById('pm-playlist-arrow').textContent = this.isPlaylistOpen ? '▴' : '▾';
  }

  seek(e) {
    const track = document.getElementById('pm-progress-track');
    const rect = track.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (this.audio.duration) {
      this.audio.currentTime = ratio * this.audio.duration;
    }
  }

  setVolume(val) {
    this.audio.volume = val / 100;
    document.getElementById('pm-vol-fill').style.width = val + '%';
  }

  updateProgress() {
    const { currentTime, duration } = this.audio;
    if (!duration) return;
    const pct = (currentTime / duration) * 100;
    document.getElementById('pm-progress-fill').style.width = pct + '%';
    document.getElementById('pm-current').textContent = this.formatTime(currentTime);
  }

  updateDuration() {
    document.getElementById('pm-duration').textContent = this.formatTime(this.audio.duration);
  }

  onEnded() {
    if (this.isRepeat) return;
    this.nextTrack();
  }

  formatTime(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  renderPlaylist(filter = '') {
    const container = document.getElementById('pm-playlist-items');
    if (!container) return;
    const filtered = this.songs.filter(s =>
      s.title.toLowerCase().includes(filter.toLowerCase()) ||
      (s.artist || '').toLowerCase().includes(filter.toLowerCase())
    );
    container.innerHTML = filtered.map((s, i) => `
      <div class="playlist-item ${i === this.currentIndex ? 'active' : ''}" data-index="${this.songs.indexOf(s)}">
        <img class="playlist-item-thumb" src="${s.cover || `https://picsum.photos/seed/${s.id}/30/30`}" alt="">
        <span class="playlist-item-title">${s.title}</span>
        <span class="playlist-item-dur">${s.duration || ''}</span>
      </div>`).join('');
    container.querySelectorAll('.playlist-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index);
        this.loadTrack(idx);
        if (this.isPlaying) this.audio.play().catch(() => {});
      });
    });
  }

  highlightPlaylistItem(index) {
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
      item.classList.toggle('active', parseInt(item.dataset.index) === index);
    });
  }

  filterPlaylist(query) {
    this.renderPlaylist(query);
  }

  addSong(song) {
    this.songs.push(song);
    this.renderPlaylist();
    if (this.songs.length === 1) this.loadTrack(0);
  }

  removeSong(id) {
    this.songs = this.songs.filter(s => s.id !== id);
    this.renderPlaylist();
    if (this.currentIndex >= this.songs.length) this.currentIndex = 0;
    if (this.songs.length) this.loadTrack(this.currentIndex);
  }
}

// Init player on DOM ready
let musicPlayer;
document.addEventListener('DOMContentLoaded', () => {
  musicPlayer = new MusicPlayer();
});
