// Theme toggle, print to PDF, simple contact form handling
(function(){
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const printBtn = document.getElementById('printBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const yearEl = document.getElementById('year');
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  // Persist theme
  const saved = localStorage.getItem('theme');
  if(saved){ html.setAttribute('data-theme', saved); updateThemeIcon(saved); }

  function updateThemeIcon(mode){
    const icon = document.querySelector('#themeToggle .icon');
    if(!icon) return;
    icon.textContent = mode === 'dark' ? '🌙' : '☀️';
  }

  themeToggle?.addEventListener('click', ()=>{
    const now = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', now);
    localStorage.setItem('theme', now);
    updateThemeIcon(now);
  });

  // Populate print template from on-screen content
  function populatePrintTemplate(){
    const name = document.querySelector('.hero-content .title')?.textContent?.trim() || '';
    const subtitle = document.querySelector('.hero-content .subtitle')?.textContent?.trim() || '';
    const pdfName = document.getElementById('pdfName');
    const pdfSubtitle = document.getElementById('pdfSubtitle');
    if(pdfName) pdfName.textContent = name || 'Resume';
    if(pdfSubtitle) pdfSubtitle.textContent = subtitle || '';

    const pdfProfile = document.getElementById('pdfProfile');
    const summaryParas = Array.from(document.querySelectorAll('#summary p'));
    if(pdfProfile){
      pdfProfile.innerHTML = '';
      summaryParas.forEach(p=>{
        const np = document.createElement('p');
        np.textContent = p.textContent.trim();
        pdfProfile.appendChild(np);
      });
    }

    const pdfContact = document.getElementById('pdfContact');
    if(pdfContact){
      pdfContact.innerHTML = '';
      const phoneLink = document.querySelector('.hero-content .contact a[href^="tel:"]');
      const emailLink = document.querySelector('.hero-content .contact a[href^="mailto:"]');
      const locationBadge = document.querySelector('.edu-aside .badge.neutral');
      if(phoneLink){
        const li = document.createElement('li');
        li.innerHTML = `<span class="pdf-ico">📞</span><span>${phoneLink.textContent.trim().replace(/^\s*📞\s*/,'')}</span>`;
        pdfContact.appendChild(li);
      }
      if(emailLink){
        const li = document.createElement('li');
        li.innerHTML = `<span class="pdf-ico">✉️</span><span>${emailLink.textContent.trim().replace(/^\s*✉️\s*/,'')}</span>`;
        pdfContact.appendChild(li);
      }
      if(locationBadge){
        const li = document.createElement('li');
        li.innerHTML = `<span class="pdf-ico">📍</span><span>${locationBadge.textContent.trim()}</span>`;
        pdfContact.appendChild(li);
      }
    }

    function makeBlock(title){
      const block = document.createElement('div');
      block.className = 'pdf-block';
      const h = document.createElement('h2');
      h.className = 'pdf-heading tri';
      h.textContent = title;
      block.appendChild(h);
      return block;
    }

    const pdfRight = document.getElementById('pdfRight');
    if(pdfRight){
      pdfRight.innerHTML = '';

      const eduBlock = makeBlock('Education');
      const eduTitle = document.querySelector('#education h3')?.textContent?.trim();
      const eduMuted = document.querySelector('#education .muted')?.textContent?.trim();
      const eduItems = Array.from(document.querySelectorAll('#education .list li')).map(li=>li.textContent.trim());
      if(eduTitle){
        const org = document.createElement('h3');
        org.className = 'pdf-org';
        org.textContent = eduTitle.toUpperCase();
        eduBlock.appendChild(org);
      }
      if(eduMuted){
        const muted = document.createElement('p');
        muted.className = 'pdf-muted';
        muted.textContent = eduMuted;
        eduBlock.appendChild(muted);
      }
      eduItems.forEach(t=>{
        const p = document.createElement('p');
        p.textContent = t;
        eduBlock.appendChild(p);
      });
      pdfRight.appendChild(eduBlock);

      const langBlock = makeBlock('Language');
      const langItems = Array.from(document.querySelectorAll('#language .list li'));
      langItems.forEach(li=>{
        const p = document.createElement('p');
        p.innerHTML = li.innerHTML;
        langBlock.appendChild(p);
      });
      pdfRight.appendChild(langBlock);

      const skillsBlock = makeBlock('Computer Skills');
      const skillItems = Array.from(document.querySelectorAll('#skills .tags li'));
      const skillsText = skillItems.map(li=>li.textContent.trim()).join(', ');
      if(skillsText){
        const p = document.createElement('p');
        p.textContent = skillsText;
        skillsBlock.appendChild(p);
      }
      pdfRight.appendChild(skillsBlock);

      const certBlock = makeBlock('Certifications');
      const certItems = Array.from(document.querySelectorAll('#certifications .list li')).map(li=>li.textContent.trim());
      certItems.forEach(t=>{
        const p = document.createElement('p');
        p.textContent = t;
        certBlock.appendChild(p);
      });
      pdfRight.appendChild(certBlock);

      const webdBlock = makeBlock('Web Designing Certification');
      const webdItems = Array.from(document.querySelectorAll('#webdesign .list li')).map(li=>li.textContent.trim());
      webdItems.forEach(t=>{
        const p = document.createElement('p');
        p.textContent = t;
        webdBlock.appendChild(p);
      });
      pdfRight.appendChild(webdBlock);

      const addBlock = makeBlock('Additional Courses');
      const addItems = Array.from(document.querySelectorAll('#additional .list li')).map(li=>li.textContent.trim());
      addItems.forEach(t=>{
        const p = document.createElement('p');
        p.textContent = t;
        addBlock.appendChild(p);
      });
      pdfRight.appendChild(addBlock);

      const objBlock = makeBlock('Career Objectives');
      const objParas = Array.from(document.querySelectorAll('#objectives .card p'));
      objParas.forEach(el=>{
        const p = document.createElement('p');
        p.textContent = el.textContent.trim();
        objBlock.appendChild(p);
      });
      pdfRight.appendChild(objBlock);
    }
  }

  // Print to PDF via browser dialog
  printBtn?.addEventListener('click',()=>{
    try{ populatePrintTemplate(); }catch(e){}
    window.print();
  });

  // Download PDF directly using html2pdf.js
  downloadBtn?.addEventListener('click', async ()=>{
    try{ populatePrintTemplate(); }catch(e){}
  
    const sourceContainer = document.querySelector('.resume-pdf');
    if(!sourceContainer){ window.print(); return; }
  
    // Clone entire print container so we don't disturb on-screen DOM
    const clone = sourceContainer.cloneNode(true);
    // Ensure it is visible for screen media (remove hiding class, force display)
    clone.classList.remove('print-only');
    clone.style.display = 'block';
  
    // Create a wrapper that emulates @page margins via padding
    const wrapper = document.createElement('div');
    // Keep it inside viewport so html2canvas reliably captures it
    wrapper.style.position = 'fixed';
    wrapper.style.left = '0';
    wrapper.style.top = '0';
    wrapper.style.zIndex = '2147483647';
    wrapper.style.opacity = '1'; // must be fully opaque to avoid faint/blank capture
    wrapper.style.pointerEvents = 'none';
  
    // Use px instead of mm to avoid engine inconsistencies
    const mmToPx = (mm) => Math.round((mm * 96) / 25.4);
    const A4_WIDTH_PX = mmToPx(210); // ~794px
    const PAD_V_PX = mmToPx(18); // top/bottom
    const PAD_H_PX = mmToPx(14); // left/right
  
    wrapper.style.width = A4_WIDTH_PX + 'px';
    wrapper.style.padding = `${PAD_V_PX}px ${PAD_H_PX}px`;
    wrapper.style.background = '#ffffff';
  
    // Also enforce pixel width for inner .pdf-page to match the available content area
    const innerPage = clone.querySelector('.pdf-page');
    if (innerPage) {
      const innerWidth = A4_WIDTH_PX - PAD_H_PX * 2;
      innerPage.style.width = innerWidth + 'px';
      innerPage.style.boxSizing = 'border-box';
      innerPage.style.background = '#ffffff';
      innerPage.style.color = '#111827';
    }
  
    // Replace mm-based negative margins on banner with px to avoid unit quirks
    clone.querySelectorAll('.pdf-banner').forEach(b => {
      b.style.marginLeft = (-PAD_H_PX) + 'px';
      b.style.marginRight = (-PAD_H_PX) + 'px';
      b.style.background = '#d1d5db';
    });
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);
  
    // Wait for layout and fonts to settle
    await new Promise(r => requestAnimationFrame(()=>requestAnimationFrame(r)));
    if (document.fonts && document.fonts.ready) {
      try { await Promise.race([document.fonts.ready, new Promise(r=>setTimeout(r,200))]); } catch(_) {}
    }
    // Ensure images inside the clone are fully loaded before capture
    const imgs = Array.from(wrapper.querySelectorAll('img'));
    await Promise.race([
      Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(res => { img.onload = img.onerror = res; }))),
      new Promise(res=>setTimeout(res, 800))
    ]);
  
    // Compute exact rendering dimensions for html2canvas
    const renderWidth = Math.ceil(wrapper.scrollWidth || wrapper.offsetWidth || A4_WIDTH_PX);
    const renderHeight = Math.ceil(wrapper.scrollHeight || wrapper.offsetHeight || mmToPx(297));
  
    const opt = {
      margin:       [0,0,0,0],
      filename:     (document.querySelector('.hero-content .title')?.textContent?.trim() || 'resume') + '.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0, windowWidth: renderWidth, windowHeight: renderHeight },
      pagebreak:    { mode: ['css', 'legacy'] },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
  
    try{
      // Render the wrapper explicitly with html2canvas to avoid html2pdf cloning quirks
      const canvas = await html2canvas(wrapper, opt.html2canvas);
      if (!canvas || canvas.width < 5 || canvas.height < 5) {
        throw new Error('CanvasEmpty');
      }
      const dataUrl = canvas.toDataURL('image/jpeg', opt.image.quality);
      const jsPDFCtor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF || (window.jsPDF && window.jsPDF.jsPDF);
      if (!jsPDFCtor) {
        throw new Error('JSPDFUnavailable');
      }
      const pdf = new jsPDFCtor(opt.jsPDF);
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pageW, pageH, undefined, 'FAST');
      pdf.save(opt.filename);
    } catch(err){
      try{
        if (window.html2pdf) {
          await window.html2pdf().set(opt).from(wrapper).save();
          return;
        }
      }catch(_){/* ignore and continue to final fallback */}
      // Final fallback
      window.print();
    } finally {
      document.body.removeChild(wrapper);
    }
  });

  // Populate when user opens print dialog manually
  window.addEventListener('beforeprint', ()=>{
    try{ populatePrintTemplate(); }catch(e){}
  });

  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name')||'').toString().trim();
    const email = (data.get('email')||'').toString().trim();
    const subject = (data.get('subject')||'').toString().trim();
    const message = (data.get('message')||'').toString().trim();

    if(!name || !email || !subject || !message){
      setStatus('Please fill in all fields.', true); return;
    }

    const body = `Name: ${name}%0AEmail: ${email}%0A%0A${message}`;
    const mailto = `mailto:hello@example.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailto;
    setStatus('Opening your email client...', false);
    form.reset();
  });

  function setStatus(msg, isError){
    if(!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = isError ? '#ef4444' : '';
  }
})();