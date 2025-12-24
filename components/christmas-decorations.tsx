"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadTextShape } from "@tsparticles/shape-text";
import { type ISourceOptions } from "@tsparticles/engine";

const ChristmasDecorations = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      try {
        await loadTextShape(engine);
      } catch (e) {
        console.error("Text shape could not be loaded", e);
      }
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "bubble",
          },
        },
        modes: {
          bubble: {
            distance: 200,
            duration: 2,
            opacity: 0.8,
            size: 25,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        move: {
          direction: "bottom",
          enable: true,
          outModes: {
            default: "out",
          },
          random: false,
          speed: { min: 0.5, max: 2 },
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 80,
        },
        opacity: {
          value: { min: 0.4, max: 0.8 },
        },
        shape: {
          type: "text",
          options: {
            text: [
              {
                value: "❄",
                weight: "400",
              },
              {
                value: "❅",
                weight: "400",
              },
              {
                value: "❆",
                weight: "400",
              },
            ],
          },
        },
        size: {
          value: { min: 10, max: 20 },
        },
        wobble: {
          enable: true,
          distance: 10,
          speed: 10,
        },
        rotate: {
          value: { min: 0, max: 360 },
          animation: {
            enable: true,
            speed: 5,
          },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
};

export default ChristmasDecorations;
