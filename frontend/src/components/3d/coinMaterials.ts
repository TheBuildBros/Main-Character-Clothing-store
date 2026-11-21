import * as THREE from "three";

export interface BuiltCoinMaterial {
  material: THREE.MeshPhysicalMaterial;
  dispose: () => void;
}

export interface StudioEnvResult {
  texture: THREE.Texture;
  dispose: () => void;
}

type CanvasImageLike =
  | HTMLImageElement
  | HTMLCanvasElement
  | ImageBitmap
  | OffscreenCanvas;

function getImageDimensions(
  image: CanvasImageLike | undefined
): { width: number; height: number } | null {
  if (!image) return null;
  if ("naturalWidth" in image && image.naturalWidth > 0 && image.naturalHeight > 0) {
    return { width: image.naturalWidth, height: image.naturalHeight };
  }
  if ("width" in image && "height" in image && image.width > 0 && image.height > 0) {
    return { width: Number(image.width), height: Number(image.height) };
  }
  return null;
}

function clampByte(value: number): number {
  return value < 0 ? 0 : value > 255 ? 255 : Math.round(value);
}

/**
 * Generates an omnidirectional procedural studio environment map using PMREMGenerator.
 * Surrounds the coin with a slate-navy architectural cyclorama dome and crisp softbox
 * panels on front, back, top, bottom, and sides so obsidian and chrome surfaces always
 * reflect defined studio gradients from every viewing angle (0°–360° and edge-on).
 */
export function createStudioEnvMap(gl: THREE.WebGLRenderer): StudioEnvResult {
  const pmrem = new THREE.PMREMGenerator(gl);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  const disposables: Array<{ dispose: () => void }> = [];

  // Gradient architectural studio dome (prevents pure black reflection dead-zones)
  const domeGeo = new THREE.SphereGeometry(40, 32, 24);
  const posAttr = domeGeo.attributes.position;
  const colors = new Float32Array(posAttr.count * 3);
  const topColor = new THREE.Color("#3b557a");
  const horizonColor = new THREE.Color("#293f5f");
  const bottomColor = new THREE.Color("#1d2c44");
  const tmpColor = new THREE.Color();

  for (let i = 0; i < posAttr.count; i++) {
    const yNorm = posAttr.getY(i) / 40;
    if (yNorm >= 0) {
      tmpColor.lerpColors(horizonColor, topColor, Math.pow(yNorm, 0.75));
    } else {
      tmpColor.lerpColors(horizonColor, bottomColor, Math.pow(-yNorm, 0.75));
    }
    colors[i * 3] = tmpColor.r;
    colors[i * 3 + 1] = tmpColor.g;
    colors[i * 3 + 2] = tmpColor.b;
  }
  domeGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const domeMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.BackSide,
    toneMapped: false,
  });
  envScene.add(new THREE.Mesh(domeGeo, domeMat));
  disposables.push(domeGeo, domeMat);

  // Surrounding HDR-intensity studio softbox panels (front, back, sides, top, bounce)
  const softboxes: Array<{
    position: [number, number, number];
    scale: [number, number];
    color: string;
    intensity: number;
  }> = [
    // Front key & cool fill
    { position: [-9, 5, 11], scale: [12, 10], color: "#FFF8EE", intensity: 2.3 },
    { position: [10, -2, 10], scale: [12, 10], color: "#DCE8FB", intensity: 1.75 },
    { position: [0, 11, 6], scale: [16, 6], color: "#FFFFFF", intensity: 2.1 },
    // Back key & cool fill (ensures back face at 135°–180° has identical clarity)
    { position: [9, 5, -11], scale: [12, 10], color: "#FFF8EE", intensity: 2.3 },
    { position: [-10, -2, -10], scale: [12, 10], color: "#DCE8FB", intensity: 1.75 },
    { position: [0, 11, -6], scale: [16, 6], color: "#FFFFFF", intensity: 2.1 },
    // Equatorial side softboxes (illuminates silver rim and edge-on 90° bevels)
    { position: [-13, 1.5, 0], scale: [11, 12], color: "#F5E7CC", intensity: 1.95 },
    { position: [13, 1.5, 0], scale: [11, 12], color: "#E6EFFB", intensity: 1.95 },
    // Soft warm champagne floor bounce
    { position: [0, -12, 0], scale: [24, 24], color: "#7C6848", intensity: 1.15 },
  ];

  const planeGeo = new THREE.PlaneGeometry(1, 1);
  disposables.push(planeGeo);

  for (const box of softboxes) {
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(box.color).multiplyScalar(box.intensity),
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    const mesh = new THREE.Mesh(planeGeo, mat);
    mesh.position.set(...box.position);
    mesh.scale.set(box.scale[0], box.scale[1], 1);
    mesh.lookAt(0, 0, 0);
    envScene.add(mesh);
    disposables.push(mat);
  }

  const renderTarget = pmrem.fromScene(envScene, 0.035);

  for (const item of disposables) {
    item.dispose();
  }
  pmrem.dispose();

  return {
    texture: renderTarget.texture,
    dispose: () => {
      renderTarget.dispose();
    },
  };
}

