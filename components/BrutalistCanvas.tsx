"use client";

import { useEffect, useRef } from "react";

export default function BrutalistCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Create a 2D HTML5 Canvas with projected 3D wireframe geometry & particles
    // This runs on 100% of devices and avoids WebGL driver/hardware acceleration crashes
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const onResize = () => {
      if (!container) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };
    window.addEventListener("resize", onResize);

    // 3D Icosahedron Vertices
    const phi = (1 + Math.sqrt(5)) / 2;
    const scale = Math.min(width, height) * 0.22;
    const rawVertices: [number, number, number][] = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ].map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return [(x / len) * scale, (y / len) * scale, (z / len) * scale];
    });

    // Edges connecting vertices
    const edges: [number, number][] = [];
    for (let i = 0; i < rawVertices.length; i++) {
      for (let j = i + 1; j < rawVertices.length; j++) {
        const dx = rawVertices[i][0] - rawVertices[j][0];
        const dy = rawVertices[i][1] - rawVertices[j][1];
        const dz = rawVertices[i][2] - rawVertices[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        // Connect if adjacent
        if (dist < scale * 1.15) {
          edges.push([i, j]);
        }
      }
    }

    // Floating particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 1.2,
      y: (Math.random() - 0.5) * height * 1.2,
      z: (Math.random() - 0.5) * 400,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
    }));

    let angleX = 0;
    let angleY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 0.001;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 0.001;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animId: number;

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      angleX += 0.003 + mouseY;
      angleY += 0.004 + mouseX;

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 400;

      // Project vertices
      const projected = rawVertices.map(([x, y, z]) => {
        // Rotate Y
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Rotate X
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        const distance = fov / (fov + z2 + 200);
        return {
          x: centerX + x1 * distance,
          y: centerY + y2 * distance,
          z: z2,
        };
      });

      // Draw wireframe edges
      ctx.lineWidth = 1.2;
      for (const [i, j] of edges) {
        const p1 = projected[i];
        const p2 = projected[j];

        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.1, Math.min(0.7, (avgZ + scale) / (scale * 2)));

        ctx.strokeStyle = `rgba(166, 0, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Draw vertex nodes
      for (const p of projected) {
        ctx.fillStyle = "#c466ff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render floating particles
      ctx.fillStyle = "rgba(196, 102, 255, 0.4)";
      for (const pt of particles) {
        pt.x += pt.speedX;
        pt.y += pt.speedY;

        if (pt.x > width / 2) pt.x = -width / 2;
        if (pt.x < -width / 2) pt.x = width / 2;
        if (pt.y > height / 2) pt.y = -height / 2;
        if (pt.y < -height / 2) pt.y = height / 2;

        const px = centerX + pt.x;
        const py = centerY + pt.y;

        ctx.fillRect(px, py, pt.size, pt.size);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none opacity-60 z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
