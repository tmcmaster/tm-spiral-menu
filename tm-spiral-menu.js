import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `tm-spiral-menu`
 * Polymer spiral menu web component
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class TmSpiralMenu extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'tm-spiral-menu',
      },
    };
  }
}

window.customElements.define('tm-spiral-menu', TmSpiralMenu);
