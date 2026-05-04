(function() {
  function initPaeCarousel() {
    var track = document.getElementById('pae-track');
    if (!track || track.dataset.init) return;
    track.dataset.init = '1';

    // ─── VIDEOS ───────────────────────────────────────────────
    // Replace the placeholder URLs below when the new videos are ready.
    var shortsData = [
      { role: 'Art Recup',   src: 'https://placealemploi.ca/wp-content/uploads/2026/04/sashiko.mp4' },
      { role: 'Ebénisterie', src: 'https://placealemploi.ca/wp-content/uploads/2026/04/sashiko.mp4' }, // TODO: remplacer par la vidéo Ébénisterie
      { role: 'Robotique',   src: 'https://placealemploi.ca/wp-content/uploads/2026/04/sashiko.mp4' }  // TODO: remplacer par la vidéo Robotique
    ];
    // ──────────────────────────────────────────────────────────

    var dotsEl     = document.getElementById('pae-dots');
    var currentIdx = Math.floor(shortsData.length / 2);
    var slideWidth = 304;

    shortsData.forEach(function(data, index) {
      var slide = document.createElement('div');
      slide.className = 'pae-slide inactive';
      slide.innerHTML =
        '<div class="pae-media">' +
          '<video class="pae-thumb" preload="metadata" muted playsinline src="' + data.src + '#t=0.1"></video>' +
          '<div class="pae-gradient"></div>' +
          '<div class="pae-play-btn"><div class="pae-play-btn-inner">' +
            '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>' +
          '</div></div>' +
          '<div class="pae-text-content">' +
            '<span class="pae-role-badge">' + data.role + '</span>' +
          '</div>' +
        '</div>';

      (function(idx, slideNode, videoSrc) {
        slideNode.addEventListener('click', function() {
          if (idx !== currentIdx) {
            currentIdx = idx;
            updateCarousel(true);
          } else {
            loadVideo(slideNode, videoSrc);
          }
        });
      })(index, slide, data.src);

      track.appendChild(slide);

      var dot = document.createElement('div');
      dot.className = 'pae-dot';
      (function(idx) {
        dot.addEventListener('click', function() { currentIdx = idx; updateCarousel(true); });
      })(index);
      dotsEl.appendChild(dot);
    });

    function loadVideo(slideNode, videoSrc) {
      if (slideNode.querySelector('video.pae-player')) return;
      var media = slideNode.querySelector('.pae-media');
      var thumb = slideNode.querySelector('.pae-thumb');
      var pb = slideNode.querySelector('.pae-play-btn');
      var gr = slideNode.querySelector('.pae-gradient');
      var tc = slideNode.querySelector('.pae-text-content');
      if (thumb) thumb.style.display = 'none';
      if (pb) pb.style.display = 'none';
      if (gr) gr.style.display = 'none';
      if (tc) tc.style.display = 'none';
      var video = document.createElement('video');
      video.className = 'pae-player';
      video.src = videoSrc;
      video.controls = true;
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      media.appendChild(video);
      video.play().catch(function() {});
    }

    function updateCarousel(autoPlay) {
      var slides = track.querySelectorAll('.pae-slide');
      var dots   = dotsEl.querySelectorAll('.pae-dot');
      var offset = -(currentIdx * slideWidth) - (280 / 2);
      track.style.transform = 'translateX(' + offset + 'px)';

      slides.forEach(function(slide, i) {
        var isActive = (i === currentIdx);
        slide.classList.toggle('active', isActive);
        slide.classList.toggle('inactive', !isActive);
        if (!isActive) {
          var video = slide.querySelector('video.pae-player');
          if (video) {
            video.pause();
            video.remove();
            var thumb = slide.querySelector('.pae-thumb');
            var pb = slide.querySelector('.pae-play-btn');
            var gr = slide.querySelector('.pae-gradient');
            var tc = slide.querySelector('.pae-text-content');
            if (thumb) thumb.style.display = '';
            if (pb) pb.style.display = 'flex';
            if (gr) gr.style.display = 'block';
            if (tc) tc.style.display = 'block';
          }
        } else if (autoPlay) {
          var src = shortsData[currentIdx].src;
          setTimeout(function() { loadVideo(slide, src); }, 500);
        }
      });

      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === currentIdx);
      });
    }

    var prevBtn = document.getElementById('pae-prev');
    var nextBtn = document.getElementById('pae-next');
    if (prevBtn) prevBtn.addEventListener('click', function() {
      if (currentIdx > 0) { currentIdx--; updateCarousel(true); }
    });
    if (nextBtn) nextBtn.addEventListener('click', function() {
      if (currentIdx < shortsData.length - 1) { currentIdx++; updateCarousel(true); }
    });

    updateCarousel(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPaeCarousel);
  } else {
    initPaeCarousel();
  }
})();
