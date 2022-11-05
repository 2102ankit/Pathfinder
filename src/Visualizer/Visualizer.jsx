import { Component } from 'react';
import Node from './NodeComponent/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import './PathfindingVisualizer.css';

const START_NODE_ROW = 8
const START_NODE_COL = 8
const FINISH_NODE_ROW = 8
const FINISH_NODE_COL = 31

export default class Visualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false
        }
    }

    componentDidMount() {
        const grid = getInitialGrid()
        this.setState({ grid })
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(
            this.state.grid, row, col
        )
        this.setState({ grid: newGrid, mouseIsPressed: true })
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });
    }

    handleMouseUp() {
        this.setState({ mouseIsPressed: false })
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(
                    () => {
                        this.animateShortestPath(nodesInShortestPathOrder);
                    }, 10 * i)
                return
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i]
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, 10 * i
            );
        }

    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {

            setTimeout(
                () => {
                    const node = nodesInShortestPathOrder[i];
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
                    if (`node-${node.row}-${node.col}`.isFinish) document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path node-finish';
                    if (`node-${node.row}-${node.col}`.isStart) document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path node-start';
                }, 50 * i
            );

        }
    }

    visualizeDijkstra() {
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL]
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];

        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);

        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
        nodesInShortestPathOrder[0].style.backgroundColor = 'green'
        nodesInShortestPathOrder[nodesInShortestPathOrder.length() - 1].style.backgroundColor = 'red'
        nodesInShortestPathOrder.shift();
        nodesInShortestPathOrder.pop();

    }

    clearFormat(grid) {
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[0].length; col++) {

                document.getElementById(`node-${row}-${col}`).className = 'node white';
                if (row === START_NODE_ROW && col === START_NODE_COL)
                    document.getElementById(`node-${row}-${col}`).className = 'node node-start';
                if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)
                    document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
            }

        }
    }

    reset() {
        const grid = getInitialGrid()
        this.setState({ grid })
        
        this.clearFormat(grid)
    }

    render() {
        const { grid, mouseIsPressed } = this.state;

        return (
            <div className='container'>
                <div>
                    <button className='button-27  ' onClick={
                        () => {
                            console.log("Chal jaa bhai")
                            this.visualizeDijkstra()
                        }
                    }>Visualize Dijkstra's Algorithm
                    </button>
                    <button className='button-27 reset' onClick={
                        () => {
                            console.log("reset ho bhai")
                            this.reset()
                        }
                    }>
                        Reset
                    </button>
                </div>
                    <div className='start-pt'>enter the start pt</div>
                    <input type="number" id="startpt" placeholder='x cor:'></input>
                    <input type="number" id="startpt" placeholder='y cor:'></input>
                    <div>enter the end pt</div>
                    <input type="number" placeholder='x cor:'></input>
                    <input type="number" id="startpt" placeholder='y cor:'></input>
                <div className='grid'>
                    {
                        grid.map(
                            (row, rowIdx) => {
                                return (
                                    <div key={rowIdx}>
                                        {row.map(
                                            (node, nodeIdx) => {
                                                const { row, col, isFinish, isStart, isWall, isVisited } = node;
                                                return (
                                                    <Node
                                                        key={nodeIdx}
                                                        row={row}
                                                        col={col}
                                                        isFinish={isFinish}
                                                        isStart={isStart}
                                                        isWall={isWall}
                                                        isVisited={isVisited}
                                                        mouseIsPressed={mouseIsPressed}
                                                        onMouseDown={
                                                            (row, col) => this.handleMouseDown(row, col)
                                                        }
                                                        onMouseEnter={
                                                            (row, col) => this.handleMouseEnter(row, col)
                                                        }
                                                        onMouseUp={
                                                            (row, col) => this.handleMouseUp()
                                                        }
                                                    ></Node>
                                                )
                                            }
                                        )}
                                    </div>
                                )
                            }
                        )
                    }

                </div>
            </div>
        )

    }

}
//const onclickstore=(id)=>{
//  return{ pt=document.getElementById("id").value,
//  console.log(pt)
//};
//}

const createNode = (col, row) => {
    return {
        col, row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null
    };
};

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row <17; row++) {
        const currentRow = [];
        for (let col = 0; col <40; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
}

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall
    }
    newGrid[row][col] = newNode;
    return newGrid;
}
