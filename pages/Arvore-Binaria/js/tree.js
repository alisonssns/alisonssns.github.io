const tree = new BinaryTree();
const binaryTreeContainer = document.querySelector(".binaryTree");

function addNode(value) {
    if (value) {
        const newNode = tree.insert(value);
        createNode(newNode);
    }
}

function createNode(node) {
    const newNodeElement = document.createElement("div");
    newNodeElement.className = "node";
    newNodeElement.id = `ID${node.id}`;
    newNodeElement.textContent = node.value;
    newNodeElement.level = node.level;

    newNodeElement.addEventListener("click", () => {
        alert(`Altura do nó ${node.value} é ${tree.nodeHeight(node)}`);
    });

    if (node.parentNode) {
        const parentNodeElement = document.querySelector(`#ID${node.parentNode.id}`);
        const isLeftChild = node.value < parentNodeElement.textContent;
        const horizontalOffset = 50;
        const verticalOffset = 80;

        newNodeElement.style.top = `${parentNodeElement.offsetTop + verticalOffset}px`;
        if (isLeftChild) {
            newNodeElement.style.left = `${parentNodeElement.offsetLeft - horizontalOffset}px`;
        } else {
            newNodeElement.style.left = `${parentNodeElement.offsetLeft + horizontalOffset}px`;
        }
    } else {
        newNodeElement.style.top = `50px`;
        newNodeElement.style.left = `200px`;
    }

    binaryTreeContainer.appendChild(newNodeElement);
    check(node);
    if (node.parentNode) { tree.traceLine(node, node.parentNode) }
}

function makeTree() {
    const inputValue = document.getElementById("value").value.toUpperCase();
    const cleanedValue = inputValue.replace(/\s+/g, '');
    const valueArray = cleanedValue.split("");

    for (let i = 0; i < valueArray.length; i++) {
        setTimeout(() => {
            addNode(valueArray[i]);
        }, 150 * i);
    }
}

function highlight(node, color) {
    const htmlNodeElement = document.querySelector(`#ID${node.id}`);
    htmlNodeElement.style.backgroundColor = color;
}

function hide(node) {
    const htmlNodeElement = document.querySelector(`#ID${node.id}`);
    htmlNodeElement.style.backgroundColor = "#fda085";
}

function check(node) {
    let collisionNodes = [];
    tree.check(node.level, collisionNodes);
    if (collisionNodes.length > 1) {
        for (let collisionNode of collisionNodes) {
            if (node.id !== collisionNode.id) {
                if (checkCollision(node, collisionNode)) {
                    let ancestor = tree.findCommonAncestor(node, collisionNode);
                    tree.adjustSubtreeSpacing(ancestor)
                    tree.updateLines(ancestor)
                    tree.checkAll();
                }
            }
        }
    }
}

function checkCollision(node1, node2) {
    const node1Element = document.querySelector(`#ID${node1.id}`);
    const node2Element = document.querySelector(`#ID${node2.id}`);
    let space = 30;

    let left1 = node1Element.offsetLeft - space;
    let right1 = node1Element.offsetLeft + node1Element.offsetWidth + space;

    let left2 = node2Element.offsetLeft - space;
    let right2 = node2Element.offsetLeft + node2Element.offsetWidth + space;

    if (right1 >= left2 && left1 <= right2) {
        return true;
    } else {
        return false;
    }
}

function updateLines(node) {
    if (!node) return;

    const existingLine = document.querySelector(`#LINE${node.id}`);
    if (existingLine) {
        existingLine.remove();
    }

    tree.traceLine(node, node.parentNode)
}

function print() {
    tree.print();
}

function showSize() {
    const size = tree.getSize();
    alert(`O tamanho da árvore é: ${size}`);
}

function showHeight() {
    const result = tree.getHeight();
    alert(`A altura da árvore é: ${result}`);
}