import * as THREE from "../../libs/three.js/build/three.module.js";
import {Profile} from "./Profile.js";
import {Utils} from "../utils.js";
import { EventDispatcher } from "../EventDispatcher.js";


export class ProfileTool extends EventDispatcher {
constructor(viewer) {
	super();
	this.viewer = viewer;
	this.renderer = viewer.renderer;
	this.profiles = new Set();
	this.addEventListener('start_inserting_profile', e => {
		this.viewer.dispatchEvent({
			type: 'cancel_insertions'
		});
	});
	this.scene = new THREE.Scene();
	this.scene.name = 'scene_profile';
	this.light = new THREE.PointLight(0xffffff, 1.0);
	this.scene.add(this.light);
	this.viewer.inputHandler.registerInteractiveScene(this.scene);
	this.update = e => {};
	this.render = e => {};
	this.onSceneChange = e => {};
	this.onProfileChange = e => {
		if(e.type === 'profile_added') {
			this.profiles.add(e.profile);
			this.scene.add(e.profile);
		} else if(e.type === 'profile_removed') {
			this.profiles.delete(e.profile);
			this.scene.remove(e.profile);
		}
	}
	viewer.addEventListener("update", this.update);
	viewer.addEventListener("render.pass.perspective_overlay", this.render);
	viewer.addEventListener("scene_changed", this.onSceneChange);
	viewer.scene.addEventListener('profile_added', this.onProfileChange);
	viewer.scene.addEventListener('profile_removed', this.onProfileChange);
}


	onSceneChange(e){
		if(e.oldScene){
			e.oldScene.removeEventListeners('profile_added', this.onAdd);
			e.oldScene.removeEventListeners('profile_removed', this.onRemove);
		}

		e.scene.addEventListener('profile_added', this.onAdd);
		e.scene.addEventListener('profile_removed', this.onRemove);
	}

	startInsertion (args = {}) {
		let domElement = this.viewer.renderer.domElement;
	
		let profile = new Profile();
		profile.name = args.name || 'Profile';
	
		this.dispatchEvent({
			type: 'start_inserting_profile',
			profile: profile
		});
	
		this.scene.add(profile);
	
		let cancel = {
			callback: null
		};
	
		let camera = this.viewer.scene.getActiveCamera();
		let clientSize = this.viewer.renderer.getSize(new THREE.Vector2());
		let insertionCallback = (e) => {
			if(e.button === THREE.MOUSE.LEFT){
				if(profile.points.length <= 1){
					let distance = camera.position.distanceTo(profile.points[0]);
					let pr = Utils.projectedRadius(1, camera, distance, clientSize.width, clientSize.height);
					let width = (10 / pr);
					profile.setWidth(width);
				}
	
				profile.addMarker(profile.points[profile.points.length - 1].clone());
	
				this.viewer.inputHandler.startDragging(
					profile.spheres[profile.spheres.length - 1]);
			} else if (e.button === THREE.MOUSE.RIGHT) {
				cancel.callback();
			}
		};
	
		cancel.callback = e => {
			profile.removeMarker(profile.points.length - 1);
			domElement.removeEventListener('mouseup', insertionCallback, false);
			this.viewer.removeEventListener('cancel_insertions', cancel.callback);
		};
	
		this.viewer.addEventListener('cancel_insertions', cancel.callback);
		domElement.addEventListener('mouseup', insertionCallback, false);
	
		profile.addMarker(new THREE.Vector3(0, 0, 0));
		this.viewer.inputHandler.startDragging(
			profile.spheres[profile.spheres.length - 1]);
	
		this.viewer.scene.addProfile(profile);
	
		return profile;
	}

	
	
	update() {
	  const camera = this.viewer.scene.getActiveCamera();
	  const profiles = this.viewer.scene.profiles;
	  const { width: clientWidth, height: clientHeight } = this.viewer.renderer.getSize(new THREE.Vector2());
	  this.light.position.copy(camera.position);
	  
	  // make size independent of distance
	  for (const profile of profiles) {
		for (const sphere of profile.spheres) {
		  const distance = camera.position.distanceTo(sphere.getWorldPosition(new THREE.Vector3()));
		  const pr = Utils.projectedRadius(1, camera, distance, clientWidth, clientHeight);
		  const scale = 15 / pr;
		  sphere.scale.set(scale, scale, scale);
		}
	  }
	}
	

	render(){
		this.viewer.renderer.render(this.scene, this.viewer.scene.getActiveCamera());
	}

}
