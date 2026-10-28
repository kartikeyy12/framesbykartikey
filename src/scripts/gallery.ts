const root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion: reduce)");

/* Page tone follows the section crossing the middle of the viewport. */
const tone = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) root.dataset.tone = (e.target as HTMLElement).dataset.tone ?? "light";
    }
  },
  { rootMargin: "-50% 0px -50% 0px" },
);
document.querySelectorAll("section[data-tone], footer[data-tone]").forEach((el) => tone.observe(el));

/* Viewer: native <dialog> gives focus trapping, Esc and inert background. */
const dlg = document.querySelector<HTMLDialogElement>("#viewer");
if (dlg) {
  const img = dlg.querySelector<HTMLImageElement>("#v-img")!;
  const count = dlg.querySelector<HTMLElement>("#v-count")!;
  const stage = dlg.querySelector<HTMLElement>(".v-stage")!;
  let list: HTMLAnchorElement[] = [];
  let idx = 0;
  let opener: HTMLAnchorElement | null = null;

  const wrap = (i: number) => (i + list.length) % list.length;

  const load = (i: number) => {
    idx = wrap(i);
    const a = list[idx];
    const thumb = a.querySelector("img")!;
    img.style.setProperty("--ar", a.dataset.ar!);
    img.style.setProperty("--nw", a.dataset.nw!);
    img.style.backgroundColor = a.style.getPropertyValue("--tint");
    img.style.backgroundImage = thumb.style.backgroundImage;
    img.sizes = "100vw";
    img.srcset = a.dataset.srcset!;
    img.alt = a.dataset.alt!;
    count.textContent = `${idx + 1} / ${list.length} · ${a.dataset.label}`;
    for (const j of [idx + 1, idx - 1]) {
      const n = list[wrap(j)];
      const pre = new Image();
      pre.sizes = "100vw";
      pre.srcset = n.dataset.srcset!;
    }
  };

  const open = (a: HTMLAnchorElement) => {
    opener = a;
    list = [...document.querySelectorAll<HTMLAnchorElement>(`a[data-photo][data-set="${a.dataset.set}"]:not([data-field])`)];
    dlg.showModal();
    load(Math.max(0, list.findIndex((x) => x.href === a.href)));
    if (!reduce.matches) {
      const from = a.querySelector("img")!.getBoundingClientRect();
      const to = img.getBoundingClientRect();
      img.animate(
        [
          { transformOrigin: "0 0", transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})` },
          { transformOrigin: "0 0", transform: "none" },
        ],
        { duration: 450, easing: "cubic-bezier(.2,.7,.1,1)" },
      );
    }
  };

  const step = (d: number) => {
    load(idx + d);
    if (!reduce.matches) img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240 });
  };

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = (e.target as Element).closest<HTMLAnchorElement>("a[data-photo]");
    if (!a) return;
    e.preventDefault();
    open(a);
  });
  dlg.querySelector("#v-prev")!.addEventListener("click", () => step(-1));
  dlg.querySelector("#v-next")!.addEventListener("click", () => step(1));
  dlg.querySelector("#v-close")!.addEventListener("click", () => dlg.close());
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || e.target === stage) dlg.close();
  });
  dlg.addEventListener("close", () => opener?.focus({ preventScroll: true }));

  let sx = 0;
  let sy = 0;
  stage.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; });
  stage.addEventListener("pointerup", (e) => {
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (e.pointerType === "touch" && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  });
}

/* Home field. Cursor mode (mouse): the plane follows the cursor and the nearest print grows.
   Drag mode (touch, or reduced motion): the plane is dragged and nothing scales.
   Prints are laid out at their largest size (CSS --g times the resting size) and scaled down at rest, so growing never blurs. */
const field = document.querySelector<HTMLElement>(".field");
const plane = field?.querySelector<HTMLElement>(".plane");
if (field && plane) {
  const items = [...plane.querySelectorAll<HTMLElement>(".fi")];
  const cursorMode = matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce.matches;
  const ease = reduce.matches ? 1 : 0.08;
  let W = 0, H = 0, PW = 0, PH = 0, G = 1, R = 300;
  let px = 0, py = 0, tx = 0, ty = 0, mx = -9999, my = -9999;
  let cx: number[] = [], cy: number[] = [], sc: number[] = [];
  let raf = 0, visible = true;
  const clampX = (v: number) => Math.min(0, Math.max(W - PW, v));
  const clampY = (v: number) => Math.min(0, Math.max(H - PH, v));

  const loop = () => {
    raf = 0;
    px += (tx - px) * ease;
    py += (ty - py) * ease;
    // CSS anchors the plane's top-left at the field centre; px/py are the plane's position in field coordinates.
    plane.style.transform = `translate3d(${px - W / 2}px, ${py - H / 2}px, 0)`;
    let delta = Math.abs(tx - px) + Math.abs(ty - py);
    items.forEach((el, i) => {
      let target = 1;
      if (cursorMode && mx > -1000 && G > 1) {
        const t = Math.max(0, 1 - Math.hypot(px + cx[i] - mx, py + cy[i] - my) / R);
        target = 1 + (G - 1) * t * t * (3 - 2 * t);
      }
      delta += Math.abs(target - sc[i]);
      sc[i] += (target - sc[i]) * 0.14;
      el.style.transform = `scale(${(sc[i] / G).toFixed(4)})`;
      el.style.zIndex = sc[i] > 1 + (G - 1) * 0.3 ? "2" : "1";
    });
    if (delta > 0.5) kick();
  };
  const kick = () => { if (!raf && visible) raf = requestAnimationFrame(loop); };

  const measure = () => {
    W = field.clientWidth; H = field.clientHeight; PW = plane.offsetWidth; PH = plane.offsetHeight;
    G = parseFloat(getComputedStyle(field).getPropertyValue("--g")) || 1;
    R = Math.min(420, Math.max(220, W * 0.22));
    cx = items.map((el) => el.offsetLeft + el.offsetWidth / 2);
    cy = items.map((el) => el.offsetTop + el.offsetHeight / 2);
    sc = items.map(() => 1);
    px = tx = (W - PW) / 2;
    py = ty = (H - PH) / 2;
    kick();
  };
  new ResizeObserver(measure).observe(field);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }).observe(field);

  if (cursorMode) {
    field.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = field.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      tx = (W - PW) * (mx / W); ty = (H - PH) * (my / H);
      kick();
    });
    field.addEventListener("pointerleave", () => { mx = my = -9999; kick(); });
  } else {
    field.classList.add("is-drag");
    let down = false, sx = 0, sy = 0, ox = 0, oy = 0, moved = 0;
    field.addEventListener("pointerdown", (e) => { down = true; moved = 0; sx = e.clientX; sy = e.clientY; ox = tx; oy = ty; });
    field.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      moved = Math.max(moved, Math.hypot(dx, dy));
      tx = clampX(ox + dx); ty = clampY(oy + dy);
      kick();
    });
    for (const t of ["pointerup", "pointercancel"]) field.addEventListener(t, () => { down = false; });
    field.addEventListener("click", (e) => { if (moved > 8) { e.preventDefault(); e.stopPropagation(); } }, true);
  }
}
