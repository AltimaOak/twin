import * as THREE from 'three';

export interface VehiclePaintOption {
  id: string;
  name: string;
  hex: number;
  cssColor: string;
}

export const VEHICLE_PAINT_PALETTES: VehiclePaintOption[] = [
  { id: 'sapphire', name: 'Midnight Sapphire', hex: 0x1d3557, cssColor: '#1d3557' },
  { id: 'apex-orange', name: 'Apex Orange', hex: 0xea580c, cssColor: '#ea580c' },
  { id: 'stealth-black', name: 'Stealth Onyx', hex: 0x18181b, cssColor: '#18181b' },
  { id: 'nardo-gray', name: 'Nardo Gray', hex: 0x64748b, cssColor: '#64748b' },
  { id: 'pearl-white', name: 'Pearl Frost', hex: 0xf8fafc, cssColor: '#f8fafc' },
  { id: 'racing-red', name: 'Rosso Corsa', hex: 0xdc2626, cssColor: '#dc2626' },
  { id: 'emerald', name: 'British Racing Green', hex: 0x065f46, cssColor: '#065f46' }
];

export class ProceduralVehicles {
  // -------------------------------------------------------------
  // SHADER MATERIALS (PBR, Automotive Clearcoat, Rubber, Metals)
  // -------------------------------------------------------------
  public static getPaintMaterial(colorHex: number, isXRay: boolean = false, isWireframe: boolean = false): THREE.Material {
    if (isWireframe) {
      return new THREE.MeshBasicMaterial({
        color: colorHex,
        wireframe: true,
        transparent: true,
        opacity: 0.7
      });
    }

    if (isXRay) {
      return new THREE.MeshPhysicalMaterial({
        color: 0x94a3b8,
        metalness: 0.08,
        roughness: 0.1,
        transmission: 0.94,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
        clearcoat: 0.9,
        reflectivity: 0.5
      });
    }

    // Default Digital Twin Body: Sleek frosted translucent tint with subtle paint hue
    return new THREE.MeshPhysicalMaterial({
      color: colorHex,
      metalness: 0.35,
      roughness: 0.18,
      transmission: 0.65,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.85
    });
  }

