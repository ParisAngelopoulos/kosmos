// One planet in 3D, drawn by a single WebGL shader: for every pixel a ray from the camera hits the
// sphere or nothing. The surface is made of noise, so there are no images (the same surfaces as in
// Zonnestelsel, plus lava). The light has the colour of the planet's own star, and hot planets
// glow by themselves. Choose a planet with Planeet.toon(id).
const Planeet = (function () {
  const canvas = document.getElementById('planeet');
  if (!canvas) return { toon() {} };
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false });
  if (!gl) { document.body.classList.add('geen-webgl'); return { toon() {} }; }

  const vertex = 'attribute vec2 aPos; void main() { gl_Position = vec4(aPos, 0.0, 1.0); }';

  const fragment = `
    precision highp float;
    uniform vec2 uRes;
    uniform float uTime, uSpin, uTilt, uDist, uSeed;
    uniform int uType, uClouds;
    uniform vec3 uA, uB, uC, uAtmo;
    uniform vec3 uStar; // colour of the starlight
    uniform vec3 uGlow; // light the planet gives off itself, black for none

    // 3D simplex noise (Ashima Arts / Stefan Gustavson, MIT) and fractal noise on top of it
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }
    float fbm(vec3 p) {
      float sum = 0.0, amp = 0.5;
      for (int i = 0; i < 5; i++) { sum += amp * snoise(p); p *= 2.03; amp *= 0.5; }
      return sum;
    }

    vec3 surface(vec3 p, out float night, out float spec) {
      night = 0.0;
      spec = 0.0;
      float lat = p.y;
      vec3 s = p + uSeed;
      if (uType == 0) {
        float n = fbm(s * 3.0);
        float c = snoise(s * 7.0);
        float rim = smoothstep(0.82, 0.97, 1.0 - abs(c));
        vec3 col = mix(uB, uA, smoothstep(-0.5, 0.5, n));
        col = mix(col, uC, rim * 0.22);
        return col * (1.0 - smoothstep(0.45, 0.85, c) * 0.2);
      }
      if (uType == 1) {
        float n = fbm(vec3(p.x * 2.0, p.y * 6.0, p.z * 2.0) + fbm(p * 2.0 + uTime * 0.01));
        return mix(uB, uC, smoothstep(-0.6, 0.6, n));
      }
      if (uType == 2) {
        float h = fbm(s * 1.3 + fbm(s * 2.2) * 0.7) + 0.08 * snoise(s * 9.0) - 0.04;
        float land = smoothstep(0.02, 0.06, h);
        vec3 ocean = mix(uA * 0.7, uA * 1.35, smoothstep(-0.4, 0.04, h));
        float dry = smoothstep(0.1, 0.45, fbm(s * 3.0 + 4.0)) * (1.0 - smoothstep(0.35, 0.6, abs(lat)));
        vec3 col = mix(ocean, mix(uB, uC, dry), land);
        float ice = smoothstep(0.9, 0.95, abs(lat) + 0.04 * snoise(s * 5.0));
        col = mix(col, vec3(0.92, 0.95, 1.0), ice);
        spec = (1.0 - land) * (1.0 - ice);
        night = land * (1.0 - ice) * smoothstep(0.45, 0.8, snoise(s * 40.0)) * smoothstep(0.2, 0.5, fbm(s * 6.0));
        return col;
      }
      if (uType == 8) {
        // Lava: dark crust with glowing cracks, the cracks slowly shift
        float n = fbm(s * 2.2);
        float crack = 1.0 - smoothstep(0.0, 0.09, abs(snoise(s * 4.0 + vec3(0.0, uTime * 0.02, 0.0))));
        crack = max(crack, 1.0 - smoothstep(0.0, 0.06, abs(snoise(s * 9.0 + 2.0)))) * smoothstep(-0.3, 0.2, n);
        night = crack;
        return mix(uB, uA, smoothstep(-0.4, 0.5, n));
      }
      if (uType == 3) {
        float n = fbm(s * 2.5);
        vec3 col = mix(uA, uC, smoothstep(-0.3, 0.6, n));
        col = mix(col, uB, smoothstep(0.1, 0.45, fbm(s * 1.6 + 2.0)) * 0.8);
        float cap = smoothstep(0.86, 0.9, abs(lat) + 0.03 * snoise(s * 6.0));
        return mix(col, vec3(0.95, 0.92, 0.9), cap);
      }
      // Gas and ice giants: bands of clouds that slowly flow
      float freq = uType == 4 ? 19.0 : uType == 5 ? 11.0 : uType == 6 ? 5.0 : 8.0;
      float turb = uType == 4 ? 0.55 : uType == 5 ? 0.25 : uType == 6 ? 0.1 : 0.3;
      float flow = fbm(vec3(p.x * 3.0, p.y * 12.0, p.z * 3.0) + vec3(uTime * 0.015, 0.0, 0.0));
      float l = lat + flow * turb * 0.12;
      float band = smoothstep(0.2, 0.8, sin(l * freq + 1.3 * sin(l * freq * 0.43 + uSeed)) * 0.5 + 0.5);
      float fine = snoise(vec3(p.x * 2.0, l * 60.0, p.z * 2.0)) * 0.5 + 0.5;
      vec3 col = mix(mix(uB, uC, band), uA, fine * 0.25 + 0.1);
      if (uType == 4) {
        vec2 q = vec2(atan(p.z, p.x) - 0.9, (lat + 0.37) * 2.4);
        float spot = 1.0 - smoothstep(0.12, 0.2 + snoise(vec3(q * 6.0, uTime * 0.05)) * 0.02, length(q * vec2(1.0, 1.6)));
        col = mix(col, vec3(0.62, 0.22, 0.12), spot * 0.85);
      }
      if (uType == 7) {
        vec2 q = vec2(atan(p.z, p.x) + 1.8, (lat + 0.32) * 2.6);
        col = mix(col, uB * 0.45, 1.0 - smoothstep(0.08, 0.14, length(q * vec2(1.0, 1.7))));
      }
      return col;
    }

    // From the tilted, spinning planet to the world and back
    vec3 tiltZ(vec3 v, float a) { float c = cos(a), s = sin(a); return vec3(c * v.x - s * v.y, s * v.x + c * v.y, v.z); }
    vec3 spinY(vec3 v, float a) { float c = cos(a), s = sin(a); return vec3(c * v.x + s * v.z, v.y, -s * v.x + c * v.z); }
    // The camera looks down a little on the planet
    vec3 pitchX(vec3 v, float a) { float c = cos(a), s = sin(a); return vec3(v.x, c * v.y + s * v.z, -s * v.y + c * v.z); }

    void main() {
      // Sized to the narrowest side of the frame, so the planet always fits
      vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
      const float LOOK = 0.18;
      vec3 ro = pitchX(vec3(0.0, 0.0, uDist), LOOK);
      vec3 rd = pitchX(normalize(vec3(uv, -1.6)), LOOK);
      vec3 L = normalize(vec3(-0.9, 0.35, 0.75)); // where the Sun is

      // The sphere (radius 1)
      float b = dot(ro, rd), c = dot(ro, ro) - 1.0, h = b * b - c;
      float tPlanet = h > 0.0 ? -b - sqrt(h) : 1e9;

      vec4 col = vec4(0.0);
      if (tPlanet < 1e8) {
        vec3 n = normalize(ro + rd * tPlanet);
        // Surface coordinates: undo the tilt and the spin
        vec3 p = spinY(tiltZ(n, -uTilt), -uSpin);
        float night, spec;
        vec3 surf = surface(p, night, spec);
        float ndl = dot(n, L);
        float light = smoothstep(-0.08, 0.55, ndl) * 0.85 + max(ndl, 0.0) * 0.15;
        float dark = 1.0 - smoothstep(-0.25, 0.05, ndl);
        vec3 lit = surf * (light * uStar + 0.03);
        vec3 H = normalize(L - rd);
        lit += vec3(1.0, 0.9, 0.75) * pow(max(dot(n, H), 0.0), 60.0) * spec * 0.6 * step(0.0, ndl);
        // City lights or glowing lava: brightest where it is dark
        bool glows = length(uGlow) > 0.0;
        lit += (glows ? uGlow : vec3(1.0, 0.65, 0.3)) * night * (glows ? 0.9 + dark : dark * 1.6);
        // A hot gas giant glows dimly red on its night side
        if (glows && uType != 8) lit += uGlow * 0.22 * dark * (0.7 + 0.3 * surf.r);
        if (uClouds == 1) {
          vec3 cq = p + vec3(uTime * 0.01, 0.0, 0.0);
          float cl = smoothstep(0.12, 0.55, fbm(vec3(cq.x * 3.0, cq.y * 5.5, cq.z * 3.0) + fbm(cq * 2.0) * 0.8)) * 0.6;
          lit = mix(lit, vec3(0.9) * (smoothstep(-0.1, 0.5, ndl) + 0.02), cl * (0.15 + smoothstep(-0.1, 0.5, ndl) * 0.85));
        }
        float rim = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
        lit += uAtmo * uStar * rim * smoothstep(-0.3, 0.6, ndl) * 0.6;
        col = vec4(lit, 1.0);
      }
      // A soft glow of atmosphere just outside the edge
      float miss = length(cross(ro, rd)); // closest distance of the ray to the centre
      if (tPlanet > 1e8 && miss < 1.12 && length(uAtmo) > 0.0) {
        float g = pow(1.0 - (miss - 1.0) / 0.12, 3.0);
        vec3 edge = normalize(ro + rd * -b);
        col = vec4(uAtmo, g * 0.45 * smoothstep(-0.4, 0.6, dot(edge, L)));
      }
      gl_FragColor = vec4(pow(col.rgb, vec3(0.92)), col.a);
    }
  `;

  function shader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  const program = gl.createProgram();
  try {
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch (e) {
    console.error(e);
    document.body.classList.add('geen-webgl');
    return { toon() {} };
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const u = Object.fromEntries(['uRes', 'uTime', 'uSpin', 'uTilt', 'uDist', 'uSeed', 'uType', 'uClouds', 'uA', 'uB', 'uC', 'uAtmo', 'uStar', 'uGlow']
    .map(n => [n, gl.getUniformLocation(program, n)]));

  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  let scale = Math.min(window.devicePixelRatio || 1, 1.5) * (window.innerWidth < 760 ? 0.75 : 0.9);
  function resize() {
    canvas.width = Math.max(2, Math.round(canvas.clientWidth * scale));
    canvas.height = Math.max(2, Math.round(canvas.clientHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  // Also when the canvas itself changes size, for example because the text next to it wraps differently
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);
  resize();

  let current = null, spin = 0, last = performance.now(), time = 0, slow = 0, visible = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  function toon(id) {
    const p = WERELDEN.find(x => x.id === id);
    if (!p) return;
    current = p;
    const [a, b, c] = p.kleuren.map(hex);
    gl.uniform3fv(u.uA, a); gl.uniform3fv(u.uB, b); gl.uniform3fv(u.uC, c);
    gl.uniform3fv(u.uAtmo, p.lucht ? hex(p.lucht) : [0, 0, 0]);
    gl.uniform1i(u.uType, p.type);
    gl.uniform1i(u.uClouds, p.wolken ? 1 : 0);
    gl.uniform1f(u.uSeed, WERELDEN.indexOf(p) * 3.7);
    gl.uniform1f(u.uTilt, p.kanteling * Math.PI / 180);
    gl.uniform3fv(u.uStar, hex(p.licht));
    gl.uniform3fv(u.uGlow, p.gloed ? hex(p.gloed) : [0, 0, 0]);
    gl.uniform1f(u.uDist, 4.6);
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (visible && current) {
      if (!reduced) { time += dt; spin += dt * current.draai; }
      gl.uniform2f(u.uRes, canvas.width, canvas.height);
      gl.uniform1f(u.uTime, time);
      gl.uniform1f(u.uSpin, spin);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (dt > 0.045 && ++slow > 20 && scale > 0.4) { scale *= 0.8; slow = 0; resize(); }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  document.body.classList.add('webgl-klaar');
  return { toon };
})();
