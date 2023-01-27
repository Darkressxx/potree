import {EventDispatcher} from "./EventDispatcher.js";

const DEFAULT_ICON = '';

export class Action extends EventDispatcher {
    constructor ({ icon = DEFAULT_ICON, tooltip, onclick } = {}) {
        super();
        this.icon = icon;
        this.tooltip = tooltip;
        this.onclick = onclick || this.onclick;
    }

    onclick (event) { }

    pairWith (object) { }

    setIcon (newIcon) {
        if (newIcon === this.icon) {
            return;
        }
        const oldIcon = this.icon;
        this.icon = newIcon;
        this.dispatchEvent({
            type: 'icon_changed',
            action: this,
            icon: newIcon,
            oldIcon
        });
    }
}