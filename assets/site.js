/* Latin Link Medical: small progressive enhancements. No trackers, no external calls. */
(function () {
  var d = document;
  d.documentElement.classList.remove('no-js');

  /* Mobile navigation */
  var toggle = d.querySelector('.nav-t');
  var nav = d.getElementById('nav');
  function closeNav() { if (!toggle) return; toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { closeNav(); toggle.focus(); } });
  }


  /* Services mega-menu (click/tap; hover and focus handled in CSS on desktop) */
  var mt = d.querySelector('.mega-t'), mg = d.getElementById('mega');
  if (mt && mg) {
    mt.addEventListener('click', function () {
      var o = mt.getAttribute('aria-expanded') === 'true';
      mt.setAttribute('aria-expanded', String(!o)); mg.classList.toggle('open', !o);
    });
    d.addEventListener('click', function (e) { if (!e.target.closest('.has-mega')) { mt.setAttribute('aria-expanded', 'false'); mg.classList.remove('open'); } });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mg.classList.contains('open')) { mt.setAttribute('aria-expanded', 'false'); mg.classList.remove('open'); mt.focus(); } });
  }
  var hd = d.querySelector('.hd');
  if (hd) window.addEventListener('scroll', function () { hd.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });

  /* Highlight the current section in the nav, and reveal-on-scroll */
  if ('IntersectionObserver' in window) {
    var links = {};
    d.querySelectorAll('.nav-l > li > a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = links[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) { var s = d.getElementById(id); if (s) so.observe(s); });

    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    d.querySelectorAll('.rv').forEach(function (el) { ro.observe(el); });
  } else {
    d.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* Footer year */
  var y = d.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* Quote form.
     Default: no backend. Builds a pre-filled email to the address in data-mailto.
     To switch on a form service later, set data-endpoint on the <form>:
       - Formspree: data-endpoint="https://formspree.io/f/XXXXXXX"
       - Netlify Forms: add the attribute data-netlify="true" and set data-endpoint="/" (form-name is already included).
     When data-endpoint is set, the form is POSTed there and the email fallback is used only if that fails. */
  var form = d.getElementById('quote-form');
  var status = d.getElementById('form-status');
  if (form) {

  function val(name) { var el = form.elements[name]; return el && el.value ? el.value.trim() : ''; }
  function langs() {
    var out = [];
    form.querySelectorAll('input[name="languages"]:checked').forEach(function (c) { out.push(c.value); });
    var other = val('languages_other');
    if (other) out.push(other);
    return out.join(', ');
  }
  function buildMailto() {
    var to = form.getAttribute('data-mailto');
    var company = val('company');
    var subject = 'Quote request' + (company ? ' - ' + company : '') + ' (latinlinkmedical.com)';
    var lines = [
      'Hello Luke,', '',
      'I would like a quote for a translation project.', '',
      'Name: ' + val('name'),
      'Work email: ' + val('email'),
      'Company: ' + (company || '-'),
      'Languages: ' + (langs() || '-'),
      'Document type: ' + (val('doctype') || '-'),
      'Deadline: ' + (val('deadline') || '-'), '',
      'Message:', val('message') || '-', '',
      '(I will attach the source files to this email.)'
    ];
    return 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\r\n'));
  }
  function openMail() {
    window.location.href = buildMailto();
    status.textContent = 'Your email app should now open with your request filled in. Attach your files and press send. If nothing opened, email projects@latinlink.com directly.';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.elements['bot-field'] && form.elements['bot-field'].value) return; /* honeypot */
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var endpoint = form.getAttribute('data-endpoint');
    if (!endpoint) { openMail(); return; }
    var data = new FormData(form);
    data.set('languages', langs());
    status.textContent = 'Sending…';
    fetch(endpoint, { method: 'POST', body: endpoint === '/' ? new URLSearchParams(data) : data, headers: { 'Accept': 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('send failed');
        form.reset();
        status.textContent = 'Thank you. Your request has been sent and we will reply shortly.';
      })
      .catch(function () { openMail(); });
  });

  }

  /* Newsletter form: same mailto pattern as the quote form, no storage on this site. */
  var news = d.getElementById('news-form');
  if (news) {
    var nstatus = d.getElementById('news-status');
    news.addEventListener('submit', function (e) {
      e.preventDefault();
      if (news.elements['bot-field'] && news.elements['bot-field'].value) return;
      if (!news.checkValidity()) { news.reportValidity(); return; }
      var to = news.getAttribute('data-mailto') || 'projects@latinlink.com';
      var name = (news.elements['name'] && news.elements['name'].value || '').trim();
      var email = (news.elements['email'] && news.elements['email'].value || '').trim();
      var org = (news.elements['organisation'] && news.elements['organisation'].value || '').trim();
      var subject = 'Insights newsletter request' + (org ? ' - ' + org : '');
      var lines = [
        'Hello Luke,', '',
        'Please add me to the Latin Link insights briefing.', '',
        'Name: ' + name,
        'Work email: ' + email,
        'Organisation: ' + (org || '-')
      ];
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\r\n'));
      if (nstatus) nstatus.textContent = 'Your email app should now open with the request filled in. Press send to join the briefing. If nothing opened, email projects@latinlink.com directly.';
    });
  }
})();
