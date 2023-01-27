
export class Version{

  constructor(version){
	this.version = version;
	let vmLength = version.indexOf('.') !== -1 ? version.indexOf('.') : version.length;
	this.versionMajor = parseInt(version.substr(0, vmLength));
	this.versionMinor = parseInt(version.substr(vmLength + 1) || 0);
  }

  newerThan(version){
	let v = new Version(version);
	return this.versionMajor > v.versionMajor || (this.versionMajor === v.versionMajor && this.versionMinor > v.versionMinor);
  }

  equalOrHigher(version){
	let v = new Version(version);
	return this.versionMajor > v.versionMajor || (this.versionMajor === v.versionMajor && this.versionMinor >= v.versionMinor);
  }

  upTo(version){
	return !this.newerThan(version);
  }

}