/**
 * Derives calibrated PBR albedo, roughness, metalness, and subtle emissive highlight maps
 * from the embedded coin texture so that:
 * - The outer bezel & edge read as bright polished silver with a champagne inner groove
 * - The coin field reads as glossy black obsidian with clearcoat studio reflections
 * - The engraved world-map & gridlines read as contrasted satin pewter with gold-tinted bevels
 * - The central silhouette & "主人公 / MAIN CHARACTER" typography remain crisp at all angles
 */
export function buildCoinPhysicalMaterial(
  originalMaterial: THREE.Material | THREE.Material[]
): BuiltCoinMaterial {
  const sourceMat = Array.isArray(originalMaterial)
    ? originalMaterial[0]
    : originalMaterial;
  const stdMat = sourceMat as THREE.MeshStandardMaterial | undefined;
  const origMap = stdMat?.map ?? null;
  const origNormalMap = stdMat?.normalMap ?? null;

  const dims = getImageDimensions(origMap?.image as CanvasImageLike | undefined);

  if (!origMap || !dims || typeof document === "undefined") {
    const fallbackMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#D5DCE6"),
      map: origMap,
      normalMap: origNormalMap,
      normalScale: new THREE.Vector2(1.5, 1.5),
      metalness: 0.72,
      roughness: 0.24,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.45,
      side: THREE.DoubleSide,
    });

    return {
      material: fallbackMat,
      dispose: () => {
        fallbackMat.dispose();
      },
    };
  }

  const width = dims.width;
  const height = dims.height;

  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = width;
  srcCanvas.height = height;
  const srcCtx = srcCanvas.getContext("2d", { willReadFrequently: true });

  if (!srcCtx) {
    const fallbackMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#D5DCE6"),
      map: origMap,
      normalMap: origNormalMap,
      metalness: 0.72,
      roughness: 0.24,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.45,
      side: THREE.DoubleSide,
    });
    return {
      material: fallbackMat,
      dispose: () => fallbackMat.dispose(),
    };
  }

  srcCtx.drawImage(origMap.image as CanvasImageLike, 0, 0, width, height);
  const srcData = srcCtx.getImageData(0, 0, width, height).data;

  const pixelCount = width * height;
  const lumaBuffer = new Float32Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    const idx = i * 4;
    lumaBuffer[i] =
      0.299 * srcData[idx] +
      0.587 * srcData[idx + 1] +
      0.114 * srcData[idx + 2];
  }

  const colorCanvas = document.createElement("canvas");
  const roughCanvas = document.createElement("canvas");
  const metalCanvas = document.createElement("canvas");
  const emissiveCanvas = document.createElement("canvas");

  for (const c of [colorCanvas, roughCanvas, metalCanvas, emissiveCanvas]) {
    c.width = width;
    c.height = height;
  }

  const colorCtx = colorCanvas.getContext("2d")!;
  const roughCtx = roughCanvas.getContext("2d")!;
  const metalCtx = metalCanvas.getContext("2d")!;
  const emissiveCtx = emissiveCanvas.getContext("2d")!;

  const colorImg = colorCtx.createImageData(width, height);
  const roughImg = roughCtx.createImageData(width, height);
  const metalImg = metalCtx.createImageData(width, height);
  const emissiveImg = emissiveCtx.createImageData(width, height);

  const cOut = colorImg.data;
  const rOut = roughImg.data;
  const mOut = metalImg.data;
  const eOut = emissiveImg.data;

  const halfW = width * 0.5;
  const halfH = height * 0.5;

  for (let y = 0; y < height; y++) {
    const ny = (y - halfH) / halfH;
    const nySq = ny * ny;
    const yUp = y > 0 ? y - 1 : y;
    const yDown = y < height - 1 ? y + 1 : y;

    for (let x = 0; x < width; x++) {
      const nx = (x - halfW) / halfW;
      const r = Math.sqrt(nx * nx + nySq);
      const p = y * width + x;
      const outIdx = p * 4;

      const luma = lumaBuffer[p];
      const xLeft = x > 0 ? x - 1 : x;
      const xRight = x < width - 1 ? x + 1 : x;

      // Local gradient magnitude detects engraved borders for subtle gold/satin edge highlights
      const gx = lumaBuffer[y * width + xRight] - lumaBuffer[y * width + xLeft];
      const gy = lumaBuffer[yDown * width + x] - lumaBuffer[yUp * width + x];
      const edge = Math.min(1, Math.sqrt(gx * gx + gy * gy) / 95);

      let alR = 20;
      let alG = 26;
      let alB = 36;
      let roughness = 0.2;
      let metalness = 0.35;
      let emR = 8;
      let emG = 10;
      let emB = 14;

      if (r >= 0.878) {
        // Outer silver rim & bevel (with subtle champagne-gunmetal accent inside the outer groove)
        const isOuterGroove = r >= 0.936 && r <= 0.955 && luma < 110;
        if (isOuterGroove) {
          alR = 138;
          alG = 122;
          alB = 92;
          roughness = 0.28;
          metalness = 0.86;
          emR = 32;
          emG = 27;
          emB = 18;
        } else {
          alR = 232;
          alG = 238;
          alB = 246;
          roughness = 0.13;
          metalness = 0.94;
          emR = 18;
          emG = 21;
          emB = 26;
        }
      } else if (r >= 0.862) {
        // Inner ring divider groove bordering the polished silver rim
        alR = 168;
        alG = 144;
        alB = 96;
        roughness = 0.26;
        metalness = 0.86;
        emR = 46;
        emG = 38;
        emB = 22;
      } else if (luma > 185) {
        // Central Protagonist figure & "主人公 / MAIN CHARACTER" emblem
        const whiteBlend = Math.min(1, (luma - 185) / 60);
        alR = 244 - edge * 18;
        alG = 240 - edge * 32;
        alB = 232 - edge * 72;
        roughness = 0.22 + (1 - whiteBlend) * 0.08;
        metalness = 0.62 + edge * 0.18;
        emR = 62 + edge * 24;
        emG = 56 + edge * 14;
        emB = 45 - edge * 10;
      } else if (luma < 72 && (luma < 32 || edge > 0.14)) {
        // Engraved world-map continents & latitude/longitude gridlines
        // Contrasted satin pewter with warm champagne-gold contour edge highlight
        const engraveWeight =
          luma < 32 ? 1 : Math.max(0, Math.min(1, (72 - luma) / 40)) * Math.min(1, edge * 2.2);
        const depthRatio = Math.max(0, Math.min(1, (65 - luma) / 55));
        const targetR = 104 + depthRatio * 16 + edge * 84;
        const targetG = 114 + depthRatio * 14 + edge * 56;
        const targetB = 130 + depthRatio * 14 - edge * 18;
        alR = 16 + (targetR - 16) * engraveWeight;
        alG = 22 + (targetG - 22) * engraveWeight;
        alB = 34 + (targetB - 34) * engraveWeight;
        roughness = 0.15 + (0.39 - edge * 0.11 - 0.15) * engraveWeight;
        metalness = 0.28 + (0.72 + edge * 0.14 - 0.28) * engraveWeight;
        emR = 7 + (31 + edge * 42) * engraveWeight;
        emG = 10 + (26 + edge * 30) * engraveWeight;
        emB = 16 + (14 + edge * 8) * engraveWeight;
      } else {
        // Polished obsidian coin face (ocean background field)
        // Smooth transition near engraving boundaries prevents harsh aliasing
        const nearEngrave = edge * 0.35;
        alR = 16 + nearEngrave * 56;
        alG = 22 + nearEngrave * 52;
        alB = 34 + nearEngrave * 44;
        roughness = 0.15 + nearEngrave * 0.14;
        metalness = 0.28 + nearEngrave * 0.32;
        emR = 7 + nearEngrave * 18;
        emG = 10 + nearEngrave * 16;
        emB = 16 + nearEngrave * 12;
      }

      cOut[outIdx] = clampByte(alR);
      cOut[outIdx + 1] = clampByte(alG);
      cOut[outIdx + 2] = clampByte(alB);
      cOut[outIdx + 3] = 255;

      const roughByte = clampByte(roughness * 255);
      rOut[outIdx] = roughByte;
      rOut[outIdx + 1] = roughByte;
      rOut[outIdx + 2] = roughByte;
      rOut[outIdx + 3] = 255;

      const metalByte = clampByte(metalness * 255);
      mOut[outIdx] = metalByte;
      mOut[outIdx + 1] = metalByte;
      mOut[outIdx + 2] = metalByte;
      mOut[outIdx + 3] = 255;

      eOut[outIdx] = clampByte(emR);
      eOut[outIdx + 1] = clampByte(emG);
      eOut[outIdx + 2] = clampByte(emB);
      eOut[outIdx + 3] = 255;
    }
  }

  colorCtx.putImageData(colorImg, 0, 0);
  roughCtx.putImageData(roughImg, 0, 0);
  metalCtx.putImageData(metalImg, 0, 0);
  emissiveCtx.putImageData(emissiveImg, 0, 0);

  const makeCanvasTexture = (
    canvas: HTMLCanvasElement,
    colorSpace: THREE.ColorSpace
  ): THREE.CanvasTexture => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = colorSpace;
    tex.flipY = origMap.flipY;
    tex.wrapS = origMap.wrapS;
    tex.wrapT = origMap.wrapT;
    tex.anisotropy = Math.min(8, Math.max(4, origMap.anisotropy || 4));
    tex.needsUpdate = true;
    return tex;
  };

  const colorMap = makeCanvasTexture(colorCanvas, THREE.SRGBColorSpace);
  const roughnessMap = makeCanvasTexture(roughCanvas, THREE.NoColorSpace);
  const metalnessMap = makeCanvasTexture(metalCanvas, THREE.NoColorSpace);
  const emissiveMap = makeCanvasTexture(emissiveCanvas, THREE.SRGBColorSpace);

  const material = new THREE.MeshPhysicalMaterial({
    map: colorMap,
    roughnessMap,
    metalnessMap,
    emissiveMap,
    emissive: new THREE.Color("#FFFFFF"),
    emissiveIntensity: 0.42,
    normalMap: origNormalMap,
    normalScale: new THREE.Vector2(1.55, 1.55),
    roughness: 1.0,
    metalness: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    reflectivity: 0.95,
    envMapIntensity: 1.45,
    side: THREE.DoubleSide,
  });

  return {
    material,
    dispose: () => {
      colorMap.dispose();
      roughnessMap.dispose();
      metalnessMap.dispose();
      emissiveMap.dispose();
      material.dispose();
    },
  };
}

