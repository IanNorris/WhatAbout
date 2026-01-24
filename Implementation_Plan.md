# Implementation Plan - "What About"

## Goal Description
Create a client-side web application "What About" that changes minds on complex topics using Ink (Inkle) scripts. The UI features an ethereal "thought cloud" aesthetic. The Hub lists various controversial topics beginning with "Let's talk about...". Each topic starts with a premise ("I think X") and explores counter-arguments ("What about Y?").

## User Review Required
- **Script Handling**: We will use the local `inklecate_win.exe` found in the `Inky` directory to compile our `.ink` scripts to JSON.
- **First Topic**: "Age Verification". Focus on the VPN loophole and the "Straw" analogy for encrypted traffic.

## Proposed Changes

### Tech Stack
- **Build Tool**: Vite (Fast, optimized for static sites).
- **Framework**: React (Great for managing UI state like conversation history and overlays).
- **Styling**: Vanilla CSS / CSS Modules (For custom "ethereal" animations without Tailwind overhead).
- **Logic**: `inkjs` (To runtime the compiled Ink scripts).

### Project Structure
- `WhatAbout/src/`
    - `assets/`: Static files (images, diagrams).
    - `components/`: UI Components.
        - `Layout.jsx`: Main wrapper with Background.
        - `CloudBackground.jsx`: The "ethereal" background logic.
        - `Hub.jsx`: Main menu.
        - `TopicView.jsx`: The reading interface.
        - `OverlayMenu.jsx`: The "X" button interaction.
    - `hooks/`:
        - `useInkStory.js`: Manages the InkJS runtime.
    - `stories/`: Compiled `.json` Ink files.

### Components Logic

#### CloudBackground
- CSS Keyframes or simplified Canvas for floating, abstract blobs/clouds.
- Soft colors, gradients.

#### TopicView
- **State**: `history` (array of {text, type}), `currentChoices` (array), `isOverlayOpen` (bool).
- **Behavior**:
    - Loads designated JSON story.
    - Renders text in a scrollable container.
    - Renders choices at the bottom.
    - Listens for Ink tags for diagrams.

#### Navigation / Stack
- Since it's a SPA, we can manage "Stack" in a global state or React Context.
- "Take me back to... <stack>" implies we need to track the path (Hub -> Topic A -> Topic B).

## Verification Plan

### Automated Tests
- Basic rendering tests for components.

### Manual Verification
- Load a dummy Ink script.
- Verify "Thought Cloud" animation looks good (no lag).
- Verify navigation (Hub -> Topic -> Back -> Options).
- Verify "Share" link functionality.
