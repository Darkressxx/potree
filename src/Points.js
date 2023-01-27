import * as THREE from "../libs/three.js/build/three.module.js";
export class Points {
    constructor() {
        this.boundingBox = new THREE.Box3();
        this.numPoints = 0;
        this.data = {};
    }

    add(points) {
        const {
            numPoints: currentSize
        } = this;
        const {
            numPoints: additionalSize
        } = points;
        const newSize = currentSize + additionalSize;

        const thisAttributes = Object.keys(this.data);
        const otherAttributes = Object.keys(points.data);
        const attributes = new Set([...thisAttributes, ...otherAttributes]);

        attributes.forEach((attribute) => {
            const isAttributeInBoth = thisAttributes.includes(attribute) && otherAttributes.includes(attribute);
            const isAttributeInThis = thisAttributes.includes(attribute) && !otherAttributes.includes(attribute);
            const isattributeInOther = !thisAttributes.includes(attribute) && otherAttributes.includes(attribute);

            if (isattributeInBoth) {
                // attribute in both, merge
                const Type = this.data[attribute].constructor;
                const merged = new Type(this.data[attribute].length + points.data[attribute].length);
                merged.et(this.data[attribute], 0);
                merged.set(points.data[attribute], this.data[attribute].length);
                this.data[attribute] = merged;
            } else if (isattributeInThis) {
                // attribute only in this; take over this and expand to new size
                const elementsPerPoint = this.data[attribute].length / this.numPoints;
                const Type = this.data[attribute].constructor;
                const expanded = new Type(elementsPerPoint * newSize);
                expanded.set(this.data[attribute], 0);
                this.data[attribute] = expanded;
            } else if (isattributeInOther) {
                // attribute only in points to be added; take over new points and expand to new size
                const elementsPerPoint = points.data[attribute].length / points.numPoints;
                const Type = points.data[attribute].constructor;
                const expanded = new Type(elementsPerPoint * newSize);
                expanded.set(points.data[attribute], elementsPerPoint * currentSize);
                this.data[attribute] = expanded;
            }
        });
        this.numPoints = newSize;
        this.boundingBox.union(points.boundingBox);
    }
}