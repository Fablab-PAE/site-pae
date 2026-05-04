(function() {
  function initPaeCarousel() {
    var track = document.getElementById('pae-track');
    if (!track || track.dataset.init) return;
    track.dataset.init = '1';

    var shortsData = [
      { role: 'Art Recup',   ytId: 'Ie9KhCyvek8' },
      { role: 'Ebénisterie', ytId: '8KdkLhVvWl4' },
      { role: 'Robotique',   ytId: 'MXAUKMyzt2w' }
    ];

    var dotsEl     = document.getElementById('pae-dots');
    var currentIdx = Math.floor(shortsData.length / 2);
    var slideWidth = 304;

    shortsData.forEach(function(data, index) {
      var slide = document.createElement('div');
      slide.className = 'pae-slide inactive';
      slide.innerHTML =
        '<div class="pae-media">' +
          '<img src="https://img.youtube.com/vi/' + data.ytId + '/maxresdefault.jpg" class="pae-thumb" alt="' + data.role + '">' +
          '<div class="pae-gradient"></div>' +
          '<div class="pae-play-btn"><div class="pae-play-btn-inner">' +
            '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>' +
          '</div></div>' +
          '<div class="pae-text-content">' +
            '<span class="pae-role-badge">' + data.role + '</span>' +
          '</div>' +
        '</div>';

      (function(idx, slideNode, videoId) {
        slideNode.addEventListener('click', function() {
          if (idx !== currentIdx) {
            currentIdx = idx;
            updateCarousel(true);
          } else {
            loadIframe(slideNode, videoId);
          }
        });
      })(index, slide, data.ytId);

      track.appendChild(slide);

      var dot = document.createElement('div');
      dot.className = 'pae-dot';
      (function(idx) {
        dot.addEventListener('click', function() { currentIdx = idx; updateCarousel(true); });
      })(index);
      dotsEl.appendChild(dot);
    });

    function loadIframe(slideNode, videoId) {
      if (slideNode.querySelector('iframe')) return;
      var media = slideNode.querySelector('.pae-media');
      var pb = slideNode.querySelector('.pae-play-btn');
      var gr = slideNode.querySelector('.pae-gradient');
      var tc = slideNode.querySelector('.pae-text-content');
      if (pb) pb.style.display = 'none';
      if (gr) gr.style.display = 'none';
      if (tc) tc.style.display = 'none';
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      media.appendChild(iframe);
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
          var iframe = slide.querySelector('iframe');
          if (iframe) {
            iframe.remove();
            var pb = slide.querySelector('.pae-play-btn');
            var gr = slide.querySelector('.pae-gradient');
            var tc = slide.querySelector('.pae-text-content');
            if (pb) pb.style.display = 'flex';
            if (gr) gr.style.display = 'block';
            if (tc) tc.style.display = 'block';
          }
        } else if (autoPlay) {
          var ytId = shortsData[currentIdx].ytId;
          setTimeout(function() { loadIframe(slide, ytId); }, 500);
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