  public static getGlassMaterial(isWireframe: boolean = false): THREE.Material {
    if (isWireframe) {
      return new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.4 });
    }
    return new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      metalness: 0.1,
      roughness: 0.04,
      transmission: 0.92,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
      ior: 1.5,
      reflectivity: 0.9
    });
  }

  // Realistic Automotive Metals & Components
  private static chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.98, roughness: 0.06 });
  private static brushedSteelMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.88, roughness: 0.22 });
  private static darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.85, roughness: 0.35 });
  
  // Precision machined aluminum engine block & components
  private static engineCastMat = new THREE.MeshStandardMaterial({ color: 0xdde3ea, metalness: 0.85, roughness: 0.22 });
  private static engineOrangeMat = new THREE.MeshStandardMaterial({ color: 0xea580c, metalness: 0.6, roughness: 0.2, emissive: 0xea580c, emissiveIntensity: 0.25 });
  
  // High-visibility battery pack
  private static batteryLeadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.2 });
  private static batteryPosMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.9, roughness: 0.1 });
  private static batteryNegMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 0.9, roughness: 0.1 });
  
  // Cooling & Radiator
  private static radiatorCoreMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.18 });
  private static coolantHoseMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.25, metalness: 0.1, emissive: 0x0284c7, emissiveIntensity: 0.4 });
  
  // Brakes: Mirror discs & Brembo Orange Calipers
  private static brakeDiscMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.98, roughness: 0.08 });
  private static caliperOrangeMat = new THREE.MeshStandardMaterial({ color: 0xea580c, metalness: 0.6, roughness: 0.2, emissive: 0xea580c, emissiveIntensity: 0.45 });
  
  // Suspension: Bright canary yellow springs
  private static suspensionSpringMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.75, roughness: 0.2, emissive: 0xf59e0b, emissiveIntensity: 0.4 });
  
  // Exhaust: Stainless steel
  private static exhaustPipeMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.92, roughness: 0.18 });

  // Accents & Tires
  private static goldAnodizedMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.92, roughness: 0.18 });
  private static carbonFiberMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.55, roughness: 0.45 });
  private static trimBlackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.2, roughness: 0.6 });
  private static silverTrimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.25 });
  private static tireTreadMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.92, metalness: 0.05 });

  // Lighting
  private static ledWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x38bdf8,
    emissiveIntensity: 2.4,
    roughness: 0.05
  });
  private static ledAmberMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.8,
    roughness: 0.1
  });
  private static ledRedMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 2.4,
    roughness: 0.05
  });

  // Tag helper to attach component metadata for interactive raycasting and exploded views
  private static tagMesh(
    meshOrGroup: THREE.Object3D,
    componentId: string,
    name: string,
    explodedOffset?: [number, number, number]
  ): void {
    meshOrGroup.userData = {
      isInteractiveComponent: true,
      componentId,
      name,
      originalPosition: meshOrGroup.position.clone(),
      explodedOffset: explodedOffset ? new THREE.Vector3(...explodedOffset) : new THREE.Vector3(0, 0, 0)
    };

    meshOrGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.userData = {
          isInteractiveComponent: true,
          componentId,
          name
        };
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  // =========================================================================
  // MODEL 1 — MODERN CAR (Clean, Recognizable Modern Passenger Sedan)
  // =========================================================================
  public static createSedan(
    colorHex: number = 0x1d3557,
    isXRay: boolean = false,
    isWireframe: boolean = false
  ): THREE.Group {
    const car = new THREE.Group();
    car.name = 'VehicleModel_Sedan';

    const bodyMat = this.getPaintMaterial(colorHex, isXRay, isWireframe);
    const glassMat = this.getGlassMaterial(isWireframe);

    // --- A. EXTERIOR SEDAN BODYWORK (CURVED AUTOMOTIVE CAD TOPOLOGY) ---
    const bodyGroup = new THREE.Group();
    bodyGroup.name = 'Sedan_BodyGroup';
    bodyGroup.userData = { explodedOffset: new THREE.Vector3(0, 0.45, 0) };

    // 1. Aerodynamic Sedan Hull Profile (Extruded CAD Silhouette)
    // Points along Y (height) and Z (length: +Z is front, -Z is rear)
    const sedanProfile = new THREE.Shape();
    sedanProfile.moveTo(-2.15, 0.20);  // Front ground splitter
    sedanProfile.lineTo(-2.24, 0.38);  // Front bumper nose tip
    sedanProfile.lineTo(-2.14, 0.55);  // Upper grille lip / badge apex
    sedanProfile.quadraticCurveTo(-1.65, 0.65, -1.20, 0.68);  // Long hood slope
    sedanProfile.quadraticCurveTo(-0.70, 0.92, -0.52, 1.14);  // Raked windshield (30° angle)
    sedanProfile.quadraticCurveTo(0.10, 1.18, 0.45, 1.15);    // Curved roof
    sedanProfile.quadraticCurveTo(0.95, 0.94, 1.25, 0.72);    // Fastback rear window rake
    sedanProfile.lineTo(1.85, 0.70);   // 3-box sedan trunk decklid
    sedanProfile.lineTo(1.95, 0.67);   // Integrated ducktail lip spoiler
    sedanProfile.lineTo(2.02, 0.40);   // Rear bumper apex
    sedanProfile.lineTo(1.90, 0.20);   // Rear lower diffuser
    sedanProfile.lineTo(1.30, 0.20);   // Rear underbody
    sedanProfile.lineTo(-1.30, 0.20);  // Center floor underbody
    sedanProfile.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      steps: 2,
      depth: 1.62,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.07,
      bevelSegments: 4
    };

    const sedanHullGeo = new THREE.ExtrudeGeometry(sedanProfile, extrudeSettings);
    // Extrude builds along +Z; rotate to align along X-width and center
    sedanHullGeo.rotateY(Math.PI / 2);
    sedanHullGeo.translate(-0.81, 0, 0);

    const sedanHullMesh = new THREE.Mesh(sedanHullGeo, bodyMat);
    bodyGroup.add(sedanHullMesh);

    // 2. Glass Greenhouse (Front Windshield, Rear Glass, Side Windows)
    // Raked Front Windshield
    const fWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.62, 0.04), glassMat);
    fWindshield.position.set(0, 0.88, 0.82);
    fWindshield.rotation.x = -Math.PI * 0.28;
    bodyGroup.add(fWindshield);

    // Sloped Rear Windshield
    const rWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.58, 0.04), glassMat);
    rWindshield.position.set(0, 0.90, -0.85);
    rWindshield.rotation.x = Math.PI * 0.28;
    bodyGroup.add(rWindshield);

    // 4 Side Window Panes with B-Pillar Dividers & Flared Wheel Arches
    [-0.82, 0.82].forEach((xSide) => {
      // Flush Side Glass
      const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.38, 1.48), glassMat);
      sideGlass.position.set(xSide, 0.90, -0.05);

      // Central B-Pillar
      const bPillar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.40, 0.08), this.trimBlackMat);
      bPillar.position.set(xSide > 0 ? xSide + 0.01 : xSide - 0.01, 0.90, -0.05);

      // 4 Door Handles (Front & Rear Doors)
      [-0.42, 0.38].forEach((zHandle) => {
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 0.12), this.chromeMat);
        handle.position.set(xSide > 0 ? xSide + 0.04 : xSide - 0.04, 0.62, zHandle);
        bodyGroup.add(handle);
      });

      // Aerodynamic Side Mirrors
      const mirrorArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.04), this.trimBlackMat);
      mirrorArm.position.set(xSide, 0.78, 0.55);
      const mirrorHousing = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.09, 0.08), bodyMat);
      mirrorHousing.position.set(xSide > 0 ? xSide + 0.08 : xSide - 0.08, 0.79, 0.55);
      const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.07), this.chromeMat);
      mirrorGlass.rotation.y = xSide > 0 ? -Math.PI / 2 : Math.PI / 2;
      mirrorGlass.position.set(xSide > 0 ? xSide + 0.075 : xSide - 0.075, 0.79, 0.55);

      // Wheel Arch Flared Lips
      const fArch = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.03, 8, 20, Math.PI), this.trimBlackMat);
      fArch.rotation.y = xSide > 0 ? Math.PI / 2 : -Math.PI / 2;
      fArch.position.set(xSide, 0.32, 1.2);

      const rArch = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.03, 8, 20, Math.PI), this.trimBlackMat);
      rArch.rotation.y = xSide > 0 ? Math.PI / 2 : -Math.PI / 2;
      rArch.position.set(xSide, 0.32, -1.18);

      bodyGroup.add(sideGlass, bPillar, mirrorArm, mirrorHousing, mirrorGlass, fArch, rArch);
    });

    // 3. Front Grille, Splitter & Brand Emblem
    const frontGrille = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.22, 0.06), this.darkMetalMat);
    frontGrille.position.set(0, 0.44, 2.18);
    const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.02, 20), this.chromeMat);
    emblem.rotation.x = Math.PI / 2;
    emblem.position.set(0, 0.46, 2.22);
    const frontSplitter = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.04, 0.25), this.carbonFiberMat);
    frontSplitter.position.set(0, 0.19, 2.12);
    bodyGroup.add(frontGrille, emblem, frontSplitter);

    // 4. Matrix LED Headlights & Full-Width 3D Lightbar
    [-0.62, 0.62].forEach((xSide) => {
      const hlHousing = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.11, 0.14), this.darkMetalMat);
      hlHousing.position.set(xSide, 0.54, 2.06);
      hlHousing.rotation.y = xSide > 0 ? -0.16 : 0.16;
      const hlProjector = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16), this.ledWhiteMat);
      hlProjector.rotation.x = Math.PI / 2;
      hlProjector.position.set(xSide, 0.54, 2.14);
      const drlBrow = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.02, 0.03), this.ledAmberMat);
      drlBrow.position.set(xSide, 0.59, 2.14);
      drlBrow.rotation.y = xSide > 0 ? -0.16 : 0.16;
      bodyGroup.add(hlHousing, hlProjector, drlBrow);
    });

    const rearLightBar = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.04, 0.05), this.ledRedMat);
    rearLightBar.position.set(0, 0.65, -2.04);
    const rearDiffuser = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.12, 0.2), this.carbonFiberMat);
    rearDiffuser.position.set(0, 0.22, -1.98);
    const sharkFin = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.09, 4), bodyMat);
    sharkFin.rotation.y = Math.PI / 4;
    sharkFin.position.set(0, 1.20, -0.45);
    bodyGroup.add(rearLightBar, rearDiffuser, sharkFin);

    car.add(bodyGroup);

    // --- B. INTERNAL MECHANICAL & HEALTH SUBSYSTEMS ---
    // 1. ENGINE (`id: 'engine'`, position [0, 0.45, 1.15])
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 0.45, 1.15);
    const engBlock = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.42, 0.56), this.engineCastMat);
    const valveCover = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.14, 0.5), this.engineOrangeMat);
    valveCover.position.set(0, 0.26, 0);
    const intakePlenum = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.18, 0.14), this.darkMetalMat);
    intakePlenum.position.set(0, 0.18, -0.26);
    const beltPulley1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 16), this.chromeMat);
    beltPulley1.rotation.z = Math.PI / 2;
    beltPulley1.position.set(0.3, 0.05, 0.12);
    const beltPulley2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16), this.chromeMat);
    beltPulley2.rotation.z = Math.PI / 2;
    beltPulley2.position.set(0.3, -0.1, -0.08);
    engineGroup.add(engBlock, valveCover, intakePlenum, beltPulley1, beltPulley2);
    this.tagMesh(engineGroup, 'engine', '1.5L i-VTEC DOHC Engine', [0, 0.55, 0.3]);
    car.add(engineGroup);

    // 2. BATTERY (`id: 'battery'`, position [-0.48, 0.5, 0.95])
    const batteryGroup = new THREE.Group();
    batteryGroup.position.set(-0.48, 0.5, 0.95);
    const batBody = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.24), this.batteryLeadMat);
    const posPost = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.04, 12), this.batteryPosMat);
    posPost.position.set(-0.07, 0.12, 0.06);
    const negPost = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.04, 12), this.batteryNegMat);
    negPost.position.set(0.07, 0.12, 0.06);
    batteryGroup.add(batBody, posPost, negPost);
    this.tagMesh(batteryGroup, 'battery', '12V Lead-Acid Starter Battery', [-0.35, 0.35, 0.1]);
    car.add(batteryGroup);

    // 3. COOLING SYSTEM & RADIATOR (`id: 'cooling'`, position [0, 0.35, 1.6])
    const coolingGroup = new THREE.Group();
    coolingGroup.position.set(0, 0.35, 1.6);
    const radCore = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.36, 0.08), this.radiatorCoreMat);
    const fan1 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 16), this.trimBlackMat);
    fan1.rotation.x = Math.PI / 2;
    fan1.position.set(-0.24, 0, -0.05);
    const fan2 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 16), this.trimBlackMat);
    fan2.rotation.x = Math.PI / 2;
    fan2.position.set(0.24, 0, -0.05);
    const upperHose = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.45, 12), this.coolantHoseMat);
    upperHose.rotation.x = Math.PI * 0.35;
    upperHose.position.set(0.22, 0.12, -0.22);
    coolingGroup.add(radCore, fan1, fan2, upperHose);
    this.tagMesh(coolingGroup, 'cooling', 'Radiator & Cooling Circuit', [0, 0.25, 0.45]);
    car.add(coolingGroup);

    // 4. TRANSMISSION (`id: 'transmission'`, position [0.3, 0.35, 0.6])
    const transGroup = new THREE.Group();
    transGroup.position.set(0.3, 0.35, 0.6);
    const transCase = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.32, 0.52), this.silverTrimMat);
    const diffDome = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), this.darkMetalMat);
    diffDome.position.set(-0.25, -0.04, 0.05);
    const axleL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.55, 12), this.brushedSteelMat);
    axleL.rotation.z = Math.PI / 2;
    axleL.position.set(-0.55, -0.04, 0.05);
    const axleR = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.55, 12), this.brushedSteelMat);
    axleR.rotation.z = Math.PI / 2;
    axleR.position.set(0.35, -0.04, 0.05);
    transGroup.add(transCase, diffDome, axleL, axleR);
    this.tagMesh(transGroup, 'transmission', 'Continuously Variable Transmission (CVT)', [0.35, 0.3, -0.15]);
    car.add(transGroup);

    // 5. EXHAUST SYSTEM (`id: 'exhaust'`, position [0, 0.18, -1.4])
    const exhaustGroup = new THREE.Group();
    exhaustGroup.position.set(0, 0.18, -1.4);
    const exhCenterPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.3, 16), this.exhaustPipeMat);
    exhCenterPipe.rotation.x = Math.PI / 2;
    exhCenterPipe.position.set(0.06, 0.04, 0.75);
    const catConverter = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.38, 16), this.brushedSteelMat);
    catConverter.rotation.x = Math.PI / 2;
    catConverter.position.set(0.06, 0.04, 1.4);
    const rearMuffler = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.18, 0.32), this.brushedSteelMat);
    rearMuffler.position.set(0, 0.04, -0.32);
    [-0.24, 0.24].forEach((xTip) => {
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.18, 16), this.chromeMat);
      tip.rotation.x = Math.PI / 2;
      tip.position.set(xTip, 0.04, -0.52);
      exhaustGroup.add(tip);
    });
    exhaustGroup.add(exhCenterPipe, catConverter, rearMuffler);
    this.tagMesh(exhaustGroup, 'exhaust', 'Catalytic Converter & Exhaust System', [0, -0.3, -0.4]);
    car.add(exhaustGroup);

    // 6. SUSPENSION (`id: 'suspension'`, position [0.65, 0.35, 1.1])
    const suspGroup = new THREE.Group();
    suspGroup.position.set(0.65, 0.35, 1.1);
    const strutCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.38, 14), this.darkMetalMat);
    const springCoil = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.28, 16), this.suspensionSpringMat);
    suspGroup.add(strutCylinder, springCoil);
    this.tagMesh(suspGroup, 'suspension', 'MacPherson Strut Suspension', [0.35, 0.2, 0.15]);
    car.add(suspGroup);

    // --- C. 4 PASSENGER WHEELS & ALLOY RIMS ---
    const wheelPositions: [number, number, number][] = [
      [-0.82, 0.32, 1.2],   // Front Left
      [0.82, 0.32, 1.2],    // Front Right (Tagged as Brakes)
      [-0.82, 0.32, -1.18], // Rear Left (Tagged as Tyres)
      [0.82, 0.32, -1.18]   // Rear Right
    ];

    wheelPositions.forEach((pos, idx) => {
      const isRight = pos[0] > 0;
      const isFront = idx < 2;
      const wg = new THREE.Group();
      wg.position.set(pos[0], pos[1], pos[2]);

      // Low-profile radial rubber tire with curved outer shoulder
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.24, 30), this.tireTreadMat);
      tire.rotation.z = Math.PI / 2;

      // 5-Spoke Alloy Rim
      const rimOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.245, 24, 1, true), this.silverTrimMat);
      rimOuter.rotation.z = Math.PI / 2;
      const rimHub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.25, 16), this.silverTrimMat);
      rimHub.rotation.z = Math.PI / 2;

      for (let s = 0; s < 5; s++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.20, 0.04), this.silverTrimMat);
        spoke.rotation.x = (s * Math.PI * 2) / 5;
        spoke.position.x = isRight ? -0.1 : 0.1;
        wg.add(spoke);
      }

      // Precision Brake Disc & Brembo Caliper
      const brakeDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 20), this.brakeDiscMat);
      brakeDisc.rotation.z = Math.PI / 2;
      brakeDisc.position.x = isRight ? -0.05 : 0.05;

      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.08), this.caliperOrangeMat);
      caliper.position.set(isRight ? -0.05 : 0.05, 0.11, 0.02);

      wg.add(tire, rimOuter, rimHub, brakeDisc, caliper);

      if (idx === 1) {
        this.tagMesh(wg, 'brakes', 'Front Disc Brakes & Brembo Calipers', [0.35, 0, 0.15]);
      } else if (idx === 2) {
        this.tagMesh(wg, 'tyres', '185/55 R16 Radial Tyres (TPMS)', [-0.35, 0, -0.15]);
      } else {
        wg.userData = {
          explodedOffset: new THREE.Vector3(isRight ? 0.35 : -0.35, 0, isFront ? 0.15 : -0.15)
        };
      }

      car.add(wg);
    });

    return car;
  }

  // =========================================================================
  // MODEL 2 — BIKE / MOTORCYCLE (High-Fidelity Hyper-Detailed Streetfighter)
  // =========================================================================
  public static createMotorcycle(
    colorHex: number = 0xea580c,
    isXRay: boolean = false,
    isWireframe: boolean = false
  ): THREE.Group {
    const bike = new THREE.Group();
    bike.name = 'VehicleModel_Motorcycle';

    const frameMat = this.getPaintMaterial(colorHex, isXRay, isWireframe);
    const glassMat = this.getGlassMaterial(isWireframe);

    // Specialized high-detail motorcycle materials
    const tftScreenMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0284c7,
      emissiveIntensity: 1.6,
      roughness: 0.15
    });
    const tankGripMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.94,
      metalness: 0.06
    });
    const exhaustHeaderMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.92,
      roughness: 0.22
    });
    const titaniumBlueMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.94,
      roughness: 0.15,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.2
    });
    const titaniumVioletMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      metalness: 0.94,
      roughness: 0.18
    });
    const exhaustMufflerMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.28
    });
    const forkGoldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.96,
      roughness: 0.12
    });
    const headlightLensMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      emissive: 0x38bdf8,
      emissiveIntensity: 2.8,
      roughness: 0.04
    });

    // --- A. FRAME, TANK, SEAT, COCKPIT & FAIRINGS ---
    const bodyGroup = new THREE.Group();
    bodyGroup.name = 'Bike_BodyGroup';
    bodyGroup.userData = { explodedOffset: new THREE.Vector3(0, 0.45, 0) };

    // 1. Steering Headstock Tube
    const headStock = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.24, 16), this.darkMetalMat);
    headStock.position.set(0, 0.82, 0.62);
    headStock.rotation.x = -0.34; // 24° rake angle
    bodyGroup.add(headStock);

    // 2. High-Rigidity Diamond Perimeter Trellis Frame
    [-0.14, 0.14].forEach((xSide) => {
      // Main upper twin-spar tubes from headstock down to swingarm pivot plates
      const mainSpar = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.88, 14), this.darkMetalMat);
      mainSpar.position.set(xSide, 0.66, 0.18);
      mainSpar.rotation.x = 0.58;
      mainSpar.rotation.z = xSide > 0 ? -0.06 : 0.06;

      // Lower cradle downtubes wrapping front of engine
      const downTube = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.74, 14), this.darkMetalMat);
      downTube.position.set(xSide, 0.48, 0.36);
      downTube.rotation.x = -0.68;
      downTube.rotation.z = xSide > 0 ? -0.04 : 0.04;

      // Diagonal triangulated trellis cross-members
      const diagStrut1 = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.36, 12), this.darkMetalMat);
      diagStrut1.position.set(xSide, 0.62, 0.34);
      diagStrut1.rotation.x = -0.45;

      const diagStrut2 = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.38, 12), this.darkMetalMat);
      diagStrut2.position.set(xSide, 0.54, 0.05);
      diagStrut2.rotation.x = 0.72;

      // Machined cast aluminum swingarm pivot plate
      const pivotPlate = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.26, 0.18), this.engineCastMat);
      pivotPlate.position.set(xSide, 0.42, -0.22);

      const pivotBolt = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.05, 12), this.chromeMat);
      pivotBolt.rotation.z = Math.PI / 2;
      pivotBolt.position.set(xSide > 0 ? xSide + 0.015 : xSide - 0.015, 0.40, -0.22);

      // Rear lightweight subframe tubes supporting seat & tail
      const subFrameTop = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.68, 12), this.darkMetalMat);
      subFrameTop.position.set(xSide * 0.85, 0.70, -0.48);
      subFrameTop.rotation.x = -0.22;

      const subFrameBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.56, 12), this.darkMetalMat);
      subFrameBottom.position.set(xSide * 0.85, 0.58, -0.44);
      subFrameBottom.rotation.x = 0.32;

      bodyGroup.add(mainSpar, downTube, diagStrut1, diagStrut2, pivotPlate, pivotBolt, subFrameTop, subFrameBottom);
    });

    // Cross brace bridge between frame spars
    const frameCrossBridge = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.26, 12), this.darkMetalMat);
    frameCrossBridge.rotation.z = Math.PI / 2;
    frameCrossBridge.position.set(0, 0.72, 0.32);
    bodyGroup.add(frameCrossBridge);

    // 3. Sculpted Muscular Fuel Tank with Knee Indents & Stomp Grips
    const tankShape = new THREE.Shape();
    tankShape.moveTo(-0.16, 0.02);
    tankShape.quadraticCurveTo(0.08, 0.32, 0.42, 0.36);
    tankShape.quadraticCurveTo(0.66, 0.34, 0.72, 0.14);
    tankShape.quadraticCurveTo(0.52, -0.06, 0.08, -0.04);
    tankShape.closePath();

    const tankGeo = new THREE.ExtrudeGeometry(tankShape, {
      depth: 0.36,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.06,
      bevelSegments: 4
    });
    tankGeo.center();
    const tankMesh = new THREE.Mesh(tankGeo, frameMat);
    tankMesh.position.set(0, 0.78, 0.22);
    tankMesh.rotation.y = Math.PI / 2;

    // Fuel Tank Central Spine Accent Strip
    const tankSpine = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.58), this.carbonFiberMat);
    tankSpine.position.set(0, 0.94, 0.24);
    tankSpine.rotation.x = 0.12;

    // Flush Aircraft-Style Chrome Fuel Filler Cap with Bolt Accents
    const gasCapBase = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.015, 20), this.silverTrimMat);
    gasCapBase.position.set(0, 0.95, 0.32);
    gasCapBase.rotation.x = 0.12;
    const gasCapCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.025, 20), this.chromeMat);
    gasCapCenter.position.set(0, 0.96, 0.32);
    gasCapCenter.rotation.x = 0.12;

    // Left & Right Knee Stomp Grip Pads
    [-0.22, 0.22].forEach((xSide) => {
      const gripPad = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.18, 0.28), tankGripMat);
      gripPad.position.set(xSide, 0.76, 0.12);
      gripPad.rotation.y = xSide > 0 ? -0.15 : 0.15;
      bodyGroup.add(gripPad);
    });

    bodyGroup.add(tankMesh, tankSpine, gasCapBase, gasCapCenter);

    // 4. Aerodynamic Radiator Air Shrouds & MotoGP-Style Aero Winglets
    [-0.23, 0.23].forEach((xSide) => {
      const shroud = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.24, 0.32), frameMat);
      shroud.position.set(xSide, 0.68, 0.44);
      shroud.rotation.y = xSide > 0 ? -0.22 : 0.22;
      shroud.rotation.x = -0.14;

      const meshVent = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.16, 0.22), this.darkMetalMat);
      meshVent.position.set(xSide > 0 ? xSide + 0.02 : xSide - 0.02, 0.68, 0.44);
      meshVent.rotation.y = xSide > 0 ? -0.22 : 0.22;

      // Aerodynamic Front Downforce Winglet Foil
      const winglet = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.16), this.carbonFiberMat);
      winglet.position.set(xSide > 0 ? xSide + 0.06 : xSide - 0.06, 0.64, 0.52);
      winglet.rotation.z = xSide > 0 ? -0.25 : 0.25;
      winglet.rotation.y = xSide > 0 ? -0.2 : 0.2;

      bodyGroup.add(shroud, meshVent, winglet);
    });

    // 5. Ergonomic Two-Tier Sport Saddle (Rider + Pillion)
    const riderSeat = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.44), this.tireTreadMat);
    riderSeat.position.set(0, 0.72, -0.18);
    riderSeat.rotation.x = -0.10;

    const pillionSeat = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.10, 0.28), this.tireTreadMat);
    pillionSeat.position.set(0, 0.81, -0.48);
    pillionSeat.rotation.x = 0.12;

    bodyGroup.add(riderSeat, pillionSeat);

    // 6. Sharpened Tail Cowl with Aerodynamic Ducts & Slim LED Taillight
    const tailCowl = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.14, 0.46), frameMat);
    tailCowl.position.set(0, 0.76, -0.66);
    tailCowl.rotation.x = 0.18;

    const underTailTray = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.42), this.carbonFiberMat);
    underTailTray.position.set(0, 0.68, -0.66);
    underTailTray.rotation.x = 0.18;

    const tailLamp = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.035, 0.03), this.ledRedMat);
    tailLamp.position.set(0, 0.81, -0.89);

    // Rear License Plate Stalk & Reflector Fender
    const plateStalk = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.04), this.darkMetalMat);
    plateStalk.position.set(0, 0.62, -0.92);
    plateStalk.rotation.x = -0.45;

    const plateBoard = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.015), this.silverTrimMat);
    plateBoard.position.set(0, 0.52, -1.02);

    const rearReflector = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.025, 0.01), this.ledRedMat);
    rearReflector.position.set(0, 0.44, -1.03);

    bodyGroup.add(tailCowl, underTailTray, tailLamp, plateStalk, plateBoard, rearReflector);

    // 7. Front Aerodynamic Sport Mudguard / Fender
    const frontFender = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.15, 24, 1, false, 0, Math.PI * 0.45), frameMat);
    frontFender.rotation.z = Math.PI / 2;
    frontFender.rotation.x = Math.PI * 0.68;
    frontFender.position.set(0, 0.28, 0.95);

    [-0.10, 0.10].forEach((xSide) => {
      const fenderBracket = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.14, 0.04), this.carbonFiberMat);
      fenderBracket.position.set(xSide, 0.36, 0.88);
      bodyGroup.add(fenderBracket);
    });
    bodyGroup.add(frontFender);

    // 8. Aerodynamic Belly Pan / Engine Chin Spoiler
    const bellyPan = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.62), frameMat);
    bellyPan.position.set(0, 0.22, 0.08);
    const bellyStrakes = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.58), this.carbonFiberMat);
    bellyStrakes.position.set(0, 0.16, 0.08);
    bodyGroup.add(bellyPan, bellyStrakes);

    // 9. Triple Clamps, Tapered Handlebars, Steering Damper & Switchgear
    const upperTripleClamp = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.035, 0.09), this.engineCastMat);
    upperTripleClamp.position.set(0, 0.90, 0.58);
    upperTripleClamp.rotation.x = -0.34;

    const lowerTripleClamp = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.04, 0.09), this.darkMetalMat);
    lowerTripleClamp.position.set(0, 0.74, 0.66);
    lowerTripleClamp.rotation.x = -0.34;

    // Transverse Linear Steering Damper
    const damperBody = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.24, 12), forkGoldMat);
    damperBody.rotation.z = Math.PI / 2;
    damperBody.position.set(0.04, 0.88, 0.52);
    const damperShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.32, 10), this.chromeMat);
    damperShaft.rotation.z = Math.PI / 2;
    damperShaft.position.set(0.04, 0.88, 0.52);
    bodyGroup.add(damperBody, damperShaft);

    // Handlebar risers and clamp caps
    [-0.06, 0.06].forEach((xSide) => {
      const riser = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.06, 12), this.darkMetalMat);
      riser.position.set(xSide, 0.93, 0.57);
      bodyGroup.add(riser);
    });

    // Tapered sport handlebar
    const handlebar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.78, 16), this.darkMetalMat);
    handlebar.rotation.z = Math.PI / 2;
    handlebar.position.set(0, 0.96, 0.56);

    // Knurled Rubber Handgrips, Switchgear Pods & Controls
    [-0.34, 0.34].forEach((xSide) => {
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.12, 14), this.tireTreadMat);
      grip.rotation.z = Math.PI / 2;
      grip.position.set(xSide > 0 ? xSide - 0.06 : xSide + 0.06, 0.96, 0.56);

      const barEnd = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.03, 12), this.goldAnodizedMat);
      barEnd.rotation.z = Math.PI / 2;
      barEnd.position.set(xSide > 0 ? xSide + 0.01 : xSide - 0.01, 0.96, 0.56);

      // Handlebar Switchgear Control Pod
      const switchPod = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.04, 0.04), this.darkMetalMat);
      switchPod.position.set(xSide > 0 ? xSide - 0.14 : xSide + 0.14, 0.96, 0.56);

      if (xSide > 0) {
        // Red Engine Kill Switch Rocker (Right pod)
        const killSwitch = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.015, 0.015), this.ledRedMat);
        killSwitch.position.set(xSide - 0.14, 0.98, 0.57);
        bodyGroup.add(killSwitch);
      }

      // CNC Levers (Clutch Left, Front Brake Right)
      const leverPerch = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.03, 0.03), this.darkMetalMat);
      leverPerch.position.set(xSide > 0 ? xSide - 0.12 : xSide + 0.12, 0.96, 0.57);

      const leverBlade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.015, 0.02), this.goldAnodizedMat);
      leverBlade.position.set(xSide > 0 ? xSide - 0.07 : xSide + 0.07, 0.95, 0.60);
      leverBlade.rotation.y = xSide > 0 ? 0.3 : -0.3;

      // Bar-End Aerodynamic Mirrors
      const mirrorStem = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.12, 8), this.darkMetalMat);
      mirrorStem.position.set(xSide > 0 ? xSide + 0.04 : xSide - 0.04, 1.02, 0.56);
      mirrorStem.rotation.z = xSide > 0 ? -0.4 : 0.4;

      const mirrorHousing = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.02), this.trimBlackMat);
      mirrorHousing.position.set(xSide > 0 ? xSide + 0.08 : xSide - 0.08, 1.07, 0.56);
      mirrorHousing.rotation.y = xSide > 0 ? -0.2 : 0.2;

      const mirrorFace = new THREE.Mesh(new THREE.PlaneGeometry(0.095, 0.048), this.chromeMat);
      mirrorFace.position.set(xSide > 0 ? xSide + 0.08 : xSide - 0.08, 1.07, 0.55);
      mirrorFace.rotation.y = xSide > 0 ? -Math.PI + 0.2 : Math.PI - 0.2;

      bodyGroup.add(grip, barEnd, switchPod, leverPerch, leverBlade, mirrorStem, mirrorHousing, mirrorFace);
    });

    // Front Brake Master Cylinder Fluid Reservoir (Right handlebar)
    const masterCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.035, 12), glassMat);
    masterCylinder.position.set(0.18, 1.01, 0.58);
    const masterCap = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.01, 12), this.trimBlackMat);
    masterCap.position.set(0.18, 1.03, 0.58);

    // Braided Stainless Front Brake Lines
    const brakeHose = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.62, 8), this.silverTrimMat);
    brakeHose.position.set(0.12, 0.65, 0.72);
    brakeHose.rotation.x = -0.34;
    bodyGroup.add(masterCylinder, masterCap, brakeHose);

    // Full-Color Digital TFT Dashboard Cluster
    const tftHousing = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.10, 0.025), this.darkMetalMat);
    tftHousing.position.set(0, 0.98, 0.50);
    tftHousing.rotation.x = -Math.PI * 0.28;

    const tftScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.08), tftScreenMat);
    tftScreen.position.set(0, 0.985, 0.495);
    tftScreen.rotation.x = -Math.PI * 0.28;

    bodyGroup.add(upperTripleClamp, lowerTripleClamp, handlebar, tftHousing, tftScreen);

    // 10. Aggressive Projector LED Headlight Assembly & Smoked Flyscreen
    const hlMask = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.16), frameMat);
    hlMask.position.set(0, 0.78, 0.72);
    hlMask.rotation.x = -0.25;

    // Dual Projector LED Eye Lenses
    [-0.05, 0.05].forEach((xSide) => {
      const projector = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.04, 16), headlightLensMat);
      projector.rotation.x = Math.PI / 2 - 0.25;
      projector.position.set(xSide, 0.77, 0.81);
      bodyGroup.add(projector);
    });

    // DRL Light-Guide Brow
    const drlBrow = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.018, 0.03), this.ledWhiteMat);
    drlBrow.position.set(0, 0.86, 0.79);
    drlBrow.rotation.x = -0.25;

    // Smoked Tinted Mini Flyscreen Visor
    const flyScreen = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.02), glassMat);
    flyScreen.position.set(0, 0.94, 0.66);
    flyScreen.rotation.x = -0.45;

    // Left & Right LED Blade Turn Indicators (Front)
    [-0.18, 0.18].forEach((xSide) => {
      const indStalk = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 0.015), this.darkMetalMat);
      indStalk.position.set(xSide > 0 ? xSide - 0.01 : xSide + 0.01, 0.78, 0.70);
      const indLens = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.016, 0.016), this.ledAmberMat);
      indLens.position.set(xSide, 0.78, 0.70);
      bodyGroup.add(indStalk, indLens);
    });

    // Left & Right LED Blade Turn Indicators (Rear)
    [-0.14, 0.14].forEach((xSide) => {
      const indRearStalk = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.014, 0.014), this.darkMetalMat);
      indRearStalk.position.set(xSide > 0 ? xSide - 0.01 : xSide + 0.01, 0.58, -0.96);
      const indRearLens = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.015, 0.015), this.ledAmberMat);
      indRearLens.position.set(xSide, 0.58, -0.96);
      bodyGroup.add(indRearStalk, indRearLens);
    });

    bodyGroup.add(hlMask, drlBrow, flyScreen);

    // 11. Inverted (USD) Telescopic Front Forks
    [-0.14, 0.14].forEach((xSide) => {
      // Upper Gold-Anodized Stanchion Tubes
      const upperFork = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.52, 18), forkGoldMat);
      upperFork.position.set(xSide, 0.68, 0.68);
      upperFork.rotation.x = -0.34;

      const forkTopCap = new THREE.Mesh(new THREE.CylinderGeometry(0.040, 0.040, 0.02, 16), this.chromeMat);
      forkTopCap.position.set(xSide, 0.91, 0.59);
      forkTopCap.rotation.x = -0.34;

      // Lower Chrome Inner Sliders
      const lowerFork = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.44, 18), this.chromeMat);
      lowerFork.position.set(xSide, 0.38, 0.81);
      lowerFork.rotation.x = -0.34;

      // Cast Aluminum Axle Lugs & Radial Caliper Mounts
      const axleLug = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.09), this.engineCastMat);
      axleLug.position.set(xSide, 0.28, 0.95);

      bodyGroup.add(upperFork, forkTopCap, lowerFork, axleLug);
    });

    bike.add(bodyGroup);

    // --- B. MOTORCYCLE MECHANICAL POWERTRAIN & SUBSYSTEMS ---
    // 1. ENGINE (`id: 'm-engine'`, position [0, 0.45, 0.05])
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 0.45, 0.05);

    // Main Engine Crankcase with Machined Details
    const crankcase = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.36, 0.48), this.engineCastMat);

    // Left Alternator/Stator Cover
    const statorCover = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.06, 20), this.darkMetalMat);
    statorCover.rotation.z = Math.PI / 2;
    statorCover.position.set(-0.24, -0.02, 0.04);

    // Right Clutch Basket Casing with Circular Inspection Window
    const clutchCover = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.06, 20), this.engineCastMat);
    clutchCover.rotation.z = Math.PI / 2;
    clutchCover.position.set(0.24, -0.02, -0.06);

    const clutchCenterCap = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.07, 16), this.goldAnodizedMat);
    clutchCenterCap.rotation.z = Math.PI / 2;
    clutchCenterCap.position.set(0.24, -0.02, -0.06);

    // Oil Level Sight Glass Window (Right side)
    const oilSightGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 14), this.goldAnodizedMat);
    oilSightGlass.rotation.z = Math.PI / 2;
    oilSightGlass.position.set(0.25, -0.12, 0.08);

    // Water Pump Housing & Blue Silicone Hose (Left side)
    const waterPump = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 14), this.darkMetalMat);
    waterPump.rotation.z = Math.PI / 2;
    waterPump.position.set(-0.24, -0.10, 0.14);

    const coolantHose = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.28, 10), this.coolantHoseMat);
    coolantHose.position.set(-0.20, 0.04, 0.20);
    coolantHose.rotation.x = -0.42;

    // Finned DOHC Cylinder Barrel
    const cylinderBlock = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.26, 0.32), this.engineCastMat);
    cylinderBlock.position.set(0, 0.22, 0.08);
    cylinderBlock.rotation.x = 0.25; // Forward-canted cylinders

    // DOHC Valve Cover Head in Signature Accent Color
    const dOhcHead = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.10, 0.30), this.engineOrangeMat);
    dOhcHead.position.set(0, 0.36, 0.12);
    dOhcHead.rotation.x = 0.25;

    // Cooling Fins along the cylinder block
    for (let f = 0; f < 5; f++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.014, 0.36), this.engineCastMat);
      fin.position.set(0, 0.14 + f * 0.05, 0.06 + f * 0.015);
      fin.rotation.x = 0.25;
      engineGroup.add(fin);
    }

    // High-Mounted Compact Oil Cooler Radiator with AN Fittings
    const oilCooler = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.10, 0.04), this.radiatorCoreMat);
    oilCooler.position.set(0, 0.34, 0.38);
    oilCooler.rotation.x = -0.22;
    [-0.10, 0.10].forEach((xSide) => {
      const anFitting = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.03, 8), this.caliperOrangeMat);
      anFitting.position.set(xSide, 0.30, 0.36);
      engineGroup.add(anFitting);
    });

    // Dual Spark Plug Boots & Ignition Leads
    [-0.08, 0.08].forEach((xSide) => {
      const sparkBoot = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.06, 10), this.trimBlackMat);
      sparkBoot.position.set(xSide, 0.42, 0.14);
      sparkBoot.rotation.x = 0.25;
      engineGroup.add(sparkBoot);
    });

    // Starter Motor Cylinder Unit
    const starterMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.22, 14), this.chromeMat);
    starterMotor.rotation.z = Math.PI / 2;
    starterMotor.position.set(0, 0.08, 0.20);

    // Spin-on Oil Filter Canister
    const oilFilter = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.08, 14), this.darkMetalMat);
    oilFilter.rotation.x = Math.PI / 2;
    oilFilter.position.set(-0.12, -0.12, 0.24);

    // Swept Stainless Steel & Titanium Twin Exhaust Headers with Heat Bluing Gradient
    [-0.08, 0.08].forEach((xSide) => {
      // Upper header in golden bronze
      const headerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.34, 16), exhaustHeaderMat);
      headerPipe.rotation.x = Math.PI * 0.42;
      headerPipe.position.set(xSide, 0.16, 0.26);

      // Bend with burnt titanium violet & blue heat gradient rings
      const heatRingViolet = new THREE.Mesh(new THREE.CylinderGeometry(0.031, 0.031, 0.08, 14), titaniumVioletMat);
      heatRingViolet.rotation.x = Math.PI * 0.42;
      heatRingViolet.position.set(xSide, 0.06, 0.32);

      const heatRingBlue = new THREE.Mesh(new THREE.CylinderGeometry(0.031, 0.031, 0.14, 14), titaniumBlueMat);
      heatRingBlue.rotation.x = Math.PI * 0.42;
      heatRingBlue.position.set(xSide, -0.02, 0.36);

      engineGroup.add(headerPipe, heatRingViolet, heatRingBlue);
    });

    // Under-Engine Catalytic Converter Pre-Chamber Box
    const catBox = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.36), this.brushedSteelMat);
    catBox.position.set(0.04, -0.18, 0.02);

    // Upswept Sport Exhaust Muffler (Akrapovič-Style Hexagonal Silencer)
    const midPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.38, 16), this.brushedSteelMat);
    midPipe.rotation.x = Math.PI * 0.35;
    midPipe.rotation.y = -0.22;
    midPipe.position.set(0.18, -0.12, -0.22);

    const mufflerCanister = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.62, 18), exhaustMufflerMat);
    mufflerCanister.rotation.x = Math.PI / 2 - 0.36; // Upswept 20°
    mufflerCanister.position.set(0.24, -0.06, -0.48);

    const carbonEndCap = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.076, 0.08, 18), this.carbonFiberMat);
    carbonEndCap.rotation.x = Math.PI / 2 - 0.36;
    carbonEndCap.position.set(0.24, 0.03, -0.74);

    const dualExitTip = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.06, 14), this.chromeMat);
    dualExitTip.rotation.x = Math.PI / 2 - 0.36;
    dualExitTip.position.set(0.24, 0.04, -0.77);

    const mufflerBand = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.03), this.carbonFiberMat);
    mufflerBand.position.set(0.24, -0.06, -0.48);
    mufflerBand.rotation.x = -0.36;

    // Footpegs, Heel Guards & Foot Controls
    // Left: Gear shift lever & rider footpeg
    const pegLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.14, 12), this.goldAnodizedMat);
    pegLeft.rotation.z = Math.PI / 2;
    pegLeft.position.set(-0.28, -0.12, -0.18);

    const heelGuardLeft = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.10), this.silverTrimMat);
    heelGuardLeft.position.set(-0.22, -0.08, -0.18);

    const shiftLever = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.02, 0.12), this.darkMetalMat);
    shiftLever.position.set(-0.24, -0.14, -0.12);
    const shiftToePeg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.04, 10), this.tireTreadMat);
    shiftToePeg.rotation.z = Math.PI / 2;
    shiftToePeg.position.set(-0.26, -0.14, -0.07);

    // Left Side Stand (Kickstand)
    const kickStand = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 10), this.darkMetalMat);
    kickStand.position.set(-0.24, -0.22, -0.15);
    kickStand.rotation.z = -0.45;
    kickStand.rotation.x = -0.25;
    const kickStandFoot = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.01, 0.06), this.darkMetalMat);
    kickStandFoot.position.set(-0.35, -0.33, -0.20);

    // Right: Rear brake foot pedal & rider footpeg
    const pegRight = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.14, 12), this.goldAnodizedMat);
    pegRight.rotation.z = Math.PI / 2;
    pegRight.position.set(0.28, -0.12, -0.18);

    const heelGuardRight = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.10), this.silverTrimMat);
    heelGuardRight.position.set(0.22, -0.08, -0.18);

    const brakePedal = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.02, 0.12), this.darkMetalMat);
    brakePedal.position.set(0.24, -0.14, -0.12);

    // Passenger Footpegs
    [-0.24, 0.24].forEach((xSide) => {
      const passPegHanger = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.22, 10), this.darkMetalMat);
      passPegHanger.position.set(xSide, 0.08, -0.42);
      passPegHanger.rotation.x = -0.55;
      const passPeg = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.10, 10), this.silverTrimMat);
      passPeg.rotation.z = Math.PI / 2;
      passPeg.position.set(xSide > 0 ? xSide + 0.04 : xSide - 0.04, 0.02, -0.48);
      engineGroup.add(passPegHanger, passPeg);
    });

    engineGroup.add(
      crankcase, statorCover, clutchCover, clutchCenterCap, oilSightGlass, waterPump, coolantHose,
      cylinderBlock, dOhcHead, oilCooler,
      starterMotor, oilFilter, catBox, midPipe, mufflerCanister, carbonEndCap, dualExitTip, mufflerBand,
      pegLeft, heelGuardLeft, shiftLever, shiftToePeg, kickStand, kickStandFoot, pegRight, heelGuardRight, brakePedal
    );

    this.tagMesh(engineGroup, 'm-engine', '689cc DOHC Crossplane Parallel-Twin Engine', [0, 0.35, 0.25]);
    bike.add(engineGroup);

    // 2. O-RING DRIVE CHAIN & SPROCKETS (`id: 'm-chain'`, position [-0.18, 0.26, -0.65])
    const chainGroup = new THREE.Group();
    chainGroup.position.set(-0.18, 0.26, -0.65);

    // Front countershaft drive sprocket
    const fSprocket = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.02, 18), this.darkMetalMat);
    fSprocket.rotation.z = Math.PI / 2;
    fSprocket.position.set(0, 0.12, 0.45);

    // Rear Drilled Lightweight Racing Sprocket with Studs
    const rSprocket = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.02, 24), this.brushedSteelMat);
    rSprocket.rotation.z = Math.PI / 2;
    rSprocket.position.set(0, 0.02, -0.2);

    for (let h = 0; h < 6; h++) {
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.025, 12), this.darkMetalMat);
      hole.rotation.z = Math.PI / 2;
      const angle = (h * Math.PI * 2) / 6;
      hole.position.set(0, 0.02 + Math.cos(angle) * 0.08, -0.2 + Math.sin(angle) * 0.08);
      chainGroup.add(hole);
    }

    // Top and Bottom Runs of 520 Gold O-Ring Drive Chain
    const topChain = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.038, 0.68), this.goldAnodizedMat);
    topChain.position.set(0, 0.12, 0.12);
    topChain.rotation.x = -0.15;

    const bottomChain = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.038, 0.68), this.goldAnodizedMat);
    bottomChain.position.set(0, -0.01, 0.12);
    bottomChain.rotation.x = 0.15;

    // Chain guide slider block
    const chainGuide = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 0.14), this.trimBlackMat);
    chainGuide.position.set(0, -0.03, -0.10);

    chainGroup.add(fSprocket, rSprocket, topChain, bottomChain, chainGuide);
    this.tagMesh(chainGroup, 'm-chain', '525 Sealed Gold O-Ring Final Drive Chain', [-0.35, 0, -0.2]);
    bike.add(chainGroup);

    // 3. AGM BATTERY (`id: 'm-battery'`, position [0, 0.58, -0.2])
    const batteryGroup = new THREE.Group();
    batteryGroup.position.set(0, 0.58, -0.2);

    const bat = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.18), this.batteryLeadMat);
    const batStrap = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.20, 0.04), this.goldAnodizedMat);
    batStrap.position.set(0, 0, 0);

    const bPos = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.04, 12), this.batteryPosMat);
    bPos.position.set(-0.06, 0.1, 0.04);

    const bNeg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.04, 12), this.batteryNegMat);
    bNeg.position.set(0.06, 0.1, 0.04);

    batteryGroup.add(bat, batStrap, bPos, bNeg);
    this.tagMesh(batteryGroup, 'm-battery', '12V 8.6Ah Maintenance-Free Sealed AGM Battery', [0, 0.35, -0.15]);
    bike.add(batteryGroup);

    // 4. Reinforced Asymmetrical Aluminum Gullwing Swingarm & Piggyback Monoshock
    const swingarmL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.11, 0.74), this.silverTrimMat);
    swingarmL.position.set(-0.14, 0.32, -0.52);
    swingarmL.rotation.x = -0.14;

    const swingarmR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.11, 0.74), this.silverTrimMat);
    swingarmR.position.set(0.14, 0.32, -0.52);
    swingarmR.rotation.x = -0.14;

    const swingarmCrossArch = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.14), this.silverTrimMat);
    swingarmCrossArch.position.set(0, 0.36, -0.32);

    // Rear Paddock Stand Bobbins / Spools & Chain Adjuster Bolts
    [-0.18, 0.18].forEach((xSide) => {
      const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.03, 10), this.goldAnodizedMat);
      spool.rotation.z = Math.PI / 2;
      spool.position.set(xSide > 0 ? xSide + 0.01 : xSide - 0.01, 0.28, -0.85);

      const tensionBolt = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.04, 8), this.chromeMat);
      tensionBolt.rotation.x = Math.PI / 2;
      tensionBolt.position.set(xSide, 0.28, -0.92);
      bike.add(spool, tensionBolt);
    });

    // Carbon Rear Tire Hugger / Chain Guard
    const rearHugger = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.18, 20, 1, false, 0, Math.PI * 0.45), this.carbonFiberMat);
    rearHugger.rotation.z = Math.PI / 2;
    rearHugger.rotation.x = -Math.PI * 0.22;
    rearHugger.position.set(-0.02, 0.30, -0.82);

    // Piggyback Gas-Charged Monoshock Suspension
    const monoShockBody = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.34, 16), this.chromeMat);
    monoShockBody.position.set(0, 0.48, -0.35);
    monoShockBody.rotation.x = 0.52;

    const monoShockSpring = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.26, 16), this.suspensionSpringMat);
    monoShockSpring.position.set(0, 0.48, -0.35);
    monoShockSpring.rotation.x = 0.52;

    const piggybackCanister = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.14, 14), this.goldAnodizedMat);
    piggybackCanister.position.set(0.06, 0.56, -0.32);
    piggybackCanister.rotation.x = 0.52;

    bike.add(swingarmL, swingarmR, swingarmCrossArch, rearHugger, monoShockBody, monoShockSpring, piggybackCanister);

    // --- C. TWO WHEELS ONLY (FRONT & REAR RADIAL WHEELS) ---
    // 1. Front Wheel & Dual ABS Floating Petal Brake Discs (`id: 'm-brakes'`, position [0, 0.28, 0.95])
    const frontWheel = new THREE.Group();
    frontWheel.position.set(0, 0.28, 0.95);

    // 120/70 ZR17 Curved Sport Radial Tyre
    const fTire = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.13, 32), this.tireTreadMat);
    fTire.rotation.z = Math.PI / 2;

    // 17" Lightweight 10-Spoke Y-Pattern Alloy Rim
    const fRim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.135, 24, 1, true), this.darkMetalMat);
    fRim.rotation.z = Math.PI / 2;

    const fHub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.145, 18), this.engineCastMat);
    fHub.rotation.z = Math.PI / 2;

    // 5 Pairs of Y-Pattern Spokes
    for (let s = 0; s < 5; s++) {
      const angle = (s * Math.PI * 2) / 5;
      const spokeA = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.18, 0.025), this.silverTrimMat);
      spokeA.rotation.x = angle + 0.1;
      const spokeB = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.18, 0.025), this.silverTrimMat);
      spokeB.rotation.x = angle - 0.1;
      frontWheel.add(spokeA, spokeB);
    }

    // Dual 320mm Floating Drilled Petal Brake Discs with 8 Floating Bobbins per disc
    [-0.08, 0.08].forEach((xSide) => {
      const fDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.015, 24), this.brakeDiscMat);
      fDisc.rotation.z = Math.PI / 2;
      fDisc.position.x = xSide;

      const fDiscCarrier = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.018, 18), this.goldAnodizedMat);
      fDiscCarrier.rotation.z = Math.PI / 2;
      fDiscCarrier.position.x = xSide;

      // 8 Floating Rotor Rivet Bobbins
      for (let b = 0; b < 8; b++) {
        const bobbinAngle = (b * Math.PI * 2) / 8;
        const bobbin = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.02, 10), this.goldAnodizedMat);
        bobbin.rotation.z = Math.PI / 2;
        bobbin.position.set(xSide, Math.cos(bobbinAngle) * 0.13, Math.sin(bobbinAngle) * 0.13);
        frontWheel.add(bobbin);
      }

      // Brembo Radial-Mount 4-Piston Monoblock Calipers with Logo Detailing
      const fCaliper = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.11, 0.09), this.caliperOrangeMat);
      fCaliper.position.set(xSide, 0.12, -0.06);

      const bremboBadge = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.04, 0.05), this.chromeMat);
      bremboBadge.position.set(xSide > 0 ? xSide + 0.028 : xSide - 0.028, 0.12, -0.06);

      frontWheel.add(fDisc, fDiscCarrier, fCaliper, bremboBadge);
    });

    frontWheel.add(fTire, fRim, fHub);
    this.tagMesh(frontWheel, 'm-brakes', 'Dual 320mm Drilled Floating Discs & Brembo Radial Calipers', [0, 0, 0.45]);
    bike.add(frontWheel);

    // 2. Rear Wheel & 180/55 ZR17 Sport Radial Tyre (`id: 'm-tyres'`, position [0, 0.28, -0.85])
    const rearWheel = new THREE.Group();
    rearWheel.position.set(0, 0.28, -0.85);

    // Wide 180-Section Rear Tyre
    const rTire = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.20, 32), this.tireTreadMat);
    rTire.rotation.z = Math.PI / 2;

    const rRim = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.205, 24), this.darkMetalMat);
    rRim.rotation.z = Math.PI / 2;

    const rHub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.215, 18), this.engineCastMat);
    rHub.rotation.z = Math.PI / 2;

    // Matching Y-pattern rear spokes
    for (let s = 0; s < 5; s++) {
      const angle = (s * Math.PI * 2) / 5;
      const rSpoke = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.19, 0.03), this.silverTrimMat);
      rSpoke.rotation.x = angle;
      rearWheel.add(rSpoke);
    }

    // Rear 245mm Brake Disc & Single-Piston Caliper (Right side)
    const rDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.015, 20), this.brakeDiscMat);
    rDisc.rotation.z = Math.PI / 2;
    rDisc.position.x = 0.11;

    const rCaliper = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.08), this.caliperOrangeMat);
    rCaliper.position.set(0.11, 0.10, 0.05);

    rearWheel.add(rTire, rRim, rHub, rDisc, rCaliper);
    this.tagMesh(rearWheel, 'm-tyres', '180/55 ZR17 Sport Radial Tyres (Rear)', [0, 0, -0.45]);
    bike.add(rearWheel);

    return bike;
  }

  // =========================================================================
  // MODEL 2B — SCOOTER (High-Detail Maxi-Scooter Digital Twin)
  // =========================================================================
  public static createScooter(
    colorHex: number = 0xf8fafc,
    isXRay: boolean = false,
    isWireframe: boolean = false
  ): THREE.Group {
    const scooter = new THREE.Group();
    scooter.name = 'VehicleModel_Scooter';

    const bodyMat = this.getPaintMaterial(colorHex, isXRay, isWireframe);
    const glassMat = this.getGlassMaterial(isWireframe);

    const bodyGroup = new THREE.Group();
    bodyGroup.name = 'Scooter_BodyGroup';
    bodyGroup.userData = { explodedOffset: new THREE.Vector3(0, 0.40, 0) };

    // 1. Step-Through Floorboard & Central Spine Tunnel
    const floorboard = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.72), this.trimBlackMat);
    floorboard.position.set(0, 0.24, 0.12);
    const centerTunnel = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.28, 0.65), bodyMat);
    centerTunnel.position.set(0, 0.40, 0.12);
    bodyGroup.add(floorboard, centerTunnel);

    // 2. Sculpted Front Apron, Aerodynamic Fairing & Smoked Windscreen
    const frontApron = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.65, 0.42), bodyMat);
    frontApron.position.set(0, 0.64, 0.62);
    frontApron.rotation.x = -0.24;

    const windscreen = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.42, 0.03), glassMat);
    windscreen.position.set(0, 1.02, 0.58);
    windscreen.rotation.x = -0.35;

    // Split Dual LED Projector Headlights
    [-0.14, 0.14].forEach((xSide) => {
      const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.11, 0.04), this.ledWhiteMat);
      headlight.position.set(xSide, 0.56, 0.82);
      headlight.rotation.y = xSide > 0 ? -0.15 : 0.15;
      bodyGroup.add(headlight);
    });

    bodyGroup.add(frontApron, windscreen);

    // 3. Fully Enclosed Cockpit, Handlebar Cowl & Digital LCD Cluster
    const handleCowl = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.14, 0.20), bodyMat);
    handleCowl.position.set(0, 0.94, 0.46);
    const lcdCluster = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.08), this.ledWhiteMat);
    lcdCluster.position.set(0, 0.96, 0.42);
    lcdCluster.rotation.x = -Math.PI * 0.3;
    bodyGroup.add(handleCowl, lcdCluster);

    // 4. Under-Seat Body Shell, Comfort Saddle & LED Tail Cluster
    const underSeatBody = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.48, 1.02), bodyMat);
    underSeatBody.position.set(0, 0.52, -0.42);

    const plushSeat = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.16, 0.92), this.trimBlackMat);
    plushSeat.position.set(0, 0.76, -0.40);
    plushSeat.rotation.x = -0.06;

    const tailLight = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.14, 0.05), this.ledRedMat);
    tailLight.position.set(0, 0.60, -0.94);

    const pillionGrabRails = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.04, 0.32), this.silverTrimMat);
    pillionGrabRails.position.set(0, 0.78, -0.76);

    bodyGroup.add(underSeatBody, plushSeat, tailLight, pillionGrabRails);
    scooter.add(bodyGroup);

    // --- SCOOTER MECHANICAL COMPONENTS ---
    // 1. ENGINE & V-MATIC CVT CASE (`id: 's-engine'`, position [0, 0.32, -0.25])
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 0.32, -0.25);

    const eng = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.28, 0.40), this.engineCastMat);
    const cvtCase = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.20, 0.62), this.silverTrimMat);
    cvtCase.position.set(-0.20, -0.04, -0.15);

    const scooterExhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.085, 0.58, 16), this.exhaustPipeMat);
    scooterExhaust.rotation.x = Math.PI / 2 - 0.2;
    scooterExhaust.position.set(0.22, -0.04, -0.18);

    engineGroup.add(eng, cvtCase, scooterExhaust);
    this.tagMesh(engineGroup, 's-engine', '160cc 4-Valve eSP+ Liquid-Cooled Engine', [0, 0.25, 0.15]);
    scooter.add(engineGroup);

    // 2. FRONT WHEEL & HYDRAULIC DISC BRAKE (`id: 's-brakes'`, position [0, 0.22, 0.82])
    const frontWheel = new THREE.Group();
    frontWheel.position.set(0, 0.22, 0.82);

    const fTire = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.11, 24), this.tireTreadMat);
    fTire.rotation.z = Math.PI / 2;
    const fRim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 18), this.darkMetalMat);
    fRim.rotation.z = Math.PI / 2;
    const fDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.02, 16), this.brakeDiscMat);
    fDisc.rotation.z = Math.PI / 2;
    fDisc.position.x = 0.06;
    const fCaliper = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.07, 0.06), this.caliperOrangeMat);
    fCaliper.position.set(0.06, 0.08, -0.04);

    frontWheel.add(fTire, fRim, fDisc, fCaliper);
    this.tagMesh(frontWheel, 's-brakes', 'Front Hydraulic Disc Brakes (Single-Channel ABS)', [0, 0, 0.3]);
    scooter.add(frontWheel);

    // 3. REAR WHEEL & TUBELESS TYRE (`id: 's-tyres'`, position [0, 0.22, -0.72])
    const rearWheel = new THREE.Group();
    rearWheel.position.set(0, 0.22, -0.72);

    const rTire = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.14, 24), this.tireTreadMat);
    rTire.rotation.z = Math.PI / 2;
    const rRim = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.15, 18), this.darkMetalMat);
    rRim.rotation.z = Math.PI / 2;

    rearWheel.add(rTire, rRim);
    this.tagMesh(rearWheel, 's-tyres', '13-Inch Tubeless Rear Scooter Tyre', [0, 0, -0.3]);
    scooter.add(rearWheel);

    return scooter;
  }

  // =========================================================================
  // MODEL 3 — RC CAR (Hobby-Grade Off-Road 1/10 Brushless Vehicle)
  // =========================================================================
  public static createRcCar(
    colorHex: number = 0xea580c,
    isXRay: boolean = false,
    isWireframe: boolean = false
  ): THREE.Group {
    const rc = new THREE.Group();
    rc.name = 'VehicleModel_RcCar';

    const accentMat = this.getPaintMaterial(colorHex, isXRay, isWireframe);

    // --- A. RC COMPOSITE CHASSIS TUB & BODY POSTS ---
    const chassisGroup = new THREE.Group();
    chassisGroup.name = 'RC_ChassisGroup';
    chassisGroup.userData = { explodedOffset: new THREE.Vector3(0, 0.2, 0) };

    // 1. Low-CG Bathtub Composite Chassis Pan with Kick-Up Nose
    const chassisTub = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.05, 1.4), this.darkMetalMat);
    chassisTub.position.set(0, 0.16, -0.05);

    const kickUpNose = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.05, 0.28), this.darkMetalMat);
    kickUpNose.position.set(0, 0.19, 0.72);
    kickUpNose.rotation.x = -0.22; // 12° front kick-up
    chassisGroup.add(chassisTub, kickUpNose);

    // Side Nerf Bars / Guards
    [-0.46, 0.46].forEach((xSide) => {
      const nerfBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 1.1), this.darkMetalMat);
      nerfBar.position.set(xSide, 0.19, 0);
      chassisGroup.add(nerfBar);
    });

    // Flexible High-Impact Nylon Front & Rear Bumpers
    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.12, 0.16), this.darkMetalMat);
    frontBumper.position.set(0, 0.22, 0.9);
    const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.12, 0.16), this.darkMetalMat);
    rearBumper.position.set(0, 0.22, -0.9);

    // Upright Front & Rear Carbon Fiber Shock Towers
    const frontTower = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.36, 0.06), this.carbonFiberMat);
    frontTower.position.set(0, 0.36, 0.55);
    const rearTower = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.36, 0.06), this.carbonFiberMat);
    rearTower.position.set(0, 0.36, -0.55);

    // Polycarbonate Buggy Body Shell with Roof Scoop & High Rear Wing
    const buggyShell = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.22, 1.15), accentMat);
    buggyShell.position.set(0, 0.38, 0);

    const rcRearWing = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.03, 0.25), accentMat);
    rcRearWing.position.set(0, 0.52, -0.78);
    rcRearWing.rotation.x = -0.2;

    const ledRoofBar = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.05, 0.05), this.darkMetalMat);
    ledRoofBar.position.set(0, 0.50, 0.32);
    const ledRoofLens = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.025, 0.02), this.ledWhiteMat);
    ledRoofLens.position.set(0, 0.50, 0.35);

    chassisGroup.add(frontBumper, rearBumper, frontTower, rearTower, buggyShell, rcRearWing, ledRoofBar, ledRoofLens);
    rc.add(chassisGroup);

    // --- B. INDEPENDENT SUSPENSION & COILOVER SHOCKS ---
    // Double Wishbone Lower A-Arms
    const armPositions: [number, number, number][] = [
      [-0.38, 0.18, 0.55],
      [0.38, 0.18, 0.55],
      [-0.38, 0.18, -0.55],
      [0.38, 0.18, -0.55]
    ];
    armPositions.forEach((pos) => {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.03, 0.18), this.darkMetalMat);
      arm.position.set(pos[0], pos[1], pos[2]);
      rc.add(arm);
    });

    // 4x Oil-Filled Coilover Shocks with Anodized Bodies & Orange Springs
    const shockPositions: [number, number, number][] = [
      [-0.3, 0.34, 0.55],
      [0.3, 0.34, 0.55],
      [-0.3, 0.34, -0.55],
      [0.3, 0.34, -0.55]
    ];
    shockPositions.forEach((pos) => {
      const shockBody = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.3, 14), this.goldAnodizedMat);
      shockBody.position.set(pos[0], pos[1], pos[2]);
      shockBody.rotation.z = pos[0] > 0 ? 0.32 : -0.32;
      const spring = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.24, 14), this.caliperOrangeMat);
      spring.position.set(pos[0], pos[1] - 0.02, pos[2]);
      spring.rotation.z = pos[0] > 0 ? 0.32 : -0.32;
      rc.add(shockBody, spring);
    });

    // Anodized Center Driveshaft
    const centerDriveshaft = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.2, 16), this.goldAnodizedMat);
    centerDriveshaft.rotation.x = Math.PI / 2;
    centerDriveshaft.position.set(0, 0.21, 0);
    rc.add(centerDriveshaft);

    // --- C. RC ELECTRONICS & POWERTRAIN ---
    // 1. BRUSHLESS MOTOR (`id: 'rc-motor'`, position [-0.18, 0.28, -0.35])
    const motorGroup = new THREE.Group();
    motorGroup.position.set(-0.18, 0.28, -0.35);
    const motorCan = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.32, 20), this.caliperOrangeMat);
    motorCan.rotation.x = Math.PI / 2;
    for (let fin = 0; fin < 5; fin++) {
      const finRing = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.015, 20), this.brushedSteelMat);
      finRing.rotation.x = Math.PI / 2;
      finRing.position.set(0, 0, -0.1 + fin * 0.05);
      motorGroup.add(finRing);
    }
    // 3 Phase Silicone Motor Wires (Blue, Yellow, Orange)
    const wireColors = [0x0284c7, 0xeab308, 0xea580c];
    wireColors.forEach((wCol, idx) => {
      const wire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.28, 10),
        new THREE.MeshStandardMaterial({ color: wCol, roughness: 0.5 })
      );
      wire.position.set(-0.05 + idx * 0.05, 0.13, 0.05);
      wire.rotation.x = Math.PI * 0.2;
      motorGroup.add(wire);
    });
    motorGroup.add(motorCan);
    this.tagMesh(motorGroup, 'rc-motor', 'Velineon 3500kV Sensorless Brushless Motor', [-0.3, 0.25, -0.2]);
    rc.add(motorGroup);

    // 2. ESC SPEED CONTROLLER (`id: 'rc-esc'`, position [0.18, 0.32, -0.15])
    const escGroup = new THREE.Group();
    escGroup.position.set(0.18, 0.32, -0.15);
    const escCase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.22), this.darkMetalMat);
    const escFanShroud = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.18), this.caliperOrangeMat);
    escFanShroud.position.set(0, 0.1, 0);
    escGroup.add(escCase, escFanShroud);
    this.tagMesh(escGroup, 'rc-esc', 'VXL-3s Waterproof ESC Speed Controller', [0.3, 0.25, -0.1]);
    rc.add(escGroup);

    // 3. 3S LIPO BATTERY (`id: 'rc-battery'`, position [-0.22, 0.24, 0.05])
    const lipoGroup = new THREE.Group();
    lipoGroup.position.set(-0.22, 0.24, 0.05);
    const lipoCase = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.15, 0.68), this.darkMetalMat);
    const lipoStrap = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.17, 0.14), this.caliperOrangeMat);
    lipoGroup.add(lipoCase, lipoStrap);
    this.tagMesh(lipoGroup, 'rc-battery', '3S 11.1V 5000mAh Hardcase LiPo Battery', [-0.3, 0.2, 0.1]);
    rc.add(lipoGroup);

    // 4. STEERING SERVO & TIE RODS (`id: 'rc-servo'`, position [0.15, 0.26, 0.45])
    const servoGroup = new THREE.Group();
    servoGroup.position.set(0.15, 0.26, 0.45);
    const servoBody = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.18), this.darkMetalMat);
    const servoHorn = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.14), this.goldAnodizedMat);
    servoHorn.position.set(0, 0.09, 0.05);
    servoGroup.add(servoBody, servoHorn);
    this.tagMesh(servoGroup, 'rc-servo', 'High-Torque Metal-Gear Digital Servo', [0.25, 0.2, 0.3]);
    rc.add(servoGroup);

    // --- D. 4 RC OFF-ROAD BEADLOCK WHEELS ---
    const rcWheelPositions: [number, number, number][] = [
      [-0.58, 0.24, 0.55],
      [0.58, 0.24, 0.55],
      [-0.58, 0.24, -0.55],
      [0.58, 0.24, -0.55]
    ];
    rcWheelPositions.forEach((pos) => {
      const isRight = pos[0] > 0;
      const wg = new THREE.Group();
      wg.position.set(pos[0], pos[1], pos[2]);

      // Chunky knobby off-road tread tire
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.22, 24), this.tireTreadMat);
      tire.rotation.z = Math.PI / 2;
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.225, 18), this.darkMetalMat);
      rim.rotation.z = Math.PI / 2;
      const beadlockRing = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.018, 8, 20), this.caliperOrangeMat);
      beadlockRing.position.x = isRight ? -0.11 : 0.11;
      beadlockRing.rotation.y = Math.PI / 2;

      wg.add(tire, rim, beadlockRing);
      rc.add(wg);
    });

    return rc;
  }

  // Compatibility aliases
  public static createSuv(colorHex: number = 0x1d3557, isXRay: boolean = false, isWireframe: boolean = false): THREE.Group {
    return this.createSedan(colorHex, isXRay, isWireframe);
  }

  public static createCompactSuv(colorHex: number = 0x1d3557, isXRay: boolean = false, isWireframe: boolean = false): THREE.Group {
    return this.createSedan(colorHex, isXRay, isWireframe);
  }
}
