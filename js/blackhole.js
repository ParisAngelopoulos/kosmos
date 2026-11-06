// A black hole in WebGL. Every pixel sends a ray of light from the camera and follows it
// through the curved space around the black hole (Schwarzschild), step by step. Rays that come
// too close fall in (black); rays that cross the plane of the disk pick up the light of the hot
// gas; the rest reach the stars behind it, bent. Units: the event horizon has radius 1.
(function () {
  const canvas = document.getElementById('zwart-gat');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) { document.body.classList.add('geen-webgl'); return; }

  const vertex = `
    attribute vec2 aPos;
    void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
  `;

  const fragment = `
    precision highp float;
    uniform vec2 uRes;
    uniform float uTime;
    uniform vec3 uCam;
    uniform mat3 uRot;

    float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(vec3(i, 1.0)), b = hash(vec3(i + vec2(1.0, 0.0), 1.0));
      float c = hash(vec3(i + vec2(0.0, 1.0), 1.0)), d = hash(vec3(i + vec2(1.0, 1.0), 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Stars and a faint band of the Milky Way in a direction. The sky is cut into cells of
    // longitude and latitude; some cells have a star, always well inside the cell, so it is never cut off.
    vec3 sky(vec3 d) {
      vec3 col = vec3(0.0);
      vec2 sph = vec2(atan(d.z, d.x), asin(clamp(d.y, -1.0, 1.0)));
      for (int layer = 0; layer < 2; layer++) {
        float scale = layer == 0 ? 40.0 : 90.0; // cells per radian
        vec2 g = sph * scale;
        vec2 cell = floor(g);
        vec2 f = fract(g);
        float h = hash(vec3(cell, float(layer)));
        if (h > 0.93) {
          vec2 c = 0.3 + 0.4 * vec2(hash(vec3(cell, 7.0)), hash(vec3(cell, 9.0)));
          // Longitude cells get narrower towards the poles: correct for that so stars stay round
          vec2 off = (f - c) * vec2(max(cos(sph.y), 0.2), 1.0);
          float b = smoothstep(0.16, 0.0, length(off)) * (h - 0.93) * 18.0;
          vec3 tint = mix(vec3(0.7, 0.8, 1.0), vec3(1.0, 0.85, 0.7), hash(vec3(cell, 3.0)));
          col += tint * b * (layer == 0 ? 1.0 : 0.55);
        }
      }
      float band = exp(-pow(dot(d, normalize(vec3(0.2, 1.0, 0.35))) * 4.0, 2.0));
      col += vec3(0.05, 0.045, 0.06) * band * (0.6 + 0.4 * noise(d.xz * 9.0));
      return col;
    }

    // The glowing gas of the disk where a ray crosses it
    vec4 disk(vec3 p, vec3 dir) {
      float r = length(p.xz);
      if (r < 3.0 || r > 15.0) return vec4(0.0);
      float angle = atan(p.z, p.x);
      // Gas closer in turns faster (Kepler): the pattern winds up over time
      float spin = uTime * 0.9 / pow(r, 1.5);
      float streaks = noise(vec2(r * 2.2, (angle + spin) * 6.0)) * 0.6 + noise(vec2(r * 6.0, (angle + spin) * 14.0)) * 0.4;
      // Hot inside, cooler outside; the edges fade
      float heat = pow(3.0 / r, 1.6);
      float edge = smoothstep(3.0, 3.6, r) * (1.0 - smoothstep(10.0, 15.0, r));
      // Doppler: the side that moves towards us is brighter and bluer
      vec3 orbit = normalize(vec3(-p.z, 0.0, p.x));
      float towards = dot(orbit, -dir);
      float boost = pow(1.0 + 0.55 * towards, 3.0);
      vec3 hot = vec3(1.0, 0.92, 0.8), warm = vec3(1.0, 0.55, 0.2), cool = vec3(0.7, 0.2, 0.05);
      vec3 col = mix(cool, mix(warm, hot, heat), clamp(heat * 1.4, 0.0, 1.0));
      col = mix(col, col * vec3(0.8, 0.9, 1.15), clamp(towards, 0.0, 1.0) * 0.5);
      float a = edge * (0.35 + 0.65 * streaks);
      return vec4(col * heat * boost * 2.6 * (0.55 + 0.75 * streaks), clamp(a, 0.0, 1.0));
    }

    void main() {
      // The black hole a little above the middle, so the title below stays readable
      vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y - vec2(0.0, 0.1);
      vec3 pos = uCam;
      vec3 vel = normalize(uRot * vec3(uv, 1.7));
      vec3 c = cross(pos, vel);
      float h2 = dot(c, c);
      vec3 col = vec3(0.0);
      float alpha = 0.0;
      bool fell = false;
      for (int i = 0; i < 260; i++) {
        float r2 = dot(pos, pos);
        if (r2 < 1.0) { fell = true; break; }
        // Far away and flying off: from here the ray goes (almost) straight on
        if (alpha > 0.99 || (r2 > 900.0 && dot(pos, vel) > 0.0)) break;
        // Bigger steps far away, small steps near the black hole
        float dt = clamp(0.06 * r2, 0.03, 0.9);
        vec3 prev = pos;
        // Leapfrog: half a kick, a step, half a kick. Much steadier than one plain step, so the
        // stars behind the black hole stay sharp points instead of smears
        vel += -0.75 * h2 * pos / pow(r2, 2.5) * dt;
        pos += vel * dt;
        float r2b = dot(pos, pos);
        vel += -0.75 * h2 * pos / pow(r2b, 2.5) * dt;
        if (prev.y * pos.y < 0.0) {
          vec3 hit = mix(prev, pos, prev.y / (prev.y - pos.y));
          vec4 d = disk(hit, normalize(vel));
          col += (1.0 - alpha) * d.rgb * d.a;
          alpha += (1.0 - alpha) * d.a;
        }
      }
      if (!fell) col += (1.0 - alpha) * sky(normalize(vel));
      // Soft glow and tone mapping
      col = 1.0 - exp(-col * 1.1);
      col = pow(col, vec3(0.4545));
      gl_FragColor = vec4(col, 1.0);
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
    return;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const u = name => gl.getUniformLocation(program, name);
  const uRes = u('uRes'), uTime = u('uTime'), uCam = u('uCam'), uRot = u('uRot');

  // A lower resolution on small or slow screens: every pixel follows hundreds of steps
  let scale = Math.min(window.devicePixelRatio || 1, 1.5) * (window.innerWidth < 760 ? 0.6 : 0.8);
  function resize() {
    canvas.width = Math.max(2, Math.round(canvas.clientWidth * scale));
    canvas.height = Math.max(2, Math.round(canvas.clientHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  // The camera circles slowly around; dragging turns it yourself
  const view = { yaw: 0.6, pitch: 0.14, dist: 24, drag: null };
  canvas.addEventListener('pointerdown', e => { view.drag = { x: e.clientX, y: e.clientY, yaw: view.yaw, pitch: view.pitch }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => {
    if (!view.drag) return;
    view.yaw = view.drag.yaw - (e.clientX - view.drag.x) * 0.005;
    view.pitch = Math.max(-1.2, Math.min(1.2, view.drag.pitch + (e.clientY - view.drag.y) * 0.004));
  });
  const release = () => { view.drag = null; };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = true;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(canvas);

  let last = performance.now(), time = 0, slowFrames = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (visible) {
      time += reduced ? 0 : dt;
      if (!view.drag && !reduced) view.yaw += dt * 0.05;
      const cp = Math.cos(view.pitch), sp = Math.sin(view.pitch);
      const cam = [Math.sin(view.yaw) * cp * view.dist, sp * view.dist, Math.cos(view.yaw) * cp * view.dist];
      // Look at the centre: forward, right and up as the columns of the rotation
      const f = cam.map(v => -v / view.dist);
      const rl = Math.hypot(f[2], f[0]);
      const r = [-f[2] / rl, 0, f[0] / rl];
      const up = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform3fv(uCam, cam);
      gl.uniformMatrix3fv(uRot, false, [r[0], r[1], r[2], up[0], up[1], up[2], f[0], f[1], f[2]]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      // Too slow for this device: draw fewer pixels
      if (dt > 0.045 && ++slowFrames > 20 && scale > 0.35) { scale *= 0.8; slowFrames = 0; resize(); }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  document.body.classList.add('webgl-klaar');
})();
