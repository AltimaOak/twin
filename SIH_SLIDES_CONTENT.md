# 🎯 SIH 2026 — MotoMindX: Official 6-Slide Presentation Deck Content

**Problem Statement ID:** `SIH26219` | **Theme:** Smart Automation | **Category:** Hardware  
**Project Title:** MotoMindX – Vehicle Health & Diagnosis  
**Team Name:** TwinTorque | **Live Demo:** [rc-one-mu.vercel.app](https://rc-one-mu.vercel.app/)

---

## 📑 SLIDE 1: Problem Statement & Context

### 🔹 Slide Title & Subtitle
**MotoMindX — Predict Machine Health Before Failure**  
*IoT + AI Digital Twin Platform Converting Sensor Telemetry into Component-Level Maintenance Intelligence*

---

### 🔹 Slide Layout & Content Boxes

#### 🏷️ [Top Metadata Ribbon]
- **Problem Statement ID:** SIH26219
- **Category:** Hardware / Smart Automation
- **Team Name:** TwinTorque
- **Target Subsystem:** EV Powertrains & Rotating Machinery (Extensible to Vehicle Fleets)

---

#### 📦 Box 1 (Left Column): The Real-World Problem
- **The Core Issue:** Fleet and machine maintenance remains stuck in a costly dilemma:
  - **Reactive Breakdown:** 70% of machinery failures occur unannounced, causing expensive towing, secondary component damage, and critical downtime.
  - **Rigid Scheduled Maintenance:** Fixed calendar intervals replace functional parts prematurely or miss accelerated degradation between service cycles.
- **SIH Alignment (Our Interpretation):** Transforming raw, noisy edge sensor telemetry into proactive, component-level degradation indices to eliminate sudden failure.

---

#### 📦 Box 2 (Center Column): The Physical-to-Digital Bridge
```
[ Machine Telemetry ] ──▶ [ Edge DSP Filter ] ──▶ [ Diagnostic Engine ] ──▶ [ 3D Twin & Action ]
  (Vibration / Temp)          (ESP32 / RMS)         (Health Index / DTC)     (Mechanic Directive)
```
- **Primary Demonstrated Target:** Electric 2-Wheeler / Light EV Powertrain (PMSM Motor, 60V Battery Pack & Smart BMS, Motor Controller).

---

#### 📦 Box 3 (Right Column): Key Differentiators
1. **Component-Level Isolation:** Pinpoints exact failing assembly (e.g., motor bearings) rather than generic "Check Engine" alerts.
2. **Synchronized 3D Digital Twin:** Interactive spatial view of thermal/vibrational stress in WebGL.
3. **Low-Cost Edge Architecture:** Complete multi-sensor edge node under **₹1,800 BOM**.

---

### 🎙️ Presenter Script / Speaker Note (Slide 1)
> *"Respected judges, under Problem Statement SIH26219, our team TwinTorque presents MotoMindX. Current automotive maintenance is either reactive—waiting for breakdown—or blindly scheduled. MotoMindX bridges low-cost physical sensor hardware with a component-level 3D Digital Twin, allowing fleet operators and mechanics to see and fix sub-assembly degradation long before catastrophic failure occurs."*

---

---

## 📑 SLIDE 2: Proposed Solution & Core Innovation

### 🔹 Slide Title & Subtitle
**From Raw Sensor Signals to Actionable Maintenance Decisions**  
*A Synchronized Edge-to-Twin Diagnostic Workflow for Zero Unplanned Downtime*

---

### 🔹 Slide Layout & Content Boxes

#### 🔄 [Center Horizontal Flowchart]
```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  HIDDEN FAULTS  │  ──▶  │    LIVE DATA    │  ──▶  │ SMART DIAGNOSIS │  ──▶  │  TIMELY ACTION  │
│ Micro-vibration │       │ 200 Hz Sampling │       │ Weighted Health │       │ Automated Step- │
│ & thermal drift │       │ via ESP32 Edge  │       │ Index + SAE DTC │       │ by-Step Fixes   │
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

#### 📦 Box 1 (Left 50%): What Makes MotoMindX Different?
- **Spatial 3D Digital Twin:** Rather than abstract numerical graphs, telemetry dynamically updates a 3D WebGL model with real-time component heatmaps.
- **Multi-Domain Health Indexing:** Separate sub-scores for **Powertrain (30%)**, **BMS/Electrical (25%)**, **Thermal (20%)**, and **Braking (15%)**.
- **Closed-Loop Resolution:** Connects anomaly detection directly to SAE standard diagnostic codes (DTCs), mechanic repair guides, and parts requisitions.

---

#### 📦 Box 2 (Right 50%): What We Have Actually Validated (Evidence)
- **✅ Working End-to-End Pipeline:** Real sensor acquisition (MPU-6050 + K-Type + Hall Effect) $\rightarrow$ ESP32 edge processing $\rightarrow$ Cloud ingestion $\rightarrow$ 3D Twin visualization.
- **✅ Live Interactive WebGL Prototype:** Tested live on browser at [rc-one-mu.vercel.app](https://rc-one-mu.vercel.app/).
- **✅ Sub-50ms Telemetry Sync:** Measured average latency of **42 ms** across live MQTT streaming.

---

### 🎙️ Presenter Script / Speaker Note (Slide 2)
> *"Instead of showing telemetry in isolated 2D charts, MotoMindX synchronizes real-time sensor streams into a 3D Digital Twin. When an anomaly occurs—such as motor bearing vibration or battery thermal rise—the system instantly localizes the fault, recalculates a multi-domain health index, and outputs an automated maintenance ticket with exact corrective actions."*

---

---

## 📑 SLIDE 3: Technical Architecture & System Workflow

### 🔹 Slide Title & Subtitle
**Hardware-to-Cloud Technical Architecture**  
*Robust Edge DSP, Low-Latency MQTT Transport, and 3D WebGL Synchronization*

---

### 🔹 Slide Layout & Content Boxes

#### 📊 Architecture Pipeline (Left to Right Visual Grid)

| 1. Physical Sensing | 2. Edge Computing | 3. Cloud & Diagnostic Engine | 4. Digital Twin & UI |
| :--- | :--- | :--- | :--- |
| **MPU-6050 (6-DOF):** 200Hz Vibration RMS & Accel<br>**MAX6675 K-Type:** Core Stator Temp<br>**A3144 Hall Effect:** Shaft RPM & Speed<br>**ACS712 Current:** Transient Amperage Draw | **ESP32 Dual-Core (240MHz)**<br>• FreeRTOS DMA Ring Buffer<br>• On-device Low-Pass & RMS DSP<br>• Dynamic Auto-Zero Calibration<br>• 64KB SPIFFS Offline Fail-Safe | **Ingestion & Processing**<br>• MQTT over TLS (QoS 1)<br>• Feature Extraction (RMS, dT/dt)<br>• Weighted Composite Health Index<br>• SAE J2012 Diagnostic Fault Engine | **Interactive Web Application**<br>• React 19 + TypeScript<br>• Three.js / WebGL 3D Model<br>• Real-time Dynamic Shaders<br>• One-Click Mechanic Bay Report |

---

#### 🏷️ Bottom Implementation Status Banner (Strict Technical Rigor)
- **🟢 LIVE & TESTED:** Sensor Acquisition Firmware, MQTT QoS 1 Transport, Composite Health Engine, 3D WebGL Twin, SAE DTC Mapper.
- **🟡 PROTOTYPE VALIDATED:** Random Forest Anomaly Classifier (Offline trained on 12,500 vibration/thermal frames; F1 = 0.941).
- **🔵 PLANNED (PHASE 2):** LSTM Remaining Useful Life (RUL) regression & Fleet-wide multi-tenant aggregation.

---

### 🎙️ Presenter Script / Speaker Note (Slide 3)
> *"Our architecture is built for real-world robustness. On the edge, our ESP32 node performs FreeRTOS-based DSP filtering to eliminate road noise before publishing over MQTT QoS 1. The cloud diagnostic layer computes our weighted health index and maps DTCs, which instantly render as color-coded thermal states on our Three.js Digital Twin."*

---

---

## 📑 SLIDE 4: Feasibility, Hardware BOM & Measured Performance

### 🔹 Slide Title & Subtitle
**Engineering Feasibility & Quantitative Validation**  
*Empirical Test Bench Metrics and Low-Cost Hardware Deployment*

---

### 🔹 Slide Layout & Content Boxes

#### 📦 Box 1 (Left 50%): Empirical Validation Matrix

| Parameter / Metric | Measured / Target | Methodology / Validation Setup |
| :--- | :--- | :--- |
| **Edge-to-Cloud Latency** | **42 ms** *(Measured)* | Round-trip ping/ack timing over 500 MQTT cycles (38–52 ms range) |
| **Sensor Sampling Rate** | **200 Hz** *(Measured)* | Hardware timer interrupt on ESP32 Core 0 with DMA buffer |
| **Anomaly Detection F1-Score**| **0.941 / 94.1%** *(Validated)*| 5-fold cross-validation on 12,500 labeled test bench telemetry frames |
| **False Positive Alarm Rate** | **< 2.4%** *(Validated)* | 48-hour continuous baseline run with moving average RMS filter |
| **Packet Loss Resilience** | **< 0.05%** *(Measured)* | Offline ring-buffer test simulating 60-second cellular signal drops |

---

#### 📦 Box 2 (Right 50%): Prototype Bill of Materials (BOM) & Edge Mitigations
- **Total Prototype Hardware Cost:** **₹1,785 (~$21.50)**
  - *ESP32 Node (₹450) + MPU-6050 (₹180) + MAX6675 (₹260) + ACS712 (₹160) + A3144 (₹45) + Power Reg & Case (₹690).*
- **Solved Engineering Challenges:**
  1. **Vibration Noise vs. Faults:** On-chip RMS & Crest Factor windowing separates road bumps from continuous mechanical bearing harmonic defects.
  2. **Thermal Drift:** Dynamic differential baseline calculation ($\Delta T = T_{\text{stator}} - T_{\text{ambient}}$) prevents false over-temp flags.
  3. **Network Drops:** MQTT QoS 1 with local SPIFFS flash buffer auto-syncs upon reconnect.

---

### 🎙️ Presenter Script / Speaker Note (Slide 4)
> *"We do not present theoretical assumptions—we present measured engineering results. Our prototype hardware costs just ₹1,785, achieves 42 ms average telemetry latency, and maintains a 94.1% F1-score in fault isolation. We have actively solved vibration noise and signal dropouts directly at the edge firmware level."*

---

---

## 📑 SLIDE 5: Expected Impact, Fleet Scalability & Roadmap

### 🔹 Slide Title & Subtitle
**Operational Impact & Fleet-Scale Viability**  
*From Single Prototype to Commercial Fleet Deployment*

---

### 🔹 Slide Layout & Content Boxes

#### 📦 Box 1 (Left 50%): Impact Analysis (Demonstrated vs. Projected)
- **Direct Demonstrated Outcomes (Prototype Level):**
  - Instant localization of degraded sub-assemblies (bearing wear, battery imbalance, over-temp).
  - Clear maintenance directives eliminating diagnostic guesswork.
- **Expected Operational Impact (Fleet Level):**
  - **35–45% Reduction in Unplanned Downtime** via 48-hour advance warning before failure.
  - **20–25% Lower Maintenance Costs** by eliminating arbitrary scheduled part replacements.
  - **Extended Battery & Motor Lifespan** by preventing thermal runaway and current overload.

---

#### 📦 Box 2 (Right 50%): Fleet Scaling Architecture & Roadmap
- **Scalable Messaging:** MQTT topic hierarchy (`fleet/{fleetId}/{vehicleId}/telemetry`) supporting 1,000+ nodes per cluster.
- **Enterprise Dashboard:** Fleet aggregation overview with prioritized risk ranking.
- **Development Roadmap:**
  - **Phase 1 (Current):** Single-vehicle multi-sensor edge node + 3D Digital Twin + Rule/ML diagnostic engine *(COMPLETED)*.
  - **Phase 2 (Next 6 Months):** Multi-vehicle fleet clustering, OBD-II CAN-FD integration, and LSTM Remaining Useful Life (RUL) models.
  - **Phase 3:** Automated OEM parts ordering integration via connected service networks.

---

### 🎙️ Presenter Script / Speaker Note (Slide 5)
> *"MotoMindX delivers immediate value for single vehicles and scales seamlessly to commercial fleets. By shifting from reactive breakdowns to early component-level warnings, fleet operators can reduce unplanned downtime by up to 40%. Our MQTT topic hierarchy is designed to support thousands of active vehicle nodes with zero architectural rework."*

---

---

## 📑 SLIDE 6: Research Grounding & Academic Differentiation

### 🔹 Slide Title & Subtitle
**Research Foundations & Literature Gaps**  
*Extending Academic State-of-the-Art into an Accessible Hardware-Twin Solution*

---

### 🔹 Slide Layout & Content Boxes

#### 📚 Academic Comparative Analysis

| Cited Research Paper | Core Principle Adopted | Gap Identified in Existing Work | **MotoMindX Innovation / Extension** |
| :--- | :--- | :--- | :--- |
| **Jardine et al. (2006)**<br>*Mech. Systems & Signal Proc.* | Condition-Based Maintenance (CBM) & vibration statistical indicators | Heavy focus on complex mathematical formulations with no operator visual UI | Implements real-time RMS/Crest DSP directly linked to intuitive 3D Digital Twin |
| **Tao et al. (2019)**<br>*Elsevier / Academic Press* | Digital Twin Driven Smart Manufacturing & Health State Modeling | High cost; reliant on expensive industrial PLCs and servers | Demonstrates ultra-low-cost (₹1,785) edge hardware streaming to browser WebGL |
| **Goyal & Dhami (2016)**<br>*Arch. Comput. Methods Eng.* | Motor condition monitoring via spectral vibration analysis | Limited to stationary steady-state factory induction motors | Adapts vibration & thermal metrics with dynamic baseline auto-zeroing for EV powertrains |

---

#### 🌟 Summary Takeaway
> **"MotoMindX turns machine sensor signals into component-level health intelligence and actionable maintenance decisions through an accessible, synchronized Digital Twin."**

---

### 🎙️ Presenter Script / Speaker Note (Slide 6)
> *"Our solution is grounded in established predictive maintenance literature. While past research demonstrated condition-based algorithms on expensive industrial machinery, MotoMindX democratizes this technology—combining sub-₹1,800 edge hardware with 3D WebGL Digital Twins to make proactive vehicle maintenance accessible, visual, and actionable. Thank you!"*

---
