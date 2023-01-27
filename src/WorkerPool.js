export class WorkerPool {
  constructor() {
	this.workers = {};
	this.maxWorkers = 5;
  }

  getWorker(url) {
	if (!this.workers[url]) {
	  this.workers[url] = [];
	}

	let worker;
	if (this.workers[url].length === 0) {
	  if (this.workers[url].length < this.maxWorkers) {
		worker = new Worker(url);
	  } else {
		// return null or throw an error if maximum number of workers is reached
	  }
	} else {
	  worker = this.workers[url].pop();
	}

	return worker;
  }

  returnWorker(url, worker) {
	this.workers[url].push(worker);
  }
};


//Potree.workerPool = new Potree.WorkerPool();
