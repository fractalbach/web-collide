// avltree_test.js

// Benchmarking AVL Insertion

var runTest = (callback)=> {

    const NUM_TESTS = 10;

    const TESTS = (()=>{
        arr = Array(NUM_TESTS);
        for (let i = 0; i < NUM_TESTS; i++) {
            arr[i] = (i + 1) * (10**5) ;
        };
        return arr;
    })();

    const DATASET_SIZE = arr.slice(-1)[0];

    let dataset = new Array(DATASET_SIZE);
    for (let i = 0; i < DATASET_SIZE; i++) {
        dataset[i] = Math.random() * 10**6;
    }

    // create an object to store the results in.
    let results = [];

    // re-use the same variable for the AVLTree.
    // We don't need to recreate nodes each time.
    let tree = undefined;

    // run each of the tests with a different value for N.
    for (let i = 0; i < NUM_TESTS; i++) {
        let n = TESTS[i];
        console.log(`starting test with size = ${n}`)

        // start fresh.
        tree =  new AVLTree();

        performance.clearMarks();
        performance.clearMeasures();

        // insert n values into the AVL tree. Expected O(n*log(n)) total.
        let t0 = performance.mark('start');
        for (let i=0; i<n; i++) {
            tree.insert(dataset[i]);
        }
        let tf = performance.mark('end');
        performance.measure('runtime', 'start', 'end');

        // finish timer and print result.
        let time = performance.getEntriesByName('runtime')[0].duration

        console.log(`dataset size of: ${n}, height of root: ${tree.tree.treeRoot.height}`, tree);

        let height = tree.tree.treeRoot.height
        results.push({
            x: n,
            y: time
        });
        callback(results.slice(-1)[0]);
    }
    console.log(results);
    return results;
}
