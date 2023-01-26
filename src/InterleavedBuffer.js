export class InterleavedBufferAttribute {
	constructor(name, bytes, numElements, type, normalized) {
		this.name = name;
		this.bytes = bytes;
		this.numElements = numElements;
		this.type = type;
		this.normalized = normalized;
	}
}

export class InterleavedBuffer {
	constructor(data, attributes, numElements) {
		this.data = data;
		this.attributes = attributes;
		this.numElements = numElements;
		this.stride = this.computeStride();
		this.attributeOffsets = new Map(attributes.map(({name, bytes}) => [name, bytes]));
	}

	computeStride() {
		let stride = 0;
		for (let att of this.attributes) {
			stride += att.bytes;
		}
		return (stride + 3) & ~3;
	}

	offset(name) {
		return this.attributeOffsets.get(name) || null;
	}
}
