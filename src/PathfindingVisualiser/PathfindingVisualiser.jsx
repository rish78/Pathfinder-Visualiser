import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import './PathfindingVisualiser.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualiser extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,

      speed: "avg",

      locked: false

    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }


  handleSpeedChange = (e) => {
    this.setState({speed:e.target.value})
  };


  lockGrid(){
    this.setState({locked: true});
  };

  unLockGrid(){
    this.setState({locked: false});
  }
  
  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    const {speed} = this.state;
    var n = 10;
    speed === 'avg' ? n=10 : speed === "fast" ? n=3 : n=25;
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, n * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];

        if (!node.isStart && !node.isFinish) {
           document.getElementById(`node-${node.row}-${node.col}`).className =
             'node node-visited';    
        }
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {

    const {speed} = this.state;
    var n = 50;
    speed === 'avg' ? n=50 : speed === "fast" ? n=25 : n=70;
    
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {    
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (!node.isStart && !node.isFinish) {
           document.getElementById(`node-${node.row}-${node.col}`).className =
             'node node-shortest-path';  
        }
        if(i === nodesInShortestPathOrder.length-1) this.unLockGrid(); // make it possible again to change, clear grid
      }, 50 * i);

    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    this.lockGrid(); // make it impossible to change in grid until finishing visualizing
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  clearGrid(){
    if (this.state.locked) return;
    const {grid} = this.state;
    for(let row=0;row<grid.length;row++){
      for(let col=0;col<grid[row].length;col++){
        if(row === START_NODE_ROW && col === START_NODE_COL){
          document.getElementById(`node-${row}-${col}`).className ='node node-start';
          continue;
        }
        if(row === FINISH_NODE_ROW && col === FINISH_NODE_COL){
          document.getElementById(`node-${row}-${col}`).className ='node node-finish';
          continue;
        }
        document.getElementById(`node-${row}-${col}`).className ='node';
      }
    }
  }
  //We take the value of the option element when a button is clicked and then compare it with 
  //the string values of all the algorithms we would implement. When an algorithm 
  //matches, its function (like this.visualizeDijkstra()) is called
    chooseAlgorithm(){
      const algorithm = document.getElementById("algos").value;
      if(algorithm === "Dijkstra"){
        this.visualizeDijkstra();
      }
      else if(algorithm === "Algo2"){
        alert("Algorithm 2 hasn't been implemented yet");
      }
      else if(algorithm === "Algo3"){
        alert("Algorithm 3 hasn't been implemented yet");
      }
  }


  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        {/* Dropdown menu to select algorithm*/}
        <div className = "dropDown">
          <select id="algos">
            <option value="notAlgo">
               Select an algorithm
            </option>
            <option value="Dijkstra">
                Dijkstra Algorithm
            </option>
            <option value="Algo2">
                Algorithm 2
            </option>
            <option value="Algo3">
                Algorithm 3
            </option>
          </select>
          <button onClick={() => this.chooseAlgorithm()}>
                Visualize
          </button>
        </div>

        {/* Dropdown menu to select speed */}
        
        <div className="speed">
          <label for="speed">Choose a Speed: </label>
          <select 
          name="speed"
          value={this.state.speed} 
          onChange={this.handleSpeedChange}
          >
            <option value="slow">Slow</option>
            <option value="avg">Average</option>
            <option value="fast">Fast</option>
          </select>
        </div>

        <button disabled = {this.state.locked} onClick={() => this.clearGrid()}>
          Clear Grid
        </button>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};