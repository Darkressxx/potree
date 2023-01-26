
/**
 * @author mrdoob / http://mrdoob.com/ https://github.com/mrdoob/eventdispatcher.js
 * 
 * with slight modifications by mschuetz, http://potree.org
 * and some extra optimization by Darkressxx
 * 
 */

// The MIT License
// 
// Copyright (c) 2011 Mr.doob
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

export class EventDispatcher {
    constructor() {
        this._listeners = new Map();
    }

    addEventListener(type, listener) {
        let listeners = this._listeners;
        let listenerArray = listeners.get(type);
        if (!listenerArray) {
            listenerArray = new Set();
            listeners.set(type, listenerArray);
        }
        listenerArray.add(listener);
    }

    hasEventListener(type, listener) {
        let listenerArray = this._listeners.get(type);
        return listenerArray && listenerArray.has(listener);
    }

    removeEventListener(type, listener) {
        let listenerArray = this._listeners.get(type);
        if (listenerArray) {
            listenerArray.delete(listener);
        }
    }

    removeEventListeners(type) {
        this._listeners.delete(type);
    }

    dispatchEvent(event) {
        let listenerArray = this._listeners.get(event.type);
        if (listenerArray) {
            event.target = this;
            listenerArray.forEach(listener => listener.call(this,event));
        }
    }
}
