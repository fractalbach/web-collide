// avltree.js

/*
    compareFunction:  f(key1, key2) => boolean

    returns TRUE if key1 is ordered BEFORE key2,
    returns FALSE if key1 is ordered AFTER key2.

    A function that compares 2 items that are stored in the AVL tree.
    Ideally, it should look something "like less than or equals to", which
    would provide a total order.
*/
const AVLTree = (function(){



class Node {
    constructor(key) {
        this.left = undefined;
        this.right = undefined;
        this.parent = undefined;
        this.height = 1;
        this.key = key;
    }
}


class _AVLTree {
    constructor(compareFunction) {
        this.compare = compareFunction;
        this.treeRoot = undefined;
    }

    height(node) {
        if (node === undefined) {
            return -1;
        }
        return node.height;
    }

    updateHeight(node) {
        node.height = 1 + Math.max(
            this.height(node.left), this.height(node.right)
        );
    }

    rebalance(node) {
        if (node === undefined) {
            return;
        }
        this.updateHeight(node);
        if (this.height(node.left) >= 2 + this.height(node.right)) {
            if (this.height(node.left.left) >= this.height(node.left.right)) {
                this.rightRotate(node);
            } else {
                this.leftRotate(node.left);
                this.rightRotate(node);
            }
        } else if (this.height(node.right) >= 2 + this.height(node.left)) {
            if (this.height(node.right.right) >= this.height(node.right.left)) {
                this.leftRotate(node);
            } else {
                this.rightRotate(node.right);
                this.leftRotate(node);
            }
        }
        this.rebalance(node.parent);
    }

    insert(key) {
        if (this.treeRoot === undefined) {
            this.treeRoot = new Node(key);
            return;
        }
        let parent = undefined;
        let node = this.treeRoot;
        while (true) {
            if (this.compare(key, node.key) === true) {
                parent = node;
                node = node.left;
                if (node === undefined) {
                    let node = new Node(key);
                    node.parent = parent;
                    parent.right = node;
                    this.rebalance(node);
                    return;
                }
            } else {
                parent = node;
                node = node.right;
                if (node === undefined) {
                    let node = new Node(key);
                    node.parent = parent;
                    parent.right = node;
                    this.rebalance(node);
                    return;
                }
            }
        }
    }

    swapParents(x, y) {
        let p = x.parent;
        if (p === undefined) {
            this.treeRoot = y;
        } else {
            if (p.left == x) {
                p.left = y;
            }
            if (p.right == x) {
                p.right = y;
            }
        }
        y.parent = p;
        x.parent = y;
    }

    rightRotate(x) {
        let y = x.left;
        this.swapParents(x, y);
        x.left = y.right;
        if (y.right !== undefined) {
            y.right.parent = x;
        }
        y.right = x;
        this.updateHeight(x);
        this.updateHeight(y);
    }

    leftRotate(x) {
        let y = x.right;
        this.swapParents(x, y);
        x.right = y.left;
        if (y.left !== undefined) {
            y.left.parent = x;
        }
        y.left = x;
        this.updateHeight(x);
        this.updateHeight(y);
    }

    preorder(root) {
        if (root === undefined) {
            return;
        }
        console.log(root.key);
        this.preorder(root.left);
        this.preorder(root.right);
    }

    // clearAll will delete every node in the tree. Use post-order traversal.
    // clearAll() {
    //     let node = this.treeRoot;
    //     while (node !== undefined) {
    //         if (this.left !== undefined) {
    //             console.log(node);
    //         }
    //     }
    //     this.treeRoot
    // }
}


class AVLTree {
    constructor(compareFunction) {
        if (compareFunction === undefined) {
            // console.warn("AVLTree: no comparision function specified. Default is '<=' operator.");
            compareFunction = (a, b)=>(a <= b);
        }
        this.tree = new _AVLTree(compareFunction);
    }

    insert(key) {
        this.tree.insert(key);
    }

    preorder() {
        this.tree.preorder(this.tree.treeRoot);
    }
}


return AVLTree;
}());


var runTest = ()=> {

    // define the dataset and tests.
    const SIZE  = 1 << 20;
    const START = 5;
    const STOP  = 20;
    const nFUNC = (n) => (1<<n)

    // build data set.
    let dataset = new Array(SIZE);
    for (let i = 0; i < SIZE; i++) {
        dataset[i] = Math.random();
    }

    // create an object to store the results in.
    let results = [];

    // re-use the same variable for the AVLTree.
    // We don't need to recreate nodes each time.
    let tree = new AVLTree();

    // run each of the tests with a different value for N.
    for (let i=START; i<STOP; i++) {
        let n = nFUNC(i);
        console.log(`starting test with size = ${n}`)

        // start fresh.
        tree = new AVLTree();

        // start timer.
        let t0 = performance.now();

        // insert n values into the AVL tree. Expected O(n*log(n)) total.
        for (let i=0; i<n; i++) {
            tree.insert(dataset[i]);
        }

        // finish timer and print result.
        let tf = performance.now();
        let time = tf - t0;
        // console.log(`dataset size of: ${n}, height of root: ${tree.tree.treeRoot.height}`, tree);
        let height = tree.tree.treeRoot.height
        results.push({n, time, height});
    }
    console.log(results);

    // add data to graph.
    let data = [];
    for (let row of results) {
        let item = {
            x: row.n,
            y: row.time
        };
        data.push(item);
    }
    return data;
}
