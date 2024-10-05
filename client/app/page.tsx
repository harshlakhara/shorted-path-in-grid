"use client";

import React, { useState } from "react";
import Loader from "@components/Loader";

const WIDTH = 20;
const HEIGHT = 20;

const COLUMNs = new Array(WIDTH).fill(0);
const GRID = new Array(HEIGHT).fill(COLUMNs);

const Home = () => {
  const [selectedBlocks, setSelectedBlocks] = useState<Array<String>>([]);
  const [obstaclesBlocks, setObstaclesBlocks] = useState<Array<String>>([]);
  const [path, setPath] = useState<{ [x: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);

  const findPath = async () => {
    setIsLoading(true);
    if (selectedBlocks.length < 2) return;
    const coordinates = selectedBlocks.map((block) =>
      block.split(",").map((e) => parseInt(e))
    );
    const obstacles = obstaclesBlocks.map((block) => {
      const [x, y] = block.split(",").map((e) => parseInt(e));
      return { x, y };
    });
    const start = { x: coordinates[0][0], y: coordinates[0][1] };
    const end = { x: coordinates[1][0], y: coordinates[1][1] };
    const body = {
      start,
      end,
      obstacles,
      rows: Math.max(start.x, end.x) + 1,
      cols: Math.max(start.y, end.y) + 1,
    };
    try {
      const response = await fetch("http://localhost:8080/find-path", {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = (await response.json()) as Array<typeof start>;
      if (json) {
        const pathMap = json.reduce(
          (prev, coord) => ({ ...prev, [`${coord.x},${coord.y}`]: true }),
          {}
        );
        setPath(pathMap);
      } else {
        setPath({});
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (x: number, y: number) => {
    if (selectedBlocks.length >= 2) {
      selectedBlocks.shift();
      setSelectedBlocks(selectedBlocks);
    }
    setSelectedBlocks([...selectedBlocks, `${x},${y}`]);
  };

  const addObstacles = (x: number, y: number) => {
    const coords = `${x},${y}`;
    if (obstaclesBlocks.includes(coords)) {
      setObstaclesBlocks(obstaclesBlocks.filter((blc) => blc != coords));
    } else if (!selectedBlocks.includes(coords)) {
      setObstaclesBlocks([...obstaclesBlocks, coords]);
    }
  };

  const resetGrid = () => {
    setSelectedBlocks([]);
    setPath({});
  };
  return (
    <div className="flex flex-col align-middle justify-center mx-auto max-w-fit">
      <div>
        <h1 className="text-center h-8 text-lg">GRID</h1>
        <div className="my-3">
          <h3>Legend</h3>
          <p>
            <span className="bg-yellow-400 inline-block w-4 h-4"></span>
            &nbsp; Source/Destination {"  "}
            <span className="bg-red-700 inline-block w-4 h-4"></span>
            &nbsp; Obstacles {"  "}
            <span className="bg-blue-600 inline-block w-4 h-4"></span>
            &nbsp; Path
          </p>
          <p className="mt-3">
            <code>Click</code> to add{" "}
            <span className="text-yellow-400">Source & Destination</span> <br />
            <code>Ctrl + click</code> to add{" "}
            <span className="text-red-500">Obstacles</span>
          </p>
        </div>
      </div>
      <div>
        {GRID.map((i, ix) => (
          <div key={ix} className="flex justify-normal gap-2 mb-2">
            {i.map((j: number, iy: number) => (
              <span
                key={iy}
                onClick={(e) => {
                  if (e.ctrlKey) addObstacles(ix, iy);
                  selectedBlocks.length < 2 && handleSelect(ix, iy);
                }}
                className={` block w-4 h-4 cursor-pointer ${
                  selectedBlocks.includes(`${ix},${iy}`)
                    ? "bg-yellow-400"
                    : path[`${ix},${iy}`]
                    ? "bg-blue-600"
                    : obstaclesBlocks.includes(`${ix},${iy}`)
                    ? "bg-red-700"
                    : "bg-slate-500"
                }`}
              ></span>
            ))}
          </div>
        ))}
      </div>
      <button
        disabled={selectedBlocks.length < 2}
        onClick={() => findPath()}
        type="button"
        className={`mb-3 bg-white font-bold text-purple-950 ${
          selectedBlocks.length < 2 ? "opacity-50" : "opacity-100"
        }`}
      >
        Find Path
      </button>
      <button
        className={`bg-white font-bold text-purple-950 ${
          selectedBlocks.length < 2 ? "opacity-50" : "opacity-100"
        }`}
        disabled={Object.keys(path).length == 0}
        type="button"
        onClick={() => {
          resetGrid();
        }}
      >
        Reset
      </button>
      {isLoading && <Loader />}
    </div>
  );
};

export default Home;
