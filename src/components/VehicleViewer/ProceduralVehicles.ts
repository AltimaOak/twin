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
  // MODEL 2 — BIKE / SCOOTER (Real Two-Wheeled Motorcycle & Scooter)
  // =========================================================================
  public static createMotorcycle(
    colorHex: number = 0xea580c,
    isXRay: boolean = false,
    isWireframe: boolean = false
  ): THREE.Group {
    const bike = new THREE.Group();
    bike.name = 'VehicleModel_Motorcycle';

    const frameMat = this.getPaintMaterial(colorHex, isXRay, isWireframe);

    // --- A. FRAME, TANK, SEAT, FORK & COCKPIT ---
    const bodyGroup = new THREE.Group();
    bodyGroup.name = 'Bike_BodyGroup';
    bodyGroup.userData = { explodedOffset: new THREE.Vector3(0, 0.35, 0) };

    // 1. Tubular Steel Trellis Frame (Only 2 wheels, zero car chassis)
    [-0.13, 0.13].forEach((xSide) => {
      const topSpine = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 1.15, 14), this.darkMetalMat);
      topSpine.position.set(xSide, 0.58, 0.1);
      topSpine.rotation.x = 0.54;

      const downCradle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.85, 14), this.darkMetalMat);
      downCradle.position.set(xSide, 0.42, 0.34);
      downCradle.rotation.x = -0.68;

      bodyGroup.add(topSpine, downCradle);
    });

    // 2. Sculpted Muscle Fuel Tank (Parametric Curve)
    const tankShape = new THREE.Shape();
    tankShape.moveTo(0, 0);
    tankShape.quadraticCurveTo(0.18, 0.35, 0.45, 0.36);
    tankShape.quadraticCurveTo(0.68, 0.32, 0.72, 0.10);
    tankShape.quadraticCurveTo(0.40, -0.05, 0, 0);
    const tankGeo = new THREE.ExtrudeGeometry(tankShape, { depth: 0.38, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 3 });
    tankGeo.center();
    const tankMesh = new THREE.Mesh(tankGeo, frameMat);
    tankMesh.position.set(0, 0.74, 0.2);
    tankMesh.rotation.y = Math.PI / 2;

    const gasCap = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.02, 16), this.chromeMat);
    gasCap.position.set(0, 0.94, 0.3);
    bodyGroup.add(tankMesh, gasCap);

    // 3. Ergonomic Two-Tier Saddle
    const riderSeat = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.45), this.tireTreadMat);
    riderSeat.position.set(0, 0.68, -0.22);
    riderSeat.rotation.x = -0.08;
    const pillionSeat = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.1, 0.3), this.tireTreadMat);
    pillionSeat.position.set(0, 0.75, -0.52);
    pillionSeat.rotation.x = 0.08;
    bodyGroup.add(riderSeat, pillionSeat);

    // 4. Tail Cowl & Compact LED Taillight
    const tailCowl = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.13, 0.42), frameMat);
    tailCowl.position.set(0, 0.72, -0.68);
    tailCowl.rotation.x = 0.15;
    const tailLamp = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.03), this.ledRedMat);
    tailLamp.position.set(0, 0.73, -0.89);
    bodyGroup.add(tailCowl, tailLamp);

    // 5. Front Headlight & Handlebar Controls
    const hlMask = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.25, 0.16), frameMat);
    hlMask.position.set(0, 0.78, 0.68);
    hlMask.rotation.x = -0.2;
    const hlLED = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.11, 0.04), this.ledWhiteMat);
    hlLED.position.set(0, 0.76, 0.76);
    hlLED.rotation.x = -0.2;
    bodyGroup.add(hlMask, hlLED);

    const handlebar = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.76, 16), this.darkMetalMat);
    handlebar.rotation.z = Math.PI / 2;
    handlebar.position.set(0, 0.94, 0.54);
    const tftCluster = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.02), this.chromeMat);
    tftCluster.position.set(0, 0.94, 0.48);
    tftCluster.rotation.x = -Math.PI * 0.25;
    bodyGroup.add(handlebar, tftCluster);

    // Inverted Gold Telescopic Front Forks
    [-0.14, 0.14].forEach((xSide) => {
      const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.88, 16), this.goldAnodizedMat);
      fork.position.set(xSide, 0.55, 0.74);
      fork.rotation.x = -0.36;
      bodyGroup.add(fork);
    });

    bike.add(bodyGroup);

    // --- B. MOTORCYCLE MECHANICAL COMPONENTS ---
    // 1. ENGINE (`id: 'm-engine'`, position [0, 0.45, 0.05])
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 0.45, 0.05);
    const crankcase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.35, 0.48), this.engineCastMat);
    // Cylinder block with stacked cooling fin rings
    const cylinderHead = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.36, 16), this.engineOrangeMat);
    cylinderHead.rotation.x = 0.28;
    cylinderHead.position.set(0, 0.24, 0.08);
    for (let f = 0; f < 4; f++) {
      const fin = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.015, 16), this.engineCastMat);
      fin.rotation.x = 0.28;
      fin.position.set(0, 0.14 + f * 0.06, 0.05 + f * 0.02);
      engineGroup.add(fin);
    }
    const headerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.65, 16), this.chromeMat);
    headerPipe.rotation.x = Math.PI * 0.45;
    headerPipe.position.set(0.13, 0.05, 0.32);
    const underMuffler = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.52, 16), this.brushedSteelMat);
    underMuffler.rotation.x = Math.PI / 2 - 0.2;
    underMuffler.position.set(0.16, -0.15, -0.24);
    engineGroup.add(crankcase, cylinderHead, headerPipe, underMuffler);
    this.tagMesh(engineGroup, 'm-engine', '348cc 4-Stroke SI Motorcycle Engine', [0, 0.3, 0.2]);
    bike.add(engineGroup);

    // 2. O-RING DRIVE CHAIN & SPROCKETS (`id: 'm-chain'`, position [-0.18, 0.26, -0.65])
    const chainGroup = new THREE.Group();
    chainGroup.position.set(-0.18, 0.26, -0.65);
    const fSprocket = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.02, 16), this.darkMetalMat);
    fSprocket.rotation.z = Math.PI / 2;
    fSprocket.position.set(0, 0.12, 0.45);
    const rSprocket = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.02, 20), this.brushedSteelMat);
    rSprocket.rotation.z = Math.PI / 2;
    rSprocket.position.set(0, 0.02, -0.2);
    const chainLoop = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.68), this.goldAnodizedMat);
    chainLoop.position.set(0, 0.06, 0.12);
    chainGroup.add(fSprocket, rSprocket, chainLoop);
    this.tagMesh(chainGroup, 'm-chain', '520 Sealed O-Ring Final Drive Chain', [-0.3, 0, -0.2]);
    bike.add(chainGroup);

    // 3. AGM BATTERY (`id: 'm-battery'`, position [0, 0.58, -0.2])
    const batteryGroup = new THREE.Group();
    batteryGroup.position.set(0, 0.58, -0.2);
    const bat = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.18), this.batteryLeadMat);
    const bPos = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.04, 12), this.batteryPosMat);
    bPos.position.set(-0.06, 0.1, 0.04);
    const bNeg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.04, 12), this.batteryNegMat);
    bNeg.position.set(0.06, 0.1, 0.04);
    batteryGroup.add(bat, bPos, bNeg);
    this.tagMesh(batteryGroup, 'm-battery', '12V 8.6Ah Sealed AGM Battery', [0, 0.25, -0.1]);
    bike.add(batteryGroup);

    // 4. Rear Swingarm & Monoshock
    const swingarm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.09, 0.72), this.brushedSteelMat);
    swingarm.position.set(0, 0.32, -0.52);
    swingarm.rotation.x = -0.14;
    const monoShock = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.34, 16), this.suspensionSpringMat);
    monoShock.position.set(0, 0.46, -0.35);
    monoShock.rotation.x = 0.55;
    bike.add(swingarm, monoShock);

    // --- C. TWO WHEELS ONLY (FRONT WHEEL & REAR WHEEL) ---
    // 1. Front Wheel & ABS Brake Disc (`id: 'm-brakes'`, position [0, 0.28, 0.95])
    const frontWheel = new THREE.Group();
    frontWheel.position.set(0, 0.28, 0.95);
    const fTire = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.13, 28), this.tireTreadMat);
    fTire.rotation.z = Math.PI / 2;
    const fRim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.14, 20, 1, true), this.silverTrimMat);
    fRim.rotation.z = Math.PI / 2;
    const fHub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.145, 16), this.silverTrimMat);
    fHub.rotation.z = Math.PI / 2;
    const fDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.015, 20), this.brakeDiscMat);
    fDisc.rotation.z = Math.PI / 2;
    fDisc.position.x = 0.08;
    const fCaliper = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.08), this.caliperOrangeMat);
    fCaliper.position.set(0.08, 0.12, -0.05);
    frontWheel.add(fTire, fRim, fHub, fDisc, fCaliper);
    this.tagMesh(frontWheel, 'm-brakes', 'Dual-Channel ABS Hydraulic Disc Brakes', [0, 0, 0.35]);
    bike.add(frontWheel);

    // 2. Rear Wheel & Sport Radial Tyre (`id: 'm-tyres'`, position [0, 0.28, -0.85])
    const rearWheel = new THREE.Group();
    rearWheel.position.set(0, 0.28, -0.85);
    const rTire = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.2, 28), this.tireTreadMat);
    rTire.rotation.z = Math.PI / 2;
    const rRim = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.21, 20), this.brushedSteelMat);
    rRim.rotation.z = Math.PI / 2;
    const rDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.015, 18), this.brakeDiscMat);
    rDisc.rotation.z = Math.PI / 2;
    rDisc.position.x = 0.11;
    const rCaliper = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.07), this.caliperOrangeMat);
    rCaliper.position.set(0.11, 0.1, 0.04);
    rearWheel.add(rTire, rRim, rDisc, rCaliper);
    this.tagMesh(rearWheel, 'm-tyres', 'Sport Touring Radial Tyres', [0, 0, -0.35]);
    bike.add(rearWheel);

    return bike;
  }

  // Support dedicated step-through scooter geometry
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
    bodyGroup.userData = { explodedOffset: new THREE.Vector3(0, 0.35, 0) };

    // Step-Through Floorboard & Tunnel
    const floorboard = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.65), this.trimBlackMat);
    floorboard.position.set(0, 0.24, 0.1);
    const centerTunnel = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.24, 0.58), bodyMat);
    centerTunnel.position.set(0, 0.38, 0.1);
    bodyGroup.add(floorboard, centerTunnel);

    // Front Apron & Windshield
    const frontApron = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.62, 0.38), bodyMat);
    frontApron.position.set(0, 0.62, 0.58);
    frontApron.rotation.x = -0.22;
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.03), glassMat);
    windshield.position.set(0, 0.98, 0.55);
    windshield.rotation.x = -0.32;
    const dualLedHeadlight = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.14, 0.04), this.ledWhiteMat);
    dualLedHeadlight.position.set(0, 0.52, 0.78);
    bodyGroup.add(frontApron, windshield, dualLedHeadlight);

    // Enclosed Cockpit & Handlebar
    const handleCowl = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 0.16), bodyMat);
    handleCowl.position.set(0, 0.92, 0.44);
    bodyGroup.add(handleCowl);

    // Under-Seat Storage Body & Plush Stepped Seat
    const underSeatBody = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.45, 0.95), bodyMat);
    underSeatBody.position.set(0, 0.52, -0.42);
    const plushSeat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.14, 0.88), this.trimBlackMat);
    plushSeat.position.set(0, 0.74, -0.4);
    plushSeat.rotation.x = -0.06;
    const tailLight = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.05), this.ledRedMat);
    tailLight.position.set(0, 0.58, -0.92);
    bodyGroup.add(underSeatBody, plushSeat, tailLight);

    scooter.add(bodyGroup);

    // Scooter Mechanical Components
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 0.32, -0.25);
    const eng = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.26, 0.36), this.engineCastMat);
    engineGroup.add(eng);
    this.tagMesh(engineGroup, 's-engine', '160cc eSP+ Engine', [0, 0.25, 0.15]);
    scooter.add(engineGroup);

    // 2 Scooter Wheels
    const frontWheel = new THREE.Group();
    frontWheel.position.set(0, 0.22, 0.82);
    const fTire = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.11, 24), this.tireTreadMat);
    fTire.rotation.z = Math.PI / 2;
    const fRim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 18), this.darkMetalMat);
    fRim.rotation.z = Math.PI / 2;
    const fDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.02, 16), this.brakeDiscMat);
    fDisc.rotation.z = Math.PI / 2;
    fDisc.position.x = 0.06;
    frontWheel.add(fTire, fRim, fDisc);
    this.tagMesh(frontWheel, 's-brakes', 'Front Hydraulic Disc Brakes (ABS)', [0, 0, 0.3]);
    scooter.add(frontWheel);

    const rearWheel = new THREE.Group();
    rearWheel.position.set(0, 0.22, -0.72);
    const rTire = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.14, 24), this.tireTreadMat);
    rTire.rotation.z = Math.PI / 2;
    const rRim = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.15, 18), this.darkMetalMat);
    rRim.rotation.z = Math.PI / 2;
    rearWheel.add(rTire, rRim);
    this.tagMesh(rearWheel, 's-tyres', '13-Inch Tubeless Scooter Tyres', [0, 0, -0.3]);
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
