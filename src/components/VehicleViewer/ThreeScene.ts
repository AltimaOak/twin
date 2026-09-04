import * as THREE from 'three';
import type { VehicleCategory, VehicleComponentData } from '../../data/vehicleConfigurations';
import { ProceduralVehicles, VEHICLE_PAINT_PALETTES } from './ProceduralVehicles';

export interface ProjectedCallout {
  id: string;
  x: number;
  y: number;
  visible: boolean;
  component: VehicleComponentData;
}

export interface HoveredPartInfo {
  componentId: string;
  name: string;
  screenX: number;
  screenY: number;
}

export class ThreeScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private currentVehicleGroup: THREE.Group | null = null;
  private vehicleType: VehicleCategory = 'car';
  private vehicleModelName: string = '';
  
  // State
  private isXRay: boolean = false;
  private isWireframe: boolean = false;
  private isAutoRotate: boolean = false;
  private isExploded: boolean = false;
  private explosionFactor: number = 0; // 0.0 (compact) to 1.0 (exploded)
  private paintColorHex: number = VEHICLE_PAINT_PALETTES[0].hex;

  // Diagnostic Laser Scan State
  private isScanning: boolean = false;
  private scanProgress: number = 0;
  private scanLaserPlane: THREE.Mesh | null = null;

  // Camera Orbit & Controls State
  private targetCameraPos = new THREE.Vector3(3.2, 1.9, 3.2);
  private targetLookAt = new THREE.Vector3(0, 0.45, 0);
  private currentLookAt = new THREE.Vector3(0, 0.45, 0);

  // Interaction & Raycasting
  private pointerDown = false;
  private prevPointerX = 0;
  private prevPointerY = 0;
  private pointerMovedDistance = 0;
  private mouseVec = new THREE.Vector2(-1000, -1000);
  private raycaster = new THREE.Raycaster();
  private animationFrameId: number | null = null;
  private hoveredPartId: string | null = null;

  // Callbacks
  private onProjectedCalloutsChange?: (callouts: ProjectedCallout[]) => void;
  private onHoverPartChange?: (info: HoveredPartInfo | null) => void;
  private onSelectPartClick?: (componentId: string) => void;
  private components: VehicleComponentData[] = [];

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Scene with warm studio background matching dashboard palette
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf6f3ea);

    // 2. Camera setup
    const aspect = container.clientWidth / container.clientHeight || 1.6;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 60);
    this.camera.position.set(3.2, 1.9, 3.2);
    this.camera.lookAt(this.currentLookAt);

    // 3. High-performance WebGL renderer with PCF soft shadows & tone mapping
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    container.appendChild(this.renderer.domElement);

    // 4. Lighting & Presentation Environment
    this.setupLighting();
    this.setupGroundPodium();
    this.setupScanLaser();
    this.setupFocusRing();

    // 5. Interactive Event Listeners
    this.setupEvents();

    // 6. Animation Loop
    this.animate = this.animate.bind(this);
    this.animate();
  }

  private setupFocusRing(): void {
    const ringGeo = new THREE.RingGeometry(0.38, 0.42, 36);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xea580c,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    this.focusRing = new THREE.Mesh(ringGeo, ringMat);
    this.focusRing.rotation.x = Math.PI / 2;
    this.scene.add(this.focusRing);
  }

  private setupLighting(): void {
    // 1. High-illumination Ambient Light - ensures all mechanical parts inside are crisp and visible
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    this.scene.add(ambientLight);

    // 2. Key Studio Light
    const keyLight = new THREE.DirectionalLight(0xfffdf5, 1.9);
    keyLight.position.set(4.5, 7.5, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    this.scene.add(keyLight);

    // 3. Warm Amber Rim Light
    const rimLight = new THREE.DirectionalLight(0xffedd5, 1.2);
    rimLight.position.set(-4.5, 4.0, -4.5);
    this.scene.add(rimLight);

    // 4. Fill Light
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.9);
    fillLight.position.set(0, 5, -5);
    this.scene.add(fillLight);

    // 5. Undercarriage Uplight (illuminates lower suspension, brake rotors, exhaust, transmission)
    const underLight = new THREE.DirectionalLight(0xfff7ed, 1.1);
    underLight.position.set(0, -3, 0);
    this.scene.add(underLight);

    // 6. Overhead Softbox
    const topLight = new THREE.DirectionalLight(0xffffff, 0.6);
    topLight.position.set(0, 8, 0);
    this.scene.add(topLight);
  }

  private setupGroundPodium(): void {
    const podiumGroup = new THREE.Group();
    podiumGroup.position.y = 0.002;

    // Outer Measurement Rings
    const ring1 = new THREE.Mesh(
      new THREE.RingGeometry(2.4, 2.43, 64),
      new THREE.MeshBasicMaterial({ color: 0xe2d7c3, side: THREE.DoubleSide })
    );
    ring1.rotation.x = Math.PI / 2;

    const ring2 = new THREE.Mesh(
      new THREE.RingGeometry(1.6, 1.62, 48),
      new THREE.MeshBasicMaterial({ color: 0xeadfc9, side: THREE.DoubleSide })
    );
    ring2.rotation.x = Math.PI / 2;

    const grid = new THREE.GridHelper(7.5, 24, 0xd8cbba, 0xeee7db);
    grid.position.y = 0.001;

    // Contact Soft Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.22 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.003;
    shadowMesh.receiveShadow = true;

    podiumGroup.add(ring1, ring2, grid, shadowMesh);
    this.scene.add(podiumGroup);
  }

  private setupScanLaser(): void {
    const laserGeo = new THREE.PlaneGeometry(3.6, 2.0);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.scanLaserPlane = new THREE.Mesh(laserGeo, laserMat);
    this.scanLaserPlane.position.set(0, 0.6, 0);
    this.scene.add(this.scanLaserPlane);
  }

  public setVehicle(
    type: VehicleCategory,
    components: VehicleComponentData[],
    isXRay: boolean = this.isXRay,
    paintHex?: number,
    modelName?: string
  ): void {
    this.vehicleType = type;
    this.components = components;
    this.isXRay = isXRay;
    if (modelName !== undefined) {
      this.vehicleModelName = modelName;
    }
    if (paintHex !== undefined) {
      this.paintColorHex = paintHex;
    }

    if (this.currentVehicleGroup) {
      this.scene.remove(this.currentVehicleGroup);
      this.currentVehicleGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
        }
      });
      this.currentVehicleGroup = null;
    }

    const name = (this.vehicleModelName || '').toLowerCase();

    if (type === 'scooter' || name.includes('scooter') || name.includes('pcx') || name.includes('activa') || name.includes('vespa') || name.includes('nmax') || name.includes('aerox') || name.includes('ather')) {
      this.currentVehicleGroup = ProceduralVehicles.createScooter(this.paintColorHex, isXRay, this.isWireframe);
    } else if (type === 'motorcycle' || type as string === 'bike') {
      this.currentVehicleGroup = ProceduralVehicles.createMotorcycle(this.paintColorHex, isXRay, this.isWireframe);
    } else if (type === 'rc_car' || type as string === 'rc') {
      this.currentVehicleGroup = ProceduralVehicles.createRcCar(this.paintColorHex, isXRay, this.isWireframe);
    } else {
      this.currentVehicleGroup = ProceduralVehicles.createSedan(this.paintColorHex, isXRay, this.isWireframe);
    }

    this.scene.add(this.currentVehicleGroup);
    this.resetCamera();
    this.applyExplodedTransform(this.explosionFactor);
  }

  public setPaintColor(colorHex: number): void {
    this.paintColorHex = colorHex;
    this.setVehicle(this.vehicleType, this.components, this.isXRay, colorHex, this.vehicleModelName);
  }

  public setXRayMode(enabled: boolean): void {
    this.isXRay = enabled;
    this.setVehicle(this.vehicleType, this.components, enabled, this.paintColorHex, this.vehicleModelName);
  }

  public setWireframeMode(enabled: boolean): void {
    this.isWireframe = enabled;
    this.setVehicle(this.vehicleType, this.components, this.isXRay, this.paintColorHex, this.vehicleModelName);
  }

  public setAutoRotate(enabled: boolean): void {
    this.isAutoRotate = enabled;
  }

  public setExplodedMode(enabled: boolean): void {
    this.isExploded = enabled;
  }

  public triggerDiagnosticScan(): void {
    this.isScanning = true;
    this.scanProgress = 0;
  }

  public setOnProjectedCalloutsChange(cb: (callouts: ProjectedCallout[]) => void): void {
    this.onProjectedCalloutsChange = cb;
  }

  public setOnHoverPartChange(cb: (info: HoveredPartInfo | null) => void): void {
    this.onHoverPartChange = cb;
  }

  public setOnSelectPartClick(cb: (componentId: string) => void): void {
    this.onSelectPartClick = cb;
  }

  private focusRing: THREE.Mesh | null = null;
  private selectedComponentId: string | null = null;
  private highlightedItems: Array<{
    mesh: THREE.Mesh;
    origMaterial: THREE.Material | THREE.Material[];
    highlightMaterial: THREE.MeshStandardMaterial;
  }> = [];

  public getSelectedComponentId(): string | null {
    return this.selectedComponentId;
  }

  public highlightComponent(componentId: string | null): void {
    this.clearHighlight();
    this.selectedComponentId = componentId;
    if (!componentId || !this.currentVehicleGroup) {
      if (this.focusRing) {
        (this.focusRing.material as THREE.MeshBasicMaterial).opacity = 0;
      }
      return;
    }

    let foundTargetPos: THREE.Vector3 | null = null;

    this.currentVehicleGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData && child.userData.componentId === componentId) {
        if (!foundTargetPos) {
          foundTargetPos = new THREE.Vector3();
          child.getWorldPosition(foundTargetPos);
        }

        const highlightMat = new THREE.MeshStandardMaterial({
          color: 0xf97316,
          emissive: new THREE.Color(0xea580c),
          emissiveIntensity: 2.2,
          roughness: 0.12,
          metalness: 0.85,
          wireframe: this.isWireframe
        });

        this.highlightedItems.push({
          mesh: child,
          origMaterial: child.material,
          highlightMaterial: highlightMat
        });

        child.material = highlightMat;
      }
    });

    if (this.focusRing && foundTargetPos) {
      this.focusRing.position.set(
        (foundTargetPos as THREE.Vector3).x,
        Math.max(0.015, (foundTargetPos as THREE.Vector3).y - 0.22),
        (foundTargetPos as THREE.Vector3).z
      );
      (this.focusRing.material as THREE.MeshBasicMaterial).opacity = 0.9;
    }
  }

  public clearHighlight(): void {
    for (const item of this.highlightedItems) {
      item.mesh.material = item.origMaterial;
    }
    this.highlightedItems = [];
    this.selectedComponentId = null;
    if (this.focusRing) {
      (this.focusRing.material as THREE.MeshBasicMaterial).opacity = 0;
    }
  }

  public focusComponent(component: VehicleComponentData): void {
    const focusPos = component.cameraFocusPosition || component.position3D;
    const targetCam = component.cameraPosition || [
      focusPos[0] + 1.4,
      focusPos[1] + 0.9,
      focusPos[2] + 1.4
    ];

    this.targetLookAt.set(focusPos[0], focusPos[1], focusPos[2]);
    this.targetCameraPos.set(targetCam[0], targetCam[1], targetCam[2]);
    this.highlightComponent(component.id);
  }

  public resetCamera(): void {
    this.clearHighlight();
    const name = (this.vehicleModelName || '').toLowerCase();
    if (this.vehicleType === 'suv' || (name.includes('suv') && !name.includes('compact'))) {
      this.targetCameraPos.set(3.4, 2.2, 3.4);
      this.targetLookAt.set(0, 0.6, 0);
    } else if (this.vehicleType === 'compact_suv' || name.includes('compact') || name.includes('crossover')) {
      this.targetCameraPos.set(3.1, 1.9, 3.1);
      this.targetLookAt.set(0, 0.5, 0);
    } else if (this.vehicleType === 'motorcycle') {
      this.targetCameraPos.set(2.4, 1.4, 2.2);
      this.targetLookAt.set(0, 0.45, 0);
    } else if (this.vehicleType === 'scooter' || name.includes('scooter')) {
      this.targetCameraPos.set(2.3, 1.3, 2.1);
      this.targetLookAt.set(0, 0.4, 0);
    } else if (this.vehicleType === 'rc_car') {
      this.targetCameraPos.set(2.1, 1.3, 2.0);
      this.targetLookAt.set(0, 0.32, 0);
    } else {
      this.targetCameraPos.set(3.0, 1.8, 3.0);
      this.targetLookAt.set(0, 0.45, 0);
    }
  }

  public setPresetView(view: 'iso' | 'top' | 'side' | 'front'): void {
    const isSuv = this.vehicleType === 'suv' || (this.vehicleModelName.toLowerCase().includes('suv') && !this.vehicleModelName.toLowerCase().includes('compact'));
    const yCenter = isSuv ? 0.6 : 0.45;

    if (view === 'iso') {
      this.resetCamera();
    } else if (view === 'top') {
      this.targetCameraPos.set(0, isSuv ? 5.2 : 4.6, 0.01);
      this.targetLookAt.set(0, yCenter, 0);
    } else if (view === 'side') {
      this.targetCameraPos.set(isSuv ? 4.4 : 4.0, isSuv ? 0.9 : 0.7, 0);
      this.targetLookAt.set(0, yCenter, 0);
    } else if (view === 'front') {
      this.targetCameraPos.set(0, isSuv ? 0.95 : 0.8, isSuv ? 4.4 : 4.0);
      this.targetLookAt.set(0, yCenter, 0);
    }
  }

  public zoom(delta: number): void {
    const dir = new THREE.Vector3().subVectors(this.targetCameraPos, this.targetLookAt);
    const dist = dir.length();
    const newDist = Math.max(1.1, Math.min(8.0, dist + delta));
    dir.normalize().multiplyScalar(newDist);
    this.targetCameraPos.copy(this.targetLookAt).add(dir);
  }

  private applyExplodedTransform(factor: number): void {
    if (!this.currentVehicleGroup) return;

    this.currentVehicleGroup.traverse((child) => {
      if (child.userData && child.userData.explodedOffset && child.userData.originalPosition) {
        const orig = child.userData.originalPosition as THREE.Vector3;
        const offset = child.userData.explodedOffset as THREE.Vector3;
        child.position.set(
          orig.x + offset.x * factor,
          orig.y + offset.y * factor,
          orig.z + offset.z * factor
        );
      }
    });
  }

  private setupEvents(): void {
    const dom = this.renderer.domElement;

    dom.addEventListener('pointerdown', (e) => {
      this.pointerDown = true;
      this.prevPointerX = e.clientX;
      this.prevPointerY = e.clientY;
      this.pointerMovedDistance = 0;
      dom.setPointerCapture(e.pointerId);
    });

    dom.addEventListener('pointermove', (e) => {
      const rect = dom.getBoundingClientRect();
      this.mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!this.pointerDown) {
        this.checkRaycastHover(e.clientX - rect.left, e.clientY - rect.top);
        return;
      }

      const deltaX = e.clientX - this.prevPointerX;
      const deltaY = e.clientY - this.prevPointerY;
      this.pointerMovedDistance += Math.abs(deltaX) + Math.abs(deltaY);
      this.prevPointerX = e.clientX;
      this.prevPointerY = e.clientY;

      if (e.buttons === 1 || e.pointerType === 'touch') {
        // Orbit
        const offset = new THREE.Vector3().subVectors(this.targetCameraPos, this.targetLookAt);
        const radius = offset.length();
        let theta = Math.atan2(offset.x, offset.z);
        let phi = Math.acos(Math.max(-1, Math.min(1, offset.y / radius)));

        theta -= deltaX * 0.007;
        phi = Math.max(0.08, Math.min(Math.PI / 2 - 0.03, phi - deltaY * 0.007));

        offset.x = radius * Math.sin(phi) * Math.sin(theta);
        offset.y = radius * Math.cos(phi);
        offset.z = radius * Math.sin(phi) * Math.cos(theta);

        this.targetCameraPos.copy(this.targetLookAt).add(offset);
      } else if (e.buttons === 2) {
        // Pan
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion);
        const panSpeed = 0.003;

        const pan = new THREE.Vector3()
          .addScaledVector(right, -deltaX * panSpeed)
          .addScaledVector(up, deltaY * panSpeed);

        this.targetLookAt.add(pan);
        this.targetCameraPos.add(pan);
      }
    });

    const endPointer = (e: PointerEvent) => {
      if (this.pointerDown && this.pointerMovedDistance < 5) {
        this.checkRaycastClick();
      }
      this.pointerDown = false;
      try {
        dom.releasePointerCapture(e.pointerId);
      } catch (_err) {
        // ignore
      }
    };

    dom.addEventListener('pointerup', endPointer);
    dom.addEventListener('pointercancel', endPointer);

    dom.addEventListener('pointerleave', () => {
      this.hoveredPartId = null;
      if (this.onHoverPartChange) {
        this.onHoverPartChange(null);
      }
    });

    dom.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.zoom(e.deltaY * 0.0025);
      },
      { passive: false }
    );

    dom.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private checkRaycastHover(screenX: number, screenY: number): void {
    if (!this.currentVehicleGroup || !this.onHoverPartChange) return;

    this.raycaster.setFromCamera(this.mouseVec, this.camera);
    const intersects = this.raycaster.intersectObjects(this.currentVehicleGroup.children, true);

    let foundPart: { componentId: string; name: string } | null = null;

    for (const hit of intersects) {
      let obj: THREE.Object3D | null = hit.object;
      while (obj && obj !== this.currentVehicleGroup) {
        if (obj.userData && obj.userData.componentId) {
          foundPart = {
            componentId: obj.userData.componentId,
            name: obj.userData.name || obj.userData.componentId
          };
          break;
        }
        obj = obj.parent;
      }
      if (foundPart) break;
    }

    if (foundPart) {
      this.renderer.domElement.style.cursor = 'pointer';
      if (this.hoveredPartId !== foundPart.componentId) {
        this.hoveredPartId = foundPart.componentId;
        this.onHoverPartChange({
          componentId: foundPart.componentId,
          name: foundPart.name,
          screenX,
          screenY
        });
      }
    } else {
      this.renderer.domElement.style.cursor = this.pointerDown ? 'grabbing' : 'grab';
      if (this.hoveredPartId !== null) {
        this.hoveredPartId = null;
        this.onHoverPartChange(null);
      }
    }
  }

  private checkRaycastClick(): void {
    if (!this.currentVehicleGroup || !this.onSelectPartClick) return;

    this.raycaster.setFromCamera(this.mouseVec, this.camera);
    const intersects = this.raycaster.intersectObjects(this.currentVehicleGroup.children, true);

    let clickedComponentId: string | null = null;

    for (const hit of intersects) {
      let obj: THREE.Object3D | null = hit.object;
      while (obj && obj !== this.currentVehicleGroup) {
        if (obj.userData && obj.userData.componentId) {
          clickedComponentId = obj.userData.componentId;
          break;
        }
        obj = obj.parent;
      }
      if (clickedComponentId) break;
    }

    if (clickedComponentId) {
      this.onSelectPartClick(clickedComponentId);
      this.highlightComponent(clickedComponentId);
    } else {
      this.onSelectPartClick('');
      this.clearHighlight();
    }
  }

  public onResize(): void {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Smooth Camera Spring Lerp
    this.camera.position.lerp(this.targetCameraPos, 0.08);
    this.currentLookAt.lerp(this.targetLookAt, 0.08);
    this.camera.lookAt(this.currentLookAt);

    // Auto-Rotate
    if (this.isAutoRotate && !this.pointerDown && this.currentVehicleGroup) {
      this.currentVehicleGroup.rotation.y += 0.004;
    }

    // High-visibility animated pulse for highlighted meshes & focus ring
    if (this.highlightedItems.length > 0) {
      const pulse = Math.sin(Date.now() * 0.007) * 0.6 + 2.2;
      for (const item of this.highlightedItems) {
        item.highlightMaterial.emissiveIntensity = pulse;
      }
      if (this.focusRing) {
        this.focusRing.rotation.z += 0.018;
        const ringScale = 1.0 + Math.sin(Date.now() * 0.006) * 0.08;
        this.focusRing.scale.set(ringScale, ringScale, ringScale);
      }
    }

    // Exploded View Spring Animation
    const targetFactor = this.isExploded ? 1.0 : 0.0;
    if (Math.abs(this.explosionFactor - targetFactor) > 0.001) {
      this.explosionFactor += (targetFactor - this.explosionFactor) * 0.1;
      this.applyExplodedTransform(this.explosionFactor);
    }

    // Diagnostic Scan Laser Sweep Animation
    if (this.isScanning && this.scanLaserPlane) {
      this.scanProgress += 0.016;
      const zPos = 2.4 - this.scanProgress * 4.8;
      this.scanLaserPlane.position.z = zPos;
      
      const laserMat = this.scanLaserPlane.material as THREE.MeshBasicMaterial;
      laserMat.opacity = Math.sin(Math.PI * Math.min(1, Math.max(0, this.scanProgress))) * 0.65;

      if (this.scanProgress >= 1.0) {
        this.isScanning = false;
        laserMat.opacity = 0;
      }
    }

    this.renderer.render(this.scene, this.camera);
    this.calculateProjectedCallouts();
  }

  private calculateProjectedCallouts(): void {
    if (!this.onProjectedCalloutsChange || this.components.length === 0) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const halfW = width / 2;
    const halfH = height / 2;

    const callouts: ProjectedCallout[] = this.components.map((comp) => {
      const pos3D = new THREE.Vector3(comp.position3D[0], comp.position3D[1], comp.position3D[2]);

      if (this.currentVehicleGroup) {
        pos3D.applyEuler(this.currentVehicleGroup.rotation);
      }

      const tempVec = pos3D.clone().project(this.camera);

      const isBehind = tempVec.z > 1;
      const x = tempVec.x * halfW + halfW;
      const y = -tempVec.y * halfH + halfH;
      const isVisible = !isBehind && x >= 10 && x <= width - 10 && y >= 10 && y <= height - 10;

      return {
        id: comp.id,
        x: Math.round(x),
        y: Math.round(y),
        visible: isVisible,
        component: comp
      };
    });

    this.onProjectedCalloutsChange(callouts);
  }

  public destroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize.bind(this));
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
