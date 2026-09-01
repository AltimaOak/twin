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
        opacity: 0.65
      });
    }

    if (isXRay) {
      return new THREE.MeshPhysicalMaterial({
        color: 0x94a3b8,
        metalness: 0.1,
        roughness: 0.12,
        transmission: 0.86,
        transparent: true,
        opacity: 0.22,
        reflectivity: 0.6,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1
      });
    }

    return new THREE.MeshPhysicalMaterial({
      color: colorHex,
      metalness: 0.88,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.92,
      envMapIntensity: 1.2
    });
  }

  public static getGlassMaterial(isWireframe: boolean = false): THREE.Material {
    if (isWireframe) {
      return new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.4 });
    }
    return new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.15,
      roughness: 0.04,
      transmission: 0.76,
      transparent: true,
      opacity: 0.75,
      ior: 1.52,
      reflectivity: 0.9
    });
  }

  // Realistic Automotive Metals & Polymers
  private static chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.98, roughness: 0.06 });
  private static brushedSteelMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.88, roughness: 0.24 });
  private static darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.82, roughness: 0.35 });
  private static engineCastMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.72, roughness: 0.52 });
  private static goldAnodizedMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.92, roughness: 0.18 });
  private static copperMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.94, roughness: 0.22 });
  private static carbonFiberMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.55, roughness: 0.55 });
  private static trimBlackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.3, roughness: 0.7 });
  private static silverTrimMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.85, roughness: 0.3 });

  // Tire rubber with satin finish
  private static tireTreadMat = new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.92, metalness: 0.04 });
  private static brakeDiscMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.96, roughness: 0.16 });
  private static caliperOrangeMat = new THREE.MeshStandardMaterial({ color: 0xea580c, metalness: 0.5, roughness: 0.28 });
  private static caliperRedMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.5, roughness: 0.28 });
  private static batteryLeadMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.65, metalness: 0.1 });

  // Lighting
  private static ledWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x38bdf8,
    emissiveIntensity: 2.2,
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
  // 1. HIGH-FIDELITY PASSENGER SEDAN (Aerodynamic 4-Door Sedan)
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

    const bodyGroup = new THREE.Group();
    bodyGroup.name = 'Sedan_BodyGroup';
    bodyGroup.userData = { explodedOffset: new THREE.Vector3(0, 0.45, 0) };

    // 1. Lower Floorpan
    const floor = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.08, 3.86), this.darkMetalMat);
    floor.position.set(0, 0.22, 0);
    bodyGroup.add(floor);

    // 2. Aerodynamic Doors & Flared Arches
    [-0.78, 0.78].forEach((xSide) => {
      const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.38, 2.05), bodyMat);
      doorPanel.position.set(xSide, 0.44, 0.05);

      const creaseLine = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.02, 1.95), this.trimBlackMat);
      creaseLine.position.set(xSide > 0 ? xSide + 0.06 : xSide - 0.06, 0.48, 0.05);

      [-0.45, 0.45].forEach((zHandle) => {
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 0.12), this.chromeMat);
        handle.position.set(xSide > 0 ? xSide + 0.065 : xSide - 0.065, 0.52, zHandle);
        bodyGroup.add(handle);
      });

      const fArch = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.14, 16, 1, false, 0, Math.PI), bodyMat);
      fArch.rotation.z = Math.PI / 2;
      fArch.position.set(xSide, 0.32, 1.15);

      const rArch = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.14, 16, 1, false, 0, Math.PI), bodyMat);
      rArch.rotation.z = Math.PI / 2;
      rArch.position.set(xSide, 0.32, -1.05);

      const skirt = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 2.15), this.carbonFiberMat);
      skirt.position.set(xSide > 0 ? xSide + 0.02 : xSide - 0.02, 0.24, 0.05);

      bodyGroup.add(doorPanel, creaseLine, fArch, rArch, skirt);
    });

    // 3. Front Fascia, Grille & Bumper
    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.32, 0.45), bodyMat);
    frontBumper.position.set(0, 0.38, 1.84);
    const frontSplitter = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.04, 0.4), this.carbonFiberMat);
    frontSplitter.position.set(0, 0.21, 1.92);
    const meshGrille = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.18, 0.06), this.darkMetalMat);
    meshGrille.position.set(0, 0.42, 2.05);
    const brandEmblem = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.02, 20), this.chromeMat);
    brandEmblem.rotation.x = Math.PI / 2;
    brandEmblem.position.set(0, 0.44, 2.08);
    bodyGroup.add(frontBumper, frontSplitter, meshGrille, brandEmblem);

    // 4. Low Sculpted Hood
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 1.25), bodyMat);
    hood.position.set(0, 0.62, 1.15);
    hood.rotation.x = 0.045;
    bodyGroup.add(hood);

    // 5. Sleek Fastback Greenhouse & Windshields
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.04, 1.78), bodyMat);
    roof.position.set(0, 1.05, -0.16);
    const sharkFin = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.09, 4), bodyMat);
    sharkFin.rotation.y = Math.PI / 4;
    sharkFin.position.set(0, 1.1, -0.85);
    bodyGroup.add(roof, sharkFin);

    const frontWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.54, 0.03), glassMat);
    frontWindshield.position.set(0, 0.85, 0.62);
    frontWindshield.rotation.x = -Math.PI * 0.24;

    const rearWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.5, 0.03), glassMat);
    rearWindshield.position.set(0, 0.85, -0.96);
    rearWindshield.rotation.x = Math.PI * 0.26;

    [-0.69, 0.69].forEach((xSide) => {
      const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.34, 1.55), glassMat);
      sideGlass.position.set(xSide, 0.85, -0.16);
      const bPillar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.36, 0.09), this.trimBlackMat);
      bPillar.position.set(xSide > 0 ? xSide + 0.01 : xSide - 0.01, 0.85, -0.16);

      const mirrorArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.04), this.trimBlackMat);
      mirrorArm.position.set(xSide, 0.74, 0.52);
      const mirrorHousing = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.09, 0.08), bodyMat);
      mirrorHousing.position.set(xSide > 0 ? xSide + 0.09 : xSide - 0.09, 0.75, 0.52);
      const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.07), this.chromeMat);
      mirrorGlass.rotation.y = xSide > 0 ? -Math.PI / 2 : Math.PI / 2;
      mirrorGlass.position.set(xSide > 0 ? xSide + 0.08 : xSide - 0.08, 0.75, 0.52);

      bodyGroup.add(sideGlass, bPillar, mirrorArm, mirrorHousing, mirrorGlass);
    });
    bodyGroup.add(frontWindshield, rearWindshield);

    // 6. Trunk & Rear Diffuser
    const trunkLid = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.08, 0.85), bodyMat);
    trunkLid.position.set(0, 0.65, -1.45);
    const lipSpoiler = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.03, 0.14), this.carbonFiberMat);
    lipSpoiler.position.set(0, 0.72, -1.84);
    const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.34, 0.38), bodyMat);
    rearBumper.position.set(0, 0.38, -1.82);
    const rearDiffuser = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.12, 0.22), this.carbonFiberMat);
    rearDiffuser.position.set(0, 0.21, -1.94);
    bodyGroup.add(trunkLid, lipSpoiler, rearBumper, rearDiffuser);

    // 7. Matrix LED Headlights & 3D Rear Light Bar
    [-0.62, 0.62].forEach((xSide) => {
      const hlHousing = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.11, 0.14), this.darkMetalMat);
      hlHousing.position.set(xSide, 0.54, 1.94);
      hlHousing.rotation.y = xSide > 0 ? -0.16 : 0.16;
      const hlProjector = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16), this.ledWhiteMat);
      hlProjector.rotation.x = Math.PI / 2;
      hlProjector.position.set(xSide, 0.54, 2.01);
      const drlBrow = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.02, 0.03), this.ledAmberMat);
      drlBrow.position.set(xSide, 0.59, 2.01);
      drlBrow.rotation.y = xSide > 0 ? -0.16 : 0.16;
      bodyGroup.add(hlHousing, hlProjector, drlBrow);
    });

    const lightBarCenter = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.035, 0.05), this.ledRedMat);
    lightBarCenter.position.set(0, 0.62, -1.96);
    bodyGroup.add(lightBarCenter);

    car.add(bodyGroup);

    // --- B. INTERNAL MECHANICAL & HEALTH SUBSYSTEMS ---
    // Engine Bay
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 0.45, 1.15);
    const engineBlock = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.38, 0.54), this.engineCastMat);
    const valveCover = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.12, 0.48), this.brushedSteelMat);
    valveCover.position.set(0, 0.24, 0);
    const oilCap = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16), this.caliperOrangeMat);
    oilCap.position.set(-0.16, 0.31, 0.1);
    for (let i = 0; i < 4; i++) {
      const runner = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.26, 14), this.chromeMat);
      runner.position.set(-0.18 + i * 0.12, 0.2, 0.28);
      runner.rotation.x = Math.PI / 4;
      engineGroup.add(runner);
    }
    engineGroup.add(engineBlock, valveCover, oilCap);
    this.tagMesh(engineGroup, 'engine', 'Internal Combustion Engine', [0, 0.5, 0.3]);
    car.add(engineGroup);

    // Battery
    const batteryGroup = new THREE.Group();
    batteryGroup.position.set(-0.48, 0.5, 0.95);
    const batCasing = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.24, 0.2), this.batteryLeadMat);
    const termPos = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.05, 12), this.ledRedMat);
    termPos.position.set(-0.08, 0.14, 0.05);
    const termNeg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.05, 12), this.darkMetalMat);
    termNeg.position.set(0.08, 0.14, 0.05);
    batteryGroup.add(batCasing, termPos, termNeg);
    this.tagMesh(batteryGroup, 'battery', '12V Lead-Acid Starter Battery', [-0.3, 0.3, 0.2]);
    car.add(batteryGroup);

    // Cooling
    const coolingGroup = new THREE.Group();
    coolingGroup.position.set(0, 0.35, 1.6);
    const radCore = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.36, 0.08), this.brushedSteelMat);
    coolingGroup.add(radCore);
    this.tagMesh(coolingGroup, 'cooling', 'Cooling System & Radiator', [0, 0.3, 0.4]);
    car.add(coolingGroup);

    // Transmission
    const transGroup = new THREE.Group();
    transGroup.position.set(0.3, 0.35, 0.6);
    const cvtCase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.48, 20), this.darkMetalMat);
    cvtCase.rotation.x = Math.PI / 2;
    transGroup.add(cvtCase);
    this.tagMesh(transGroup, 'transmission', 'Continuously Variable Transmission (CVT)', [0.4, 0.2, 0.1]);
    car.add(transGroup);

    // Exhaust
    const exhaustGroup = new THREE.Group();
    exhaustGroup.position.set(0, 0.18, -1.4);
    const midPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.3, 16), this.brushedSteelMat);
    midPipe.rotation.x = Math.PI / 2;
    midPipe.position.set(0.12, 0.02, 0.6);
    const muffler = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.2, 0.45), this.darkMetalMat);
    muffler.position.set(0, 0.04, -0.15);
    [-0.15, 0.15].forEach((xTip) => {
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.048, 0.28, 16), this.chromeMat);
      tip.rotation.x = Math.PI / 2;
      tip.position.set(xTip, -0.02, -0.48);
      exhaustGroup.add(tip);
    });
    exhaustGroup.add(midPipe, muffler);
    this.tagMesh(exhaustGroup, 'exhaust', 'Exhaust & Catalytic Converter', [0, -0.3, -0.4]);
    car.add(exhaustGroup);

    // Suspension
    const suspGroup = new THREE.Group();
    suspGroup.position.set(0.65, 0.35, 1.1);
    const coilSpring = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.32, 16), this.caliperOrangeMat);
    suspGroup.add(coilSpring);
    this.tagMesh(suspGroup, 'suspension', 'MacPherson Strut Suspension', [0.3, 0.2, 0.2]);
    car.add(suspGroup);

    // 4 Wheels
    const wheelPositions: [number, number, number][] = [
      [-0.88, 0.25, 1.15],
      [0.88, 0.25, 1.15],
      [-0.88, 0.25, -1.05],
      [0.88, 0.25, -1.05]
    ];
    wheelPositions.forEach((pos, idx) => {
      const isRight = pos[0] > 0;
      const isFront = idx < 2;
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos[0], pos[1], pos[2]);

      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.24, 28), this.tireTreadMat);
      tire.rotation.z = Math.PI / 2;
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.245, 24), this.brushedSteelMat);
      rim.rotation.z = Math.PI / 2;
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.025, 20), this.brakeDiscMat);
      disc.rotation.z = Math.PI / 2;
      disc.position.x = isRight ? -0.06 : 0.06;
      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.11, 0.09), this.caliperOrangeMat);
      caliper.position.set(isRight ? -0.06 : 0.06, 0.11, 0.04);
      wheelGroup.add(tire, rim, disc, caliper);

      if (idx === 1) {
        this.tagMesh(wheelGroup, 'brakes', 'Hydraulic Disc Braking System', [0.4, 0, 0.2]);
      } else if (idx === 2) {
        this.tagMesh(wheelGroup, 'tyres', 'Radial Tyres (TPMS)', [-0.4, 0, -0.2]);
      } else {
        wheelGroup.userData = { explodedOffset: new THREE.Vector3(isRight ? 0.35 : -0.35, 0, isFront ? 0.15 : -0.15) };
      }
      car.add(wheelGroup);
    });

    return car;
  }

  // =========================================================================
  // 2. HIGH-FIDELITY FULL-SIZE SUV (Toyota Fortuner / Rugged 4x4 Twin)
  // =========================================================================
  public static createSuv(
    colorHex: number = 0x18181b,
    isXRay: boolean = false,
    isWireframe: boolean = false
  ): THREE.Group {
    const suv = new THREE.Group();
    suv.name = 'VehicleModel_SUV';

    const bodyMat = this.getPaintMaterial(colorHex, isXRay, isWireframe);
    const glassMat = this.getGlassMaterial(isWireframe);

    const bodyGroup = new THREE.Group();
    bodyGroup.name = 'SUV_BodyGroup';
    bodyGroup.userData = { explodedOffset: new THREE.Vector3(0, 0.5, 0) };

    // 1. High-Clearance Ladder Frame Underbody
    const chassisFrame = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.14, 4.2), this.darkMetalMat);
    chassisFrame.position.set(0, 0.32, 0);
    bodyGroup.add(chassisFrame);

    // 2. Commanding Tall Body & Massive Wheel Arches
    [-0.88, 0.88].forEach((xSide) => {
      const sideBody = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.58, 2.45), bodyMat);
      sideBody.position.set(xSide, 0.62, 0.05);

      // Black protective wheel cladding
      const fArchClad = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.18, 16, 1, false, 0, Math.PI), this.trimBlackMat);
      fArchClad.rotation.z = Math.PI / 2;
      fArchClad.position.set(xSide, 0.45, 1.25);

      const rArchClad = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.18, 16, 1, false, 0, Math.PI), this.trimBlackMat);
      rArchClad.rotation.z = Math.PI / 2;
      rArchClad.position.set(xSide, 0.45, -1.15);

      // Heavy Duty Side Steps (Running Boards)
      const sideStep = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 2.1), this.silverTrimMat);
      sideStep.position.set(xSide > 0 ? xSide + 0.08 : xSide - 0.08, 0.34, 0.05);

      bodyGroup.add(sideBody, fArchClad, rArchClad, sideStep);
    });

    // 3. Upright Front Fascia, Massive Grille & Bull Bumper
    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.45, 0.5), bodyMat);
    frontBumper.position.set(0, 0.52, 2.0);
    const skidPlate = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.45), this.silverTrimMat);
    skidPlate.position.set(0, 0.32, 2.05);
    const suvGrille = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.32, 0.08), this.darkMetalMat);
    suvGrille.position.set(0, 0.65, 2.22);
    bodyGroup.add(frontBumper, skidPlate, suvGrille);

    // 4. Tall Muscular Hood
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.1, 1.45), bodyMat);
    hood.position.set(0, 0.86, 1.25);
    bodyGroup.add(hood);

    // 5. Upright 3-Row Cabin & Roof Rails
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.05, 2.45), bodyMat);
    roof.position.set(0, 1.38, -0.22);

    // Functional Roof Rack Rails
    [-0.65, 0.65].forEach((xSide) => {
      const roofRail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 2.3), this.silverTrimMat);
      roofRail.position.set(xSide, 1.44, -0.22);
      bodyGroup.add(roofRail);
    });

    const frontWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.56, 0.04), glassMat);
    frontWindshield.position.set(0, 1.12, 0.72);
    frontWindshield.rotation.x = -Math.PI * 0.18;

    const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.52, 0.04), glassMat);
    rearGlass.position.set(0, 1.12, -1.42);
    rearGlass.rotation.x = Math.PI * 0.08;

    [-0.78, 0.78].forEach((xSide) => {
      const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.44, 2.1), glassMat);
      sideGlass.position.set(xSide, 1.12, -0.32);
      bodyGroup.add(sideGlass);
    });
    bodyGroup.add(roof, frontWindshield, rearGlass);

    // 6. Upright Rear Tailgate & Tail Bumper
    const rearTailgate = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.58, 0.35), bodyMat);
    rearTailgate.position.set(0, 0.64, -1.95);
    const rearSkid = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.25), this.silverTrimMat);
    rearSkid.position.set(0, 0.34, -2.08);
    bodyGroup.add(rearTailgate, rearSkid);

    // 7. Quad LED Headlights & Vertical LED Taillights
    [-0.68, 0.68].forEach((xSide) => {
      const hlMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.16, 0.06), this.ledWhiteMat);
      hlMesh.position.set(xSide, 0.74, 2.22);
      const tlMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.06), this.ledRedMat);
      tlMesh.position.set(xSide, 0.88, -2.1);
      bodyGroup.add(hlMesh, tlMesh);
    });

    suv.add(bodyGroup);

    // Mechanical Subsystems
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 0.62, 1.25);
    const v6Engine = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.48, 0.65), this.engineCastMat);
    const topIntercooler = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.45), this.silverTrimMat);
    topIntercooler.position.set(0, 0.28, 0);
    engineGroup.add(v6Engine, topIntercooler);
    this.tagMesh(engineGroup, 'engine', '2.8L Turbo-Diesel V6 Engine', [0, 0.5, 0.3]);
    suv.add(engineGroup);

    const batteryGroup = new THREE.Group();
    batteryGroup.position.set(-0.55, 0.68, 1.05);
    const bat = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.26, 0.22), this.batteryLeadMat);
    batteryGroup.add(bat);
    this.tagMesh(batteryGroup, 'battery', '12V 95Ah Heavy-Duty Battery', [-0.3, 0.3, 0.2]);
    suv.add(batteryGroup);

    const coolingGroup = new THREE.Group();
    coolingGroup.position.set(0, 0.52, 1.75);
    const rad = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 0.1), this.brushedSteelMat);
    coolingGroup.add(rad);
    this.tagMesh(coolingGroup, 'cooling', 'High-Capacity Radiator & Heavy Fan', [0, 0.3, 0.4]);
    suv.add(coolingGroup);

    const transGroup = new THREE.Group();
    transGroup.position.set(0, 0.46, 0.4);
    const trans = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.75, 20), this.darkMetalMat);
    trans.rotation.x = Math.PI / 2;
    transGroup.add(trans);
    this.tagMesh(transGroup, 'transmission', '6-Speed 4x4 Automatic Transmission', [0.3, 0.2, 0.1]);
    suv.add(transGroup);

    const exhaustGroup = new THREE.Group();
    exhaustGroup.position.set(0.2, 0.28, -1.5);
    const exh = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.6, 16), this.brushedSteelMat);
    exh.rotation.x = Math.PI / 2;
    exhaustGroup.add(exh);
    this.tagMesh(exhaustGroup, 'exhaust', 'High-Clearance DPF Exhaust System', [0, -0.3, -0.4]);
    suv.add(exhaustGroup);

    const suspGroup = new THREE.Group();
    suspGroup.position.set(0.78, 0.5, 1.2);
    const susp = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.45, 16), this.caliperOrangeMat);
    suspGroup.add(susp);
    this.tagMesh(suspGroup, 'suspension', 'Heavy-Duty Double Wishbone Suspension', [0.3, 0.2, 0.2]);
    suv.add(suspGroup);

    // 4 Large All-Terrain Wheels
    const suvWheels: [number, number, number][] = [
      [-0.98, 0.36, 1.25],
      [0.98, 0.36, 1.25],
      [-0.98, 0.36, -1.15],
      [0.98, 0.36, -1.15]
    ];
    suvWheels.forEach((pos, idx) => {
      const isRight = pos[0] > 0;
      const isFront = idx < 2;
      const wg = new THREE.Group();
      wg.position.set(pos[0], pos[1], pos[2]);

      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.32, 28), this.tireTreadMat);
      tire.rotation.z = Math.PI / 2;
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.325, 24), this.darkMetalMat);
      rim.rotation.z = Math.PI / 2;
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 20), this.brakeDiscMat);
      disc.rotation.z = Math.PI / 2;
      disc.position.x = isRight ? -0.08 : 0.08;
      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.14, 0.11), this.caliperRedMat);
      caliper.position.set(isRight ? -0.08 : 0.08, 0.14, 0.05);

      wg.add(tire, rim, disc, caliper);

      if (idx === 1) {
        this.tagMesh(wg, 'brakes', 'Heavy-Duty 4-Piston Disc Brakes', [0.4, 0, 0.2]);
      } else if (idx === 2) {
        this.tagMesh(wg, 'tyres', '265/60 R18 All-Terrain Tyres', [-0.4, 0, -0.2]);
      } else {
        wg.userData = { explodedOffset: new THREE.Vector3(isRight ? 0.4 : -0.4, 0, isFront ? 0.15 : -0.15) };
      }
      suv.add(wg);
    });

    return suv;
  }

  // =========================================================================
  // 3. HIGH-FIDELITY COMPACT SUV / CROSSOVER (Hyundai Creta / Kia Seltos Twin)
  // =========================================================================
  public static createCompactSuv(
    colorHex: number = 0xdc2626,
    isXRay: boolean = false,
    isWireframe: boolean = false
  ): THREE.Group {
    const cuv = new THREE.Group();
    cuv.name = 'VehicleModel_CompactSUV';

    const bodyMat = this.getPaintMaterial(colorHex, isXRay, isWireframe);
    const glassMat = this.getGlassMaterial(isWireframe);

    const bodyGroup = new THREE.Group();
    bodyGroup.name = 'CompactSUV_BodyGroup';
    bodyGroup.userData = { explodedOffset: new THREE.Vector3(0, 0.45, 0) };

    // 1. Compact Reinforced Floorpan
    const floor = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.1, 3.6), this.darkMetalMat);
    floor.position.set(0, 0.26, 0);
    bodyGroup.add(floor);

    // 2. Sporty Curved Crossover Body with Cladding
    [-0.82, 0.82].forEach((xSide) => {
      const sideBody = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.46, 2.1), bodyMat);
      sideBody.position.set(xSide, 0.52, 0.05);

      const fArch = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.16, 16, 1, false, 0, Math.PI), this.trimBlackMat);
      fArch.rotation.z = Math.PI / 2;
      fArch.position.set(xSide, 0.38, 1.18);

      const rArch = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.16, 16, 1, false, 0, Math.PI), this.trimBlackMat);
      rArch.rotation.z = Math.PI / 2;
      rArch.position.set(xSide, 0.38, -1.08);

      bodyGroup.add(sideBody, fArch, rArch);
    });

    // 3. Cascading Grille & Split Headlamps
    const fFascia = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.38, 0.45), bodyMat);
    fFascia.position.set(0, 0.46, 1.75);
    const cascadGrille = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.26, 0.06), this.darkMetalMat);
    cascadGrille.position.set(0, 0.52, 1.96);
    const lowerLip = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 0.2), this.silverTrimMat);
    lowerLip.position.set(0, 0.28, 1.92);
    bodyGroup.add(fFascia, cascadGrille, lowerLip);

    // 4. Sloping Crossover Hood
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.08, 1.2), bodyMat);
    hood.position.set(0, 0.72, 1.12);
    hood.rotation.x = 0.06;
    bodyGroup.add(hood);

    // 5. Floating Contrast Roofline & Integrated Spoiler
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.04, 1.85), this.trimBlackMat);
    roof.position.set(0, 1.18, -0.15);
    const rearSpoiler = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.04, 0.25), this.trimBlackMat);
    rearSpoiler.position.set(0, 1.2, -1.1);
    bodyGroup.add(roof, rearSpoiler);

    const fWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.52, 0.03), glassMat);
    fWindshield.position.set(0, 0.96, 0.62);
    fWindshield.rotation.x = -Math.PI * 0.22;

    const rWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.46, 0.03), glassMat);
    rWindshield.position.set(0, 0.96, -0.92);
    rWindshield.rotation.x = Math.PI * 0.24;

    [-0.72, 0.72].forEach((xSide) => {
      const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.36, 1.6), glassMat);
      sideGlass.position.set(xSide, 0.96, -0.15);
      bodyGroup.add(sideGlass);
    });
    bodyGroup.add(fWindshield, rWindshield);

    // 6. Split LED Headlights
    [-0.62, 0.62].forEach((xSide) => {
      const drlTop = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.025, 0.05), this.ledWhiteMat);
      drlTop.position.set(xSide, 0.72, 1.9);
      const mainHl = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.05), this.ledWhiteMat);
      mainHl.position.set(xSide, 0.52, 1.94);
      bodyGroup.add(drlTop, mainHl);
    });

    const rLight = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.05, 0.06), this.ledRedMat);
    rLight.position.set(0, 0.74, -1.82);
    bodyGroup.add(rLight);

    cuv.add(bodyGroup);

    // Mechanical Subsystems
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 0.52, 1.18);
    const engine = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.4, 0.52), this.engineCastMat);
    engineGroup.add(engine);
    this.tagMesh(engineGroup, 'engine', '1.5L Turbocharged GDi Engine', [0, 0.5, 0.3]);
    cuv.add(engineGroup);

    const batGroup = new THREE.Group();
    batGroup.position.set(-0.5, 0.56, 0.98);
    const bat = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.18), this.batteryLeadMat);
    batGroup.add(bat);
    this.tagMesh(batGroup, 'battery', '12V AGM Starter Battery', [-0.3, 0.3, 0.2]);
    cuv.add(batGroup);

    const coolingGroup = new THREE.Group();
    coolingGroup.position.set(0, 0.42, 1.65);
    const rad = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.38, 0.08), this.brushedSteelMat);
    coolingGroup.add(rad);
    this.tagMesh(coolingGroup, 'cooling', 'Aluminum Crossflow Radiator', [0, 0.3, 0.4]);
    cuv.add(coolingGroup);

    const transGroup = new THREE.Group();
    transGroup.position.set(0.32, 0.4, 0.58);
    const trans = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.45, 16), this.darkMetalMat);
    trans.rotation.x = Math.PI / 2;
    transGroup.add(trans);
    this.tagMesh(transGroup, 'transmission', '7-Speed Dual-Clutch Transmission (DCT)', [0.4, 0.2, 0.1]);
    cuv.add(transGroup);

    const exhaustGroup = new THREE.Group();
    exhaustGroup.position.set(0, 0.22, -1.45);
    const exh = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 2.2, 16), this.brushedSteelMat);
    exh.rotation.x = Math.PI / 2;
    exhaustGroup.add(exh);
    this.tagMesh(exhaustGroup, 'exhaust', 'Sport Exhaust & GPF Filter', [0, -0.3, -0.4]);
    cuv.add(exhaustGroup);

    const suspGroup = new THREE.Group();
    suspGroup.position.set(0.7, 0.42, 1.15);
    const susp = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.35, 16), this.caliperOrangeMat);
    suspGroup.add(susp);
    this.tagMesh(suspGroup, 'suspension', 'MacPherson Strut & Coil Suspension', [0.3, 0.2, 0.2]);
    cuv.add(suspGroup);

    // 4 Wheels
    const cuvWheels: [number, number, number][] = [
      [-0.92, 0.28, 1.18],
      [0.92, 0.28, 1.18],
      [-0.92, 0.28, -1.08],
      [0.92, 0.28, -1.08]
    ];
    cuvWheels.forEach((pos, idx) => {
      const isRight = pos[0] > 0;
      const isFront = idx < 2;
      const wg = new THREE.Group();
      wg.position.set(pos[0], pos[1], pos[2]);

      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.26, 28), this.tireTreadMat);
      tire.rotation.z = Math.PI / 2;
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.265, 20), this.silverTrimMat);
      rim.rotation.z = Math.PI / 2;
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.025, 20), this.brakeDiscMat);
      disc.rotation.z = Math.PI / 2;
      disc.position.x = isRight ? -0.06 : 0.06;
      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.09), this.caliperOrangeMat);
      caliper.position.set(isRight ? -0.06 : 0.06, 0.12, 0.04);

      wg.add(tire, rim, disc, caliper);

      if (idx === 1) {
        this.tagMesh(wg, 'brakes', 'Front & Rear Disc Brakes', [0.4, 0, 0.2]);
      } else if (idx === 2) {
        this.tagMesh(wg, 'tyres', '215/60 R17 Crossover Tyres', [-0.4, 0, -0.2]);
      } else {
        wg.userData = { explodedOffset: new THREE.Vector3(isRight ? 0.35 : -0.35, 0, isFront ? 0.15 : -0.15) };
      }
      cuv.add(wg);
    });

    return cuv;
  }

  // =========================================================================
  // 4. HIGH-FIDELITY MOTORCYCLE (Yamaha MT-07 Naked Streetfighter Twin)
  // =========================================================================
  public static createMotorcycle(
    colorHex: number = 0xea580c,
    isXRay: boolean = false,
    isWireframe: boolean = false
  ): THREE.Group {
    const bike = new THREE.Group();
    bike.name = 'VehicleModel_Motorcycle';

    const frameMat = this.getPaintMaterial(colorHex, isXRay, isWireframe);

    const bodyGroup = new THREE.Group();
    bodyGroup.name = 'Bike_BodyGroup';
    bodyGroup.userData = { explodedOffset: new THREE.Vector3(0, 0.35, 0) };

    // 1. Trellis Steel Frame
    [-0.14, 0.14].forEach((xSide) => {
      const topTube = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 1.15, 14), this.darkMetalMat);
      topTube.position.set(xSide, 0.56, 0.12);
      topTube.rotation.x = 0.52;

      const downTube = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.85, 14), this.darkMetalMat);
      downTube.position.set(xSide, 0.42, 0.32);
      downTube.rotation.x = -0.68;

      bodyGroup.add(topTube, downTube);
    });

    // 2. Sculpted Muscle Fuel Tank
    const tank = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.38, 0.72), frameMat);
    tank.position.set(0, 0.74, 0.22);
    const gasCap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16), this.chromeMat);
    gasCap.position.set(0, 0.94, 0.32);
    bodyGroup.add(tank, gasCap);

    // 3. Two-Tier Sport Saddle
    const riderSeat = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.48), this.tireTreadMat);
    riderSeat.position.set(0, 0.66, -0.2);
    riderSeat.rotation.x = -0.1;
    const pillionSeat = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.32), this.tireTreadMat);
    pillionSeat.position.set(0, 0.74, -0.52);
    pillionSeat.rotation.x = 0.08;
    bodyGroup.add(riderSeat, pillionSeat);

    // 4. Tail Cowl & Cockpit
    const tailCowl = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.45), frameMat);
    tailCowl.position.set(0, 0.72, -0.68);
    tailCowl.rotation.x = 0.15;
    const tailLamp = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.04), this.ledRedMat);
    tailLamp.position.set(0, 0.74, -0.9);
    bodyGroup.add(tailCowl, tailLamp);

    const hlMask = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.26, 0.16), frameMat);
    hlMask.position.set(0, 0.78, 0.68);
    hlMask.rotation.x = -0.22;
    const hlTwinLED = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.04), this.ledWhiteMat);
    hlTwinLED.position.set(0, 0.76, 0.77);
    hlTwinLED.rotation.x = -0.22;
    bodyGroup.add(hlMask, hlTwinLED);

    const handlebar = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.78, 16), this.darkMetalMat);
    handlebar.rotation.z = Math.PI / 2;
    handlebar.position.set(0, 0.94, 0.54);
    const tftScreen = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.09, 0.02), this.chromeMat);
    tftScreen.position.set(0, 0.95, 0.48);
    tftScreen.rotation.x = -Math.PI * 0.25;
    bodyGroup.add(handlebar, tftScreen);

    // Inverted Gold Forks
    [-0.14, 0.14].forEach((xSide) => {
      const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.88, 16), this.goldAnodizedMat);
      fork.position.set(xSide, 0.55, 0.74);
      fork.rotation.x = -0.36;
      bodyGroup.add(fork);
    });

    bike.add(bodyGroup);

    // Mechanical Subsystems
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 0.45, 0.05);
    const crankcase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.48), this.engineCastMat);
    const cylHead = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.36, 16), this.darkMetalMat);
    cylHead.rotation.x = 0.28;
    cylHead.position.set(0, 0.22, 0.08);
    const headerPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.65, 16), this.copperMat);
    headerPipe.rotation.x = Math.PI * 0.45;
    headerPipe.position.set(0.14, 0.05, 0.32);
    const underMuffler = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.52, 16), this.brushedSteelMat);
    underMuffler.rotation.x = Math.PI / 2 - 0.2;
    underMuffler.position.set(0.18, -0.15, -0.25);
    engineGroup.add(crankcase, cylHead, headerPipe, underMuffler);
    this.tagMesh(engineGroup, 'm-engine', 'CP2 Parallel-Twin 4-Stroke Engine', [0, 0.3, 0.2]);
    bike.add(engineGroup);

    const chainGroup = new THREE.Group();
    chainGroup.position.set(-0.18, 0.26, -0.65);
    const fSprocket = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16), this.darkMetalMat);
    fSprocket.rotation.z = Math.PI / 2;
    fSprocket.position.set(0, 0.12, 0.45);
    const rSprocket = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.02, 20), this.brushedSteelMat);
    rSprocket.rotation.z = Math.PI / 2;
    rSprocket.position.set(0, 0.02, -0.2);
    const chainLoop = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.68), this.goldAnodizedMat);
    chainLoop.position.set(0, 0.06, 0.12);
    chainGroup.add(fSprocket, rSprocket, chainLoop);
    this.tagMesh(chainGroup, 'm-chain', '520 Sealed O-Ring Drive Chain', [-0.3, 0, -0.2]);
    bike.add(chainGroup);

    const batteryGroup = new THREE.Group();
    batteryGroup.position.set(0, 0.58, -0.2);
    const bat = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.16), this.batteryLeadMat);
    batteryGroup.add(bat);
    this.tagMesh(batteryGroup, 'm-battery', '12V 8.6Ah AGM Battery', [0, 0.25, -0.1]);
    bike.add(batteryGroup);

    const swingarm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.09, 0.72), this.brushedSteelMat);
    swingarm.position.set(0, 0.32, -0.52);
    swingarm.rotation.x = -0.14;
    const monoShock = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.32, 16), this.goldAnodizedMat);
    monoShock.position.set(0, 0.46, -0.35);
    monoShock.rotation.x = 0.55;
    bike.add(swingarm, monoShock);

    // Front & Rear Wheels
    const frontWheel = new THREE.Group();
    frontWheel.position.set(0, 0.28, 0.95);
    const fTire = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.13, 28), this.tireTreadMat);
    fTire.rotation.z = Math.PI / 2;
    const fRim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.14, 20), this.brushedSteelMat);
    fRim.rotation.z = Math.PI / 2;
    const fDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.015, 20), this.brakeDiscMat);
    fDisc.rotation.z = Math.PI / 2;
    fDisc.position.x = 0.08;
    const fCaliper = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.09, 0.08), this.caliperOrangeMat);
    fCaliper.position.set(0.08, 0.12, -0.05);
    frontWheel.add(fTire, fRim, fDisc, fCaliper);
    this.tagMesh(frontWheel, 'm-brakes', 'Dual-Channel ABS Disc Brakes', [0, 0, 0.35]);
    bike.add(frontWheel);

    const rearWheel = new THREE.Group();
    rearWheel.position.set(0, 0.28, -0.85);
    const rTire = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.2, 28), this.tireTreadMat);
    rTire.rotation.z = Math.PI / 2;
    const rRim = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.21, 20), this.brushedSteelMat);
    rRim.rotation.z = Math.PI / 2;
    rearWheel.add(rTire, rRim);
    this.tagMesh(rearWheel, 'm-tyres', 'Sport Radial Tyres', [0, 0, -0.35]);
    bike.add(rearWheel);

    return bike;
  }

  // =========================================================================
  // 5. HIGH-FIDELITY SCOOTER (Honda PCX 160 / Maxi Step-Through Scooter Twin)
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
    bodyGroup.userData = { explodedOffset: new THREE.Vector3(0, 0.35, 0) };

    // 1. Step-Through Floorboard & Spine Tunnel
    const floorboard = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.65), this.trimBlackMat);
    floorboard.position.set(0, 0.24, 0.1);
    const centerTunnel = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.24, 0.58), bodyMat);
    centerTunnel.position.set(0, 0.38, 0.1);
    bodyGroup.add(floorboard, centerTunnel);

    // 2. Wide Front Aerodynamic Apron & Cowl
    const frontApron = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.62, 0.38), bodyMat);
    frontApron.position.set(0, 0.62, 0.58);
    frontApron.rotation.x = -0.22;

    const tintedScreen = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.03), glassMat);
    tintedScreen.position.set(0, 0.98, 0.55);
    tintedScreen.rotation.x = -0.32;

    const dualLedHeadlight = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.14, 0.04), this.ledWhiteMat);
    dualLedHeadlight.position.set(0, 0.52, 0.78);
    bodyGroup.add(frontApron, tintedScreen, dualLedHeadlight);

    // 3. Enclosed Handlebar Cockpit with Mirrors
    const handleCowl = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 0.16), bodyMat);
    handleCowl.position.set(0, 0.92, 0.44);

    [-0.32, 0.32].forEach((xSide) => {
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.12, 12), this.trimBlackMat);
      grip.rotation.z = Math.PI / 2;
      grip.position.set(xSide, 0.92, 0.44);

      const mirrorStem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.18, 8), this.darkMetalMat);
      mirrorStem.position.set(xSide > 0 ? xSide - 0.05 : xSide + 0.05, 1.02, 0.46);
      const mirrorHead = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.03), this.trimBlackMat);
      mirrorHead.position.set(xSide > 0 ? xSide - 0.05 : xSide + 0.05, 1.1, 0.46);

      bodyGroup.add(grip, mirrorStem, mirrorHead);
    });
    bodyGroup.add(handleCowl);

    // 4. Large Under-Seat Storage Body & Plush Stepped Seat
    const underSeatBody = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.45, 0.95), bodyMat);
    underSeatBody.position.set(0, 0.52, -0.42);

    const plushSeat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.14, 0.88), this.trimBlackMat);
    plushSeat.position.set(0, 0.74, -0.4);
    plushSeat.rotation.x = -0.06;

    const grabRail = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.32), this.silverTrimMat);
    grabRail.position.set(0, 0.72, -0.88);

    const tailLight = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.12, 0.05), this.ledRedMat);
    tailLight.position.set(0, 0.58, -0.92);

    bodyGroup.add(underSeatBody, plushSeat, grabRail, tailLight);
    scooter.add(bodyGroup);

    // Mechanical Subsystems
    // Engine (160cc 4-Valve eSP+ Engine)
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 0.32, -0.25);
    const eng = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.26, 0.36), this.engineCastMat);
    engineGroup.add(eng);
    this.tagMesh(engineGroup, 's-engine', '160cc 4-Valve eSP+ Engine', [0, 0.25, 0.15]);
    scooter.add(engineGroup);

    // Enclosed CVT Belt Transmission Housing (Swingarm Unit)
    const transGroup = new THREE.Group();
    transGroup.position.set(-0.18, 0.26, -0.45);
    const cvtCase = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.62), this.silverTrimMat);
    transGroup.add(cvtCase);
    this.tagMesh(transGroup, 's-transmission', 'V-Matic Automatic CVT Belt Transmission', [-0.3, 0.2, -0.2]);
    scooter.add(transGroup);

    // Battery (Under floorboard/seat)
    const batteryGroup = new THREE.Group();
    batteryGroup.position.set(0, 0.46, 0.35);
    const bat = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.14), this.batteryLeadMat);
    batteryGroup.add(bat);
    this.tagMesh(batteryGroup, 's-battery', '12V Sealed AGM Scooter Battery', [0, 0.25, 0.2]);
    scooter.add(batteryGroup);

    // Side Radiator
    const coolingGroup = new THREE.Group();
    coolingGroup.position.set(0.16, 0.32, -0.15);
    const rad = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.22), this.darkMetalMat);
    coolingGroup.add(rad);
    this.tagMesh(coolingGroup, 's-cooling', 'Side-Mounted Liquid Cooling Radiator', [0.25, 0.2, 0.1]);
    scooter.add(coolingGroup);

    // Scooter Exhaust with Heat Shield
    const exhaustGroup = new THREE.Group();
    exhaustGroup.position.set(0.18, 0.26, -0.48);
    const exh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.08, 0.62, 16), this.trimBlackMat);
    exh.rotation.x = Math.PI / 2 - 0.15;
    const shield = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.1, 0.45), this.silverTrimMat);
    shield.position.set(0.06, 0.02, 0);
    exhaustGroup.add(exh, shield);
    this.tagMesh(exhaustGroup, 's-exhaust', 'Catalyzed Scooter Exhaust & Heat Shield', [0.3, 0, -0.3]);
    scooter.add(exhaustGroup);

    // Small Scooter Wheels (14" Front, 13" Rear)
    const frontWheel = new THREE.Group();
    frontWheel.position.set(0, 0.22, 0.82);
    const fTire = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.11, 24), this.tireTreadMat);
    fTire.rotation.z = Math.PI / 2;
    const fRim = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 18), this.darkMetalMat);
    fRim.rotation.z = Math.PI / 2;
    const fDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.02, 16), this.brakeDiscMat);
    fDisc.rotation.z = Math.PI / 2;
    fDisc.position.x = 0.06;
    const fCaliper = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.07), this.caliperOrangeMat);
    fCaliper.position.set(0.06, 0.08, 0);
    frontWheel.add(fTire, fRim, fDisc, fCaliper);
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
  // 6. HIGH-FIDELITY RC CAR (Traxxas Slash 4x4 Off-Road Brushless Twin)
  // =========================================================================
  public static createRcCar(
    colorHex: number = 0xea580c,
    isXRay: boolean = false,
    isWireframe: boolean = false
  ): THREE.Group {
    const rc = new THREE.Group();
    rc.name = 'VehicleModel_RcCar';

    const accentMat = this.getPaintMaterial(colorHex, isXRay, isWireframe);

    const chassisGroup = new THREE.Group();
    chassisGroup.name = 'RC_ChassisGroup';
    chassisGroup.userData = { explodedOffset: new THREE.Vector3(0, 0.2, 0) };

    // 1. Low-CG Composite Tub Chassis
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.06, 1.75), this.darkMetalMat);
    chassis.position.set(0, 0.16, 0);

    [-0.52, 0.52].forEach((xSide) => {
      const nerfBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.2), this.darkMetalMat);
      nerfBar.position.set(xSide, 0.2, 0);
      chassisGroup.add(nerfBar);
    });

    const fBumper = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 0.18), this.darkMetalMat);
    fBumper.position.set(0, 0.22, 0.94);
    const rBumper = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 0.18), this.darkMetalMat);
    rBumper.position.set(0, 0.22, -0.94);

    const fTower = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.38, 0.08), this.carbonFiberMat);
    fTower.position.set(0, 0.38, 0.58);
    const rTower = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.38, 0.08), this.carbonFiberMat);
    rTower.position.set(0, 0.38, -0.58);

    // Roll Cage
    [-0.34, 0.34].forEach((xSide) => {
      const cageRail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 12), accentMat);
      cageRail.rotation.x = Math.PI / 2;
      cageRail.position.set(xSide, 0.48, 0);
      chassisGroup.add(cageRail);
    });

    const ledLightBar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.06), this.darkMetalMat);
    ledLightBar.position.set(0, 0.52, 0.35);
    const ledLightLens = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.03, 0.02), this.ledWhiteMat);
    ledLightLens.position.set(0, 0.52, 0.39);

    chassisGroup.add(chassis, fBumper, rBumper, fTower, rTower, ledLightBar, ledLightLens);
    rc.add(chassisGroup);

    // Powertrain & Electronics
    const motorGroup = new THREE.Group();
    motorGroup.position.set(-0.18, 0.28, -0.35);
    const motorCan = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.32, 20), this.caliperOrangeMat);
    motorCan.rotation.x = Math.PI / 2;
    for (let fin = 0; fin < 5; fin++) {
      const finRing = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.015, 20), this.brushedSteelMat);
      finRing.rotation.x = Math.PI / 2;
      finRing.position.set(0, 0, -0.1 + fin * 0.05);
      motorGroup.add(finRing);
    }
    const wireColors = [0x0284c7, 0xeab308, 0xea580c];
    wireColors.forEach((wCol, idx) => {
      const wire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.3, 10),
        new THREE.MeshStandardMaterial({ color: wCol, roughness: 0.5 })
      );
      wire.position.set(-0.06 + idx * 0.06, 0.14, 0.05);
      wire.rotation.x = Math.PI * 0.2;
      motorGroup.add(wire);
    });
    motorGroup.add(motorCan);
    this.tagMesh(motorGroup, 'rc-motor', 'Velineon 3500kV Brushless Motor', [-0.3, 0.25, -0.2]);
    rc.add(motorGroup);

    const escGroup = new THREE.Group();
    escGroup.position.set(0.18, 0.32, -0.15);
    const escCase = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.18, 0.24), this.darkMetalMat);
    const escFanShroud = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.2), this.caliperOrangeMat);
    escFanShroud.position.set(0, 0.11, 0);
    escGroup.add(escCase, escFanShroud);
    this.tagMesh(escGroup, 'rc-esc', 'VXL-3s Waterproof ESC Speed Controller', [0.3, 0.25, -0.1]);
    rc.add(escGroup);

    const lipoGroup = new THREE.Group();
    lipoGroup.position.set(-0.22, 0.24, 0.05);
    const lipoCase = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.72), this.darkMetalMat);
    const lipoStrap = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.14), this.caliperOrangeMat);
    lipoGroup.add(lipoCase, lipoStrap);
    this.tagMesh(lipoGroup, 'rc-battery', '3S 11.1V 5000mAh Hardcase LiPo Battery', [-0.3, 0.2, 0.1]);
    rc.add(lipoGroup);

    const servoGroup = new THREE.Group();
    servoGroup.position.set(0.15, 0.26, 0.45);
    const servoBody = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.2), this.darkMetalMat);
    const servoHorn = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.16), this.goldAnodizedMat);
    servoHorn.position.set(0, 0.1, 0.06);
    servoGroup.add(servoBody, servoHorn);
    this.tagMesh(servoGroup, 'rc-servo', 'High-Torque Metal-Gear Digital Servo', [0.25, 0.2, 0.3]);
    rc.add(servoGroup);

    // Center Driveshaft
    const centerShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.25, 16), this.goldAnodizedMat);
    centerShaft.rotation.x = Math.PI / 2;
    centerShaft.position.set(0, 0.22, 0);
    rc.add(centerShaft);

    // 4 Shocks
    const shockPositions: [number, number, number][] = [
      [-0.32, 0.34, 0.58],
      [0.32, 0.34, 0.58],
      [-0.32, 0.34, -0.58],
      [0.32, 0.34, -0.58]
    ];
    shockPositions.forEach((pos) => {
      const shockBody = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.32, 14), this.goldAnodizedMat);
      shockBody.position.set(pos[0], pos[1], pos[2]);
      shockBody.rotation.z = pos[0] > 0 ? 0.35 : -0.35;
      const spring = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.26, 14), this.caliperOrangeMat);
      spring.position.set(pos[0], pos[1] - 0.02, pos[2]);
      spring.rotation.z = pos[0] > 0 ? 0.35 : -0.35;
      rc.add(shockBody, spring);
    });

    // 4 Beadlock Wheels
    const rcWheelPositions: [number, number, number][] = [
      [-0.62, 0.24, 0.58],
      [0.62, 0.24, 0.58],
      [-0.62, 0.24, -0.58],
      [0.62, 0.24, -0.58]
    ];
    rcWheelPositions.forEach((pos) => {
      const isRight = pos[0] > 0;
      const wg = new THREE.Group();
      wg.position.set(pos[0], pos[1], pos[2]);

      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.24, 24), this.tireTreadMat);
      tire.rotation.z = Math.PI / 2;
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.245, 18), this.darkMetalMat);
      rim.rotation.z = Math.PI / 2;
      const beadlockRing = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 8, 20), this.caliperOrangeMat);
      beadlockRing.position.x = isRight ? -0.12 : 0.12;
      beadlockRing.rotation.y = Math.PI / 2;

      wg.add(tire, rim, beadlockRing);
      rc.add(wg);
    });

    return rc;
  }
}
