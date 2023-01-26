
import * as THREE from "../libs/three.js/build/three.module.js";
import { EventDispatcher } from "./EventDispatcher.js";


class PointCloudTreeNode extends EventDispatcher {
    constructor() {
        super();
        this.needsTransformUpdate = true;
    }

    getChildren() {}
    getBoundingBox() {}
    isLoaded() {}
    isGeometryNode() {}
    isTreeNode() {}
    getLevel() {}
    getBoundingSphere() {}
}

class PointCloudTree extends THREE.Object3D {
    constructor() {
        super();
    }

    initialized() {
        return this.root !== null;
    }
}

export { PointCloudTree, PointCloudTreeNode };
