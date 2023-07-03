/**
 * ref: https://www.rainbowkit.com/docs/installation#additional-build-tooling-setup
 */

import { Buffer } from "buffer";

window.global = window.global ?? window;
window.Buffer = window.Buffer ?? Buffer;
window.process = window.process ?? { env: {} }; // Minimal process polyfill

export {};
